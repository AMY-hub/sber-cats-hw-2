import { CatResponse, UserCatData } from '../types/common';

class Api {
    author: string;
    _baseURL = "https://sb-cats.herokuapp.com/api/2/";

    constructor(author: string) {
        this.author = author;
    }

    getCats() {
        return fetch(`${this._baseURL}${this.author}/show`);
    }

    getCat(id: number) {
        return fetch(`${this._baseURL}${this.author}/show/${id}`);
    }

    getIds() {
        return fetch(`${this._baseURL}${this.author}/ids`);
    }

    addCat(data: UserCatData) {
        return fetch(`${this._baseURL}${this.author}/add`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    updCat(id: number, body: UserCatData) {
        return fetch(`${this._baseURL}${this.author}/update/${id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    delCat(id: number) {
        return fetch(`${this._baseURL}${this.author}/delete/${id}`, {
            method: "DELETE"
        });
    }
}

export default new Api('amy');