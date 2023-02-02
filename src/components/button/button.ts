import Component, { ComponentProps } from '../../app/ts/base/base';

export default class Button extends Component {
    isDisabled: boolean;
    text: HTMLElement | undefined;
    buttonElement: HTMLButtonElement;

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.isDisabled = this.nRoot.hasAttribute('disabled');
        this.text = this.getElement('text');
        this.buttonElement = this.nRoot.nodeName === 'BUTTON' ?
            this.nRoot as HTMLButtonElement
            : this.nRoot.querySelector<HTMLButtonElement>('button')!; 
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


}