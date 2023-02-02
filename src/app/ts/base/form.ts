import ErrorHint from '../../../components/error-hint/error-hint';
import Input from '../../../components/input/input';
import Textarea from '../../../components/textarea/textarea';
import { UserCatData } from '../../types/common';
import Component, { ComponentProps } from './base';

export default abstract class BaseForm extends Component {
    form: HTMLFormElement | undefined;
    inputs: Array<Input | Textarea> = [];
    preview: HTMLElement | undefined;
    errorHint: ErrorHint;

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.form = this.nRoot.nodeName === 'FORM' ?
            this.nRoot as HTMLFormElement
            : this.nRoot.querySelector<HTMLFormElement>('form')!; 
            
        this.form.querySelectorAll('input').forEach(input =>
            this.inputs
                .push(new Input({ name: 'field', component: input.parentElement! })));
        this.form.querySelectorAll('textarea').forEach(ta =>
            this.inputs
                .push(new Textarea({ name: 'field', component: ta.parentElement! })));
        this.preview = this.getElement('img');
        const hintEl = this.nRoot.querySelector<HTMLElement>('.error-hint');
        if (hintEl) {
            this.errorHint = new ErrorHint({ name: 'error-hint', component: hintEl })
        }

        this.init();
    }

    init = () => {
        const imgLink = this.form?.querySelector('#link');
        if(imgLink) {
            imgLink.addEventListener('change', this.setPreview);
        }
    }

    setPreview = (e: Event) => {
        if (this.preview) {
            const value = (e.target as HTMLInputElement)?.value;
            if (value && value.includes('http')) {
                this.preview.style.backgroundImage = `url(${value})`;
            } else {
                this.preview.style.backgroundImage = `url('https://cdn0.iconfinder.com/data/icons/file-and-document-41/100/file_document_doc-23-512.png')`;
            }
        }
    }

    collectFormData(): UserCatData {
        this.errorHint?.hide();
        const data = {} as UserCatData;
        this.inputs.forEach(input => {
            data[input.inputName] = input.getValue();
        });
        return data;
    }

    validateData(data: UserCatData) {
        const result = {
            valid: true,
            message: ''
        };
        for (const key in data) {
            if (typeof data[key] === 'string') {
                if (!data[key].length) {
                    result.valid = false;
                    result.message = 'Заполните все поля!'
                    break;
                }
                if (key === 'img_link' && !data[key].includes('http')) {
                    result.valid = false;
                    result.message = 'Введите корректную ссылку!'
                    break;
                }
            }
        }
        return result;
    }

    reset() {
        if (this.preview) {
            this.preview.style.backgroundImage = `url('https://cdn-icons-png.flaticon.com/512/1089/1089421.png')`;
        }
        this.inputs.forEach(input => input.clear());
        this.errorHint?.hide();
    }

    destroy = () => {
        this.reset();
        this.form?.querySelector('#link')?.removeEventListener('change', this.setPreview);
    };
}
