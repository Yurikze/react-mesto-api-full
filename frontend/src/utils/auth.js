class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  _parseResponse(res) {
    // console.log(res)
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
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    }).then(this._parseResponse);
  }

  signout() {
    return fetch(`${this.baseUrl}/signout`, {
      method: 'POST',
      headers: this.headers,
      credentials: 'include',
    }).then(this._parseResponse)
  }

  getContent() {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: this.headers,
    }).then(this._parseResponse);
  }
}

const auth = new Auth({
  // baseUrl: 'http://localhost:4000',
  baseUrl: 'https://api.freeplace.nomoredomains.work',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default auth;
