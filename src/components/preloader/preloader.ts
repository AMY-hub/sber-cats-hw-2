import Component, { ComponentProps } from '../../app/ts/base/base';

export default class Preloader extends Component {
    constructor(elProps: ComponentProps) {
        super(elProps);
    }

    show = () => {
        this.nRoot.classList.add('show');
    }

    hide = () => {
        this.nRoot.classList.remove('show');
    }
}