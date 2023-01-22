import api from './api'

class AppModel {

    constructor() {
        this.state = {
            catsData: []
        }
    }

    async getCatsData() {
        const oldData = this.getDataFromLS('cats');
        if (oldData) {
            this.state.catsData = oldData;
        } else {
            await this.loadData();
        }
    }

    getCatById(id) {
        return this.state.catsData.find(el => el.id === id);
    }

    async loadData() {
        try {
            const res = await api.getCats();
            if (res.ok) {
                const data = await res.json();
                this.state.catsData = data.data;
                this.saveDataInLS('cats', data.data);
            } else {
                throw new Error('Ошибка загрузки данных');
            }
        } catch (error) {
            throw error;
        }
    }

    getDataFromLS(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            throw error;
        }
    }

    saveDataInLS(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    validateCatData(data) {
        const result = {
            valid: true,
            message: ''
        };
        for (const key in data) {
            if (typeof data[key] === 'string') {
                if (!data[key].length) {
                    result.valid = false;
                    result.message = 'Заполните все поля!'
                    break;
                }

                if (key === 'img_link' && !data[key].includes('http')) {
                    result.valid = false;
                    result.message = 'Введите корректную ссылку!'
                    break;
                }
            }
        }

        return result;
    }

    async postCat(data) {
        try {
            const res = await api.addCat(data);
            if (res.ok) {
                data = await res.json();
                return data.message;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    // async updateCat(id, data) {
    //     const res = await api.updCat(id, data);

    //     console.log(res);
    // }
}

export default new AppModel();