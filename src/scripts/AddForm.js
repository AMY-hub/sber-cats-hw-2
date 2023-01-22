export class AddForm {
    constructor() {
        this.collectFormData = this.collectFormData.bind(this);
        this.setPreview = this.setPreview.bind(this);

        this.form = document.createElement('form');
        this.form.className = 'add-form';
        this.container = document.createElement('div');
        this.formError = document.createElement('div');
        this.formError.className = 'form__error';
        this.form.innerHTML = `
                        <div div class = "add-form__img"
                        style="background-image:url('https://cdn-icons-png.flaticon.com/512/1089/1089421.png')"></div>
                        <input type="number" name="id" min="1" required placeholder="id">
                        <input type="number" name="age" placeholder="Возраст">
                        <input type="text" name="name" required placeholder="Имя">
                        <input type="number" name="rate" placeholder="Рейтинг (0-10)" min="0" max="10">
                        <textarea name="description" placeholder="Описание"></textarea>
                        <label>Любимчик <input type="checkbox" name="favourite" placeholder=""></label>
                        <input id="link" type="text" name="img_link" placeholder="Ссылка на фото">
                        <button type="submit">Добавить котика</button>
        `
        this.container.insertAdjacentHTML('afterbegin', `<h2 class="add-form__title">Добавить питомца</h2>`);
        this.container.append(this.form, this.formError);
        this.fields = Array.from([
            ...this.form.querySelectorAll('input'),
            ...this.form.querySelectorAll('textarea')
        ]);
        this.linkInput = this.form.querySelector('#link');
        this.preview = this.form.querySelector('.add-form__img');
    }

    render(container) {
        container.appendChild(this.container);
        this.linkInput.addEventListener('change', this.setPreview);
    }

    setPreview(e) {
        if (e.target.value && e.target.value.includes('http')) {
            this.preview.style.backgroundImage = `url(${e.target.value})`;
        } else {
            this.preview.style.backgroundImage = `url('https://cdn0.iconfinder.com/data/icons/file-and-document-41/100/file_document_doc-23-512.png')`;
        }
    }

    showError(message) {
        this.formError.innerHTML = `<div>${message}</div>`;
        this.formError.style.height = this.formError.scrollHeight + 'px';
    }

    hideError() {
        this.formError.style.height = '0px';
    }

    collectFormData() {
        this.hideError();
        const data = {};
        this.fields.forEach(field => {
            if (field.type === 'checkbox') {
                data[field.name] = field.checked ? true : false;
            } else {
                data[field.name] = field.value;
            }
        });
        return data;
    }

    reset() {
        this.linkInput.removeEventListener('change', this.setPreview);
        this.preview.style.backgroundImage = `url('https://cdn-icons-png.flaticon.com/512/1089/1089421.png')`;
        this.form.reset();
        this.hideError();
    }
}