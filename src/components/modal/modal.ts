import Component, { ComponentProps } from '../../app/ts/base/base';
import CatForm from '../../components/cat-form/cat-form';
import LoginForm from '../../components/login-form/login-form';

export default class Modal extends Component {
    static readonly classNames = {
        open: "_open"
    }
    static readonly possibleForms = {
        'cat-form': CatForm,
        'login-form': LoginForm,
    }

    form: CatForm | LoginForm | undefined;

    readonly id: string;
    readonly closeButton?: HTMLButtonElement;

    constructor(elProps: ComponentProps) {
        super(elProps);

        this.id = this.nRoot.id ?? '';
        this.closeButton = this.getElement('close');
        if(this.nRoot.querySelector('.cat-form')) {
            this.form = new CatForm({ name: 'cat-form', component: this.nRoot.querySelector<HTMLElement>('.cat-form')! })
        }
        if (this.nRoot.querySelector('.login-form')) {
            this.form = new LoginForm({ name: 'login-form', component: this.nRoot.querySelector<HTMLElement>('.login-form')! })
        }
        this.createPortal();
    }

    createPortal = () => {
        document.body.appendChild(this.nRoot);
    }

    open = () => {
        this.nRoot.classList.add(Modal.classNames.open);
        this.closeButton?.addEventListener('click', this.close);
        document.addEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.close();
    }

    close = () => {
        this.nRoot.classList.remove(Modal.classNames.open);
        this.closeButton?.removeEventListener('click', this.close);
        document.removeEventListener('keydown', this.onKeyDown);
        if(this.form) {
            this.form.reset();
        }
    }
}