import api from '../../app/ts/api';
import Component, { ComponentProps } from '../../app/ts/base/base';
import { checkUserCookies, emit, listen, unlisten } from '../../app/ts/helpers/helpers';
import Button from '../button/button';
import EditForm from '../edit-form/edit-form';
import ErrorHint from '../error-hint/error-hint';

type FieldValue = HTMLElement | undefined;
type FieldNames = 'name' | 'img_link' | 'rate' | 'age' | 'favourite' | 'description';
type Fields = Record<FieldNames, FieldValue>;

export default class Details extends Component {
    fields = {} as Fields;
    detailsContainer: HTMLElement;
    deleteBtn: Button;
    editBtn: Button;
    editForm: EditForm;
    errorHint: ErrorHint;
    isLoggedIn: boolean = true;

    readonly detailsLabels = {
        age: 'Возраст: ',
        rate: 'Рейтинг: ',
        favourite: 'Любимчик: ',
    }

    constructor(elProps: ComponentProps) {
        super(elProps);

        this.isLoggedIn = checkUserCookies();

        this.detailsContainer = this.getElement('info')!;
        this.fields.name = this.getElement('name');
        this.fields.img_link = this.getElement<HTMLImageElement>('img');
        this.fields.age = this.getElement('age');
        this.fields.rate = this.getElement('rate');
        this.fields.favourite = this.getElement('favourite');
        this.fields.description = this.getElement('description');

        if(this.nRoot.querySelector('.edit-form')) {
            this.editForm = new EditForm({
                name: 'edit-form',
                component: this.nRoot.querySelector<HTMLElement>('.edit-form')!
            })
        }

        const editBtnEl = this.nRoot.querySelector<HTMLElement>('#edit');
        const delBtnEl = this.nRoot.querySelector<HTMLElement>('#delete');
        const hintEl = this.nRoot.querySelector<HTMLElement>('.error-hint');

        if(editBtnEl) {
            this.editBtn = new Button({name: 'button', component: editBtnEl});
        }
        if (delBtnEl) {
            this.deleteBtn= new Button({ name: 'button', component: delBtnEl });
        }
        if (hintEl) {
            this.errorHint = new ErrorHint({ name: 'error-hint', component: hintEl })
        }
        this.init();    
    }

    init = () => {
        this.togglePermission();
        listen('details:show', this.fillData);
        listen('user:update', this.onUserUpdate);
    }

    togglePermission = () => {
        if (!this.isLoggedIn) {
            this.deleteBtn.nRoot.removeEventListener('click', this.onDelete);
            this.editBtn.nRoot.removeEventListener('click', this.onEdit);
            this.editBtn.setDisabled(true);
            this.deleteBtn.setDisabled(true);
        } else {
            this.deleteBtn.nRoot.addEventListener('click', this.onDelete);
            this.editBtn.nRoot.addEventListener('click', this.onEdit);
            this.editBtn.setDisabled(false);
            this.deleteBtn.setDisabled(false);
        }
    }

    onUserUpdate = ({detail}: CustomEvent) => {
        if (typeof detail === 'boolean') {
            this.isLoggedIn = detail;
            this.togglePermission();
        }
    }

    fillData = ({detail}) => {
        this.nRoot.dataset.id = detail.id;
        this.detailsContainer.classList.remove('hidden');
        this.editForm.nRoot.classList.add('hidden');
        for(let key in this.fields) {
            switch (key) {
                case 'favourite':
                    this.fields[key]!.innerText = this.detailsLabels[key];
                    const icon = detail[key] ?
                        `<i class="fa-solid fa-check"></i>`
                        : `<i class="fa-solid fa-xmark"></i>`
                    this.fields[key]!.insertAdjacentHTML('beforeend', icon);
                    break;
                case 'img_link':
                    (this.fields.img_link as HTMLImageElement).src = detail[key];
                    break;
            
                default:
                    this.fields[key].innerText = this.detailsLabels[key] ?
                        this.detailsLabels[key] + detail[key] : detail[key];  
            }
        }
        this.editForm?.restoreData(detail);
    }

    onDelete = async (e: Event) => {
        if(e.target instanceof HTMLElement) {
            try {
                const catId = e.target.closest<HTMLElement>('[data-id]')?.dataset.id;
                if(!catId) return; 

                const res = await api.delCat(+catId);
                if(!res.ok) {
                    this.errorHint?.show('Oшибка загрузки данных');
                    return;
                }
                const result = await res.json();
                if (result.message !== 'ok') {
                    this.errorHint?.show(result.message);
                    return;
                }   
                this.nRoot.closest('.modal')?.classList.remove('_open');
                emit('cat:update');             
            } catch (error) {
                this.errorHint?.show(error.message);
            }
        }
    }

    onEdit = (e: Event) => {
        if (e.target instanceof HTMLElement) {
            try {
                const catId = e.target.closest<HTMLElement>('[data-id]')?.dataset.id;
                if (!catId) return;
                this.switchBlocks('form');
                const onUpdate = async () => {
                    const currentId = this.nRoot.dataset.id;
                    if(currentId) {
                        const res = await api.getCat(+currentId);
                        const newCatData = await res.json();
                        this.fillData({ detail: newCatData.data });
                        this.switchBlocks('info');
                    }
                    unlisten('cat:update', onUpdate);
                } 
                listen('cat:update', onUpdate);
            } catch (error) {
                this.errorHint?.show(error.message);
            }
        }
    }

    switchBlocks = (to: 'form' | 'info') => {
        if(to === 'form') {
            this.detailsContainer.classList.add('hidden');
            this.editForm.errorHint.hide();
            this.editForm.nRoot.classList.remove('hidden');
        }
        if(to === 'info') {
            this.detailsContainer.classList.remove('hidden');
            this.editForm.nRoot.classList.add('hidden');
        }
    }

    destroy = () => {
        this.nRoot.removeAttribute('data-id');
        for (let key in this.fields) {
            this.fields[key].innerHTML = '';
        }
        this.deleteBtn.nRoot.removeEventListener('click', this.onDelete);
        this.editBtn.nRoot.removeEventListener('click', this.onEdit);
        unlisten('details:show', this.fillData);
        unlisten('user:update', this.onUserUpdate);
    };
}