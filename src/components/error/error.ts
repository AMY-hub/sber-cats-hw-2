import Component, { ComponentProps } from '../../app/ts/base/base';
import { listen } from '../../app/ts/helpers/helpers';

export default class ErrorMessage extends Component {
    textContainer: HTMLElement | undefined;

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.textContainer = this.getElement('text');
        this.init();
    }

    init = () => {
        listen('app:error', this.onError);
    }

    onError = (e: CustomEvent) => {
        this.setMessage(e.detail);
        this.show();
    }

    setMessage = (message: string) => {
        if(this.textContainer) {
            this.textContainer.innerText = message;
        }
    }

    show = () => {
        this.nRoot.classList.add('error-show');
    }

    hide = () => {
        this.nRoot.classList.remove('error-show');
    }
}