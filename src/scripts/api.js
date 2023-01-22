class Api {

    _baseURL = "https://sb-cats.herokuapp.com/api/2/";

    constructor(author) {
        this.author = author;
    }

    getCats() {
        return fetch(`${this._baseURL}${this.author}/show`);
    }

    getCat(id) {
        return fetch(`${this._baseURL}${this.author}/show/${id}`);
    }

    getIds() {
        return fetch(`${this._baseURL}${this.author}/ids`);
    }

    addCat(data) {
        return fetch(`${this._baseURL}${this.author}/add`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    updCat(id, body) {
        return fetch(`${this._baseURL}${this.author}/update/${id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    delCat(id) {
        return fetch(`${this._baseURL}${this.author}/delete/${id}`, {
            method: "DELETE"
        });
    }
}

export default new Api('amy');