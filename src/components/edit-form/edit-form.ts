import { ComponentProps } from '../../app/ts/base/base';
import { UserCatData } from '../../app/types/common';
import { emit } from '../../app/ts/helpers/helpers';
import API from '../../app/ts/api';
import BaseForm from '../../app/ts/base/form';

export default class EditForm extends BaseForm {
    catId: string;

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.form?.addEventListener('submit', this.onSubmit);
    }

    onSubmit = async(e: Event) => {
        e.preventDefault();
        try {
            const data = this.collectFormData();
            const { valid, message } = this.validateData(data);
            if (valid) {
                const result = await API.updCat(+this.catId, data);
                if (!result.ok) {
                    this.errorHint?.show('Ошибка загрузки данных');
                } else {
                    const data = await result.json();
                    if (data.message !== 'ok') {
                        this.errorHint?.show(data.message || 'Ошибка загрузки данных');
                        return;
                    }
                    // this.nRoot.closest('.modal')?.classList.remove('_open');
                    emit('cat:update', data);
                }
            } else {
                this.errorHint?.show(message || 'Ошибка загрузки данных');
            }
        } catch (error) {
            this.errorHint?.show(error.message);
        }
    }

    restoreData = (data: UserCatData) => {
        this.catId = data.id;
        this.inputs.forEach(input => {
            if(data[input.inputName]) {
                input.setValue(data[input.inputName])
            }
        })
        if(this.preview) {
            this.preview.style.backgroundImage = `url('${data.img_link}')`;
        }
    }

    destroy = () => {
        super.destroy();
        this.form?.removeEventListener('submit', this.onSubmit);
    }
}
