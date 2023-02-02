import Component, { ComponentProps } from '../../app/ts/base/base';
import { Cat } from '../../app/types/common';
import { emit, listen, unlisten } from '../../app/ts/helpers/helpers';
import API from '../../app/ts/api';
import Preloader from '../preloader/preloader';

export default class Cards extends Component {
    container: HTMLElement | null;
    preloader: Preloader;
    cats: Cat[] = [];

    constructor(elProps: ComponentProps) {
        super(elProps);
        this.container = document.querySelector('.cards');
        const appPreloader = document.querySelector<HTMLElement>('.preloader');
        if(appPreloader) {
            this.preloader = new Preloader({name: 'preloader', component: appPreloader})
        }
        this.init();
    }

    init = async () => {
        await this.getCatsData();
        this.showCards();
        this.fitCards();
        window.addEventListener('resize', this.fitCards);
        this.container?.addEventListener('click', this.onCardClick);
        listen('cat:update', this.onUpdate);
    }

    getCatsData = async () => {
        const oldData = this.getDataFromLS<Cat[]>('cats');
        if (oldData) {
            this.cats = oldData;
        } else {
            await this.loadData();
        }
    }

    getCatById = (id: number) => {
        return this.cats.find(el => el.id === id);
    }

    loadData = async () => {
        try {
            this.preloader.show();
            const res = await API.getCats();
            if (res.ok) {
                const data = await res.json();
                this.cats = data.data;
                this.saveDataInLS('cats', data.data);
            } else {
                throw new Error('Ошибка загрузки данных');
            }
        } catch (error) {
            emit('app:error', error.message);
        } finally {
            this.preloader.hide();
        }
    }

    getDataFromLS<T>(key: string): T {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    saveDataInLS(key: string, data: unknown) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    showCards = () => {
        if (this.container) {
            let cards = '';       
            this.cats.forEach((el) => {
                cards += `
                    <button data-modal="details" data-id="${el.id}" class="cards__card card" style="background-image: url(${el.img_link}">
                        ${el.favourite ? `<i class="like fa-solid fa-heart"></i>` : ''}
                        <span class="card__name">${el.name}<i class="fa-solid fa-magnifying-glass-plus"></i></span>
                    </button>
                `;
            });
            this.container.innerHTML = cards;
        }
    }

    fitCards = () => {
        const cards = this.getElements('card');
        cards.forEach(card => {
            card.style.height = card.offsetWidth * 0.6 + "px";
        })
    }

    onCardClick = (e: Event) => {
        if (e.target instanceof HTMLElement 
            && e.target?.closest('.card')) {
            const id = e.target.closest<HTMLElement>('.card')?.dataset.id;
            if(id) {
              const cat = this.cats.find(cat => cat.id === +id);
                if (cat) {
                    emit('details:show', cat);
                }  
            }
        }
    }

    onUpdate = async () => {
        await this.loadData();
        this.showCards();
        this.fitCards();
    }

    destroy = () => {
        window.removeEventListener('resize', this.fitCards);
        this.container?.removeEventListener('click', this.onCardClick);
        unlisten('cat:update', this.onUpdate);
    };
}