import appModel from './AppModel';
import appView from './appView';
import {
    debounce,
    emit,
    listen
} from './helpers';

export default class App {

    constructor() {
        this.getDetails = this.getDetails.bind(this);

        this.mainContainer = document.getElementById('appMain');
        this.modal = document.getElementById("popup");
        this.addBtn = document.getElementById("add");
        this.modalCloseBtn = this.modal.querySelector("#popup-close");
    }

    setEventListeners() {
        listen('loading:error', (e) => appView.showErrorMessage(e.detail.message));
        listen('cat:post', (e) => this.addNewCat(e.detail));
        this.mainContainer.addEventListener('click', this.getDetails);
        this.addBtn.addEventListener('click', appView.showForm);
        this.modalCloseBtn.addEventListener('click', appView.hideModal);
        this.modal.parentElement.addEventListener('click', appView.hideModalByOverlay);
    }

    getDetails(e) {
        if (e.target.closest('.card') &&
            e.target.closest('.card').dataset.id) {
            const data = appModel.getCatById(+e.target.closest('.card').dataset.id);
            if (data) {
                appView.showDetails(data);
            }
        }
    }

    async addNewCat(data) {
        try {
            const {
                valid,
                message
            } = appModel.validateCatData(data);
            if (valid) {
                const result = await appModel.postCat(data);
                if (result !== 'ok') {
                    appView.showFormError(result || 'Ошибка загрузки данных');
                    return;
                }
                appView.hideModal();
                appView.showPreloader();

                await appModel.loadData();
                appView.showCards(appModel.state.catsData);
            } else {
                appView.showFormError(message);
            }

        } catch (error) {
            emit('loading:error', {
                message: error.message
            })
        }
    }

    async init() {
        this.setEventListeners();
        appView.showPreloader();
        try {
            await appModel.getCatsData();
            appView.showCards(appModel.state.catsData);
            listen('resize', debounce(appView.fitCards), window);
        } catch (error) {
            emit('loading:error', {
                message: error.message
            })
        }
    }
}