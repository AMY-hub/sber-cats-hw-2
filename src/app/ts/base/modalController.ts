import Modal from '../../../components/modal/modal';

class ModalController {
    public modals: Modal[];

    constructor() {
        this.modals = Array.from<HTMLElement>(document.querySelectorAll('.modal'))
            .map((modal) => new Modal({ name: 'modal', component: modal }));

        document.addEventListener('click', this.clickHandler);
    }

    private clickHandler = (e: Event) => {
        const targetButton = (<Element>e.target).closest<HTMLElement>('button[data-modal]');
        if (!targetButton) return;

        const targetModal = this.modals.find((modal) => modal.id === targetButton.dataset.modal);
        if (!targetModal) return;

        targetModal.open();
    }
}

export default ModalController;