import Component, { ComponentProps } from '../../app/ts/base/base';
import { emit, setCookie } from '../../app/ts/helpers/helpers';
import { UserData } from '../../app/types/common';
import ErrorHint from '../error-hint/error-hint';
import Input from '../input/input';


export default class LoginForm extends Component {
    form: HTMLFormElement;
    inputs: Array<Input> = [];
    errorHint: ErrorHint;

    readonly cookiePrefix = 'catUser';

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.form = this.nRoot.nodeName === 'FORM' ? 
        this.nRoot as HTMLFormElement 
        : this.nRoot.querySelector<HTMLFormElement>('form')!; 
        
        this.form.querySelectorAll('input').forEach(input =>
                this.inputs
                    .push(new Input({ name: 'field', component: input.parentElement! })));
            
        const hintEl = this.nRoot.querySelector<HTMLElement>('.error-hint');
        if (hintEl) {
            this.errorHint = new ErrorHint({ name: 'error-hint', component: hintEl })
        }
    
        this.form.addEventListener('submit', this.onSubmit);
    }

    collectFormData(): UserData {
        this.errorHint?.hide();
        const data = {} as UserData;
        this.inputs.forEach(input => {
            data[input.inputName] = input.getValue();
        });
        return data;
    }

    validateData(data: UserData) {
        const result = {
            valid: true,
            message: ''
        };
        for (const key in data) {
                if (!data[key].length) {
                    result.valid = false;
                    result.message = 'Заполните все поля!'
                    break;
                }
                if(key === 'password' && data[key].length < 6) {
                    result.valid = false;
                    result.message = 'Пароль должен быть не менее 6 символов'
                    break;
                }
        }
        return result;
    }

    onSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            const data = this.collectFormData();
            const { valid, message } = this.validateData(data);
            if (valid) {
                for(let key in data) {
                    setCookie(this.cookiePrefix + key, data[key], {maxAge: 3600})
                }
                emit('user:update', true);
                this.nRoot.closest('.modal')?.classList.remove('_open');
                this.reset();
            } else {
                this.errorHint?.show(message || 'Ошибка загрузки данных');
            }
        } catch (error) {
            this.errorHint?.show(error.message);
        }
    }

    reset() {
        this.inputs.forEach(input => input.clear());
        this.errorHint?.hide();
    }

    destroy = () => {
        this.reset();
        this.form?.removeEventListener('submit', this.onSubmit);
    };
}
