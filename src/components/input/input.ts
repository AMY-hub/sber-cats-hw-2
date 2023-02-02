import Component, { ComponentProps } from '../../app/ts/base/base';

export default class Input extends Component {
    isDisabled: boolean;
    input: HTMLInputElement | undefined;
    inputName: string;

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.input = this.getElement('input');
        this.inputName = this.input?.name || '';
        this.isDisabled = this.input?.hasAttribute('disabled') ?? true;
    }

    setDisabled = (disabled: boolean) => {
        if (disabled) {
            this.nRoot.setAttribute('disabled', 'disabled');
            this.isDisabled = true;
        } else {
            this.nRoot.removeAttribute('disabled');
            this.isDisabled = false;
        }
    }

    getValue = () => {
        if(this.input?.type === 'checkbox') {
            return this.input.checked;
        }
        return this.input?.value.trim();
    }

    setValue = (value: string | boolean) => {
        if (this.input?.type === 'checkbox' && typeof value === 'boolean') {
            this.input.checked = value;
        }
        if (this.input?.type === 'number' && !isNaN(+value)) {
            //@ts-ignore
            this.input.value = +value;
        }
        if(this.input && typeof value === 'string') {
            this.input.value = value;
        }
    }

    clear = () => {
        if (this.input) {
            this.input.value = '';
        }
    }
}