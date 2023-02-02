import Component, { ComponentProps } from '../../app/ts/base/base';

export default class ButtonIcon extends Component {
    isDisabled: boolean;

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.isDisabled = this.nRoot.hasAttribute('disabled');
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