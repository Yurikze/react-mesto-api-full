class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  _parseResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers,
      credentials: 'include',

    }).then((res) => this._parseResponse(res));
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this.headers,
      credentials: 'include',
    }).then((res) => this._parseResponse(res));
  }

  updateUserInfo({ name, about }) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => this._parseResponse(res));
  }

  addCard({name, link}) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._parseResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
      credentials: 'include',
    }).then(this._parseResponse);
  }

  likeCard(cardId, liked) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      headers: this.headers,
      credentials: 'include',
      method: liked ? 'DELETE' : 'PUT',
    }).then(this._parseResponse);
  }

  updateAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      headers: this.headers,
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._parseResponse);
  }
}

const api = new Api({
  // baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-31',
  // baseUrl: 'http://localhost:4000',
  baseUrl: 'https://api.freeplace.nomoredomains.work',
  headers: {
    // authorization: '3af5a01e-7b93-4927-85da-faee16dd46e6',
    'Content-Type': 'application/json',
  },
});

export default api;
