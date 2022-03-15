class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  _parseResponse(res) {
    return res.ok
      ? res.json()
      : Promise.reject(new Error(`Ошибка ${res.status}: ${res.statusText}`));
  }

  signup({ email, password }) {
    console.log(email, password);
    return fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email, password }),
    }).then(this._parseResponse);
  }

  signin({ email, password }) {
    return fetch(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email, password }),
    }).then(this._parseResponse);
  }

  getContent(token) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      headers: { ...this.headers, Authorization: `Bearer ${token}` },
    }).then(this._parseResponse);
  }
}

const auth = new Auth({
  baseUrl: 'https://auth.nomoreparties.co',
  headers: {
    // 'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default auth;
