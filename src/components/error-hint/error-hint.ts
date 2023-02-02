import Component, { ComponentProps } from '../../app/ts/base/base';

export default class ErrorHint extends Component {
    text: HTMLElement;

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.text = this.getElement('text')!;
    }

    show = (message: string) => {
        this.text.innerText = message;
        this.nRoot.style.height = this.nRoot.scrollHeight + 'px';
    }

    hide = () => {
        this.nRoot.style.height = '0px';
    }
}