import {
    AddForm
} from './AddForm';
import {
    emit,
    listen,
    unlisten
} from './helpers';

class AppView {

    constructor() {
        this.showFormError = this.showFormError.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.hideModalByOverlay = this.hideModalByOverlay.bind(this);
        this.showForm = this.showForm.bind(this);
        this.emitFormData = this.emitFormData.bind(this);

        this.cardsContainer = document.querySelector('.cards');
        this.modal = document.querySelector('#popup');
        this.modalContent = this.modal.querySelector('.popup__content');
        this.addBtn = document.getElementById("add");
        this.modalCloseBtn = this.modal.querySelector("#popup-close");
        this.addForm = new AddForm();
    }

    showCards(cardsData) {
        let cards = '';
        cardsData.forEach((el) => {
            cards += `
                <div data-id="${el.id}" class="card" style="background-image: url(${el.img_link}">
                    ${el.favourite ? `<i class="like fa-solid fa-heart"></i>` : ''}
                    <span class="card__name">${el.name}<i class="fa-solid fa-magnifying-glass-plus"></i></span>
                </div>
            `;
        });
        this.cardsContainer.innerHTML = cards;
        this.fitCards();
    }

    fitCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.height = card.offsetWidth * 0.6 + "px";
        })
    }

    showPreloader() {
        this.cardsContainer.innerHTML = `<div class="preloader"><i class="fa-solid fa-paw"></div>`
    }

    showErrorMessage(message) {
        this.cardsContainer.innerHTML = `
        <div class="error">
            <div class="error__icon"></div>
            <div class="error__content">
                    <h1 class="error__title">Упс!<br/>Что-то пошло не так...</h1> 
                    <p class="error__text">${message}</p> 
            </div>
        </div>   
        `
    }

    showDetails(data) {
        this.modalContent.innerHTML = `
        <div class="details">
            <h2 class="details__name">${data.name}</h2>
            <div class="details__img">
                <img src="${data.img_link}" alt="cat photo"/>
            </div>
            <div class="details__age">Возраст: ${data.age}</div>
            <div class="details__rate">Рейтинг: ${data.rate}</div>
            <div class="details__fav">
                Любимчик: ${data.favourite ? 
                    `<i class="fa-solid fa-check"></i>` 
                    : `<i class="fa-solid fa-xmark"></i>`}
            </div>
            <p class="details__about">${data.description}</p>
        </div>
    `;
        this._showModal();
    }

    emitFormData(e) {
        e.preventDefault();
        const data = this.addForm.collectFormData();
        emit('cat:post', data);
    }

    showForm() {
        this.addForm.render(this.modalContent);
        listen('submit', this.emitFormData, this.addForm.form);
        this._showModal();
    }

    showFormError(message) {
        this.addForm.showError(message);
    }

    hideFormError() {
        this.addForm.hideError();
    }

    _showModal() {
        if (!this.modal.classList.contains('active')) {
            this.modal.parentElement.classList.add('active');
            this.modal.classList.add('active');
        };
    }

    hideModal() {
        if (this.modal.classList.contains('active')) {
            this.modal.parentElement.classList.remove('active');
            this.modal.classList.remove('active');

            if (this.modal.querySelector('.add-form')) {
                this.addForm.reset();
                unlisten('submit', this.emitFormData, this.addForm.form);
            }
            this.modalContent.innerHTML = ``;
        };
    }

    hideModalByOverlay(e) {
        if (e.target === this.modal.parentElement) {
            this.hideModal();
        }
    }
}

export default new AppView();