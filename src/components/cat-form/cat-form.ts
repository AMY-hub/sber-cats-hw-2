import { ComponentProps } from '../../app/ts/base/base';
import { emit } from '../../app/ts/helpers/helpers';
import API from '../../app/ts/api';
import BaseForm from '../../app/ts/base/form';

export default class CatForm extends BaseForm {
    
    constructor(elProps: ComponentProps) {
        super(elProps);
        this.form?.addEventListener('submit', this.onSubmit);
    }
    
    onSubmit = async(e: Event) => {
        e.preventDefault();
        const data = this.collectFormData();
        const {valid, message} = this.validateData(data);
        if (valid) {
            const result = await API.addCat(data);

            if (!result.ok) {
                this.errorHint?.show('Ошибка загрузки данных');
            } else {
                const data = await result.json();
                if (data.message !== 'ok') {
                    this.errorHint?.show(data.message || 'Ошибка загрузки данных');
                    return;
                }
                this.nRoot.closest('.modal')?.classList.remove('_open');
                this.reset();
                emit('cat:update', data);
            }
        } else {
            this.errorHint?.show(message || 'Ошибка загрузки данных');
        }
    }

    destroy = () => {
        super.destroy();
        this.form?.removeEventListener('submit', this.onSubmit);
    }
}
