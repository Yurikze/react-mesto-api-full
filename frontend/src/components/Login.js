import React, {useState} from 'react';

const Login = ({onLogin}) => {

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setLoginData({
      ...loginData,
      [name]: value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    onLogin(loginData)
  }

  return (
    <div className="auth">
      <h2 className="auth__headline">Вход</h2>
      <form onSubmit={handleSubmit} className="auth__form">
        <div className="auth__input-container">
          <input name="email" value={loginData.email} className="auth__input" type="text" placeholder="Email" onChange={handleChange} />
          <input name="password" value={loginData.password} className="auth__input" type="text" placeholder="Пароль" onChange={handleChange} />
        </div>
        <button className="auth__submit" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
