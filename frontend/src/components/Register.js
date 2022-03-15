import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister, registerSuccess }) => {
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setRegisterData({ email: '', password: '' });
  }, [registerSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(registerData);
  };

  return (
    <div className="auth">
      <h2 className="auth__headline">Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth__form">
        <div className="auth__input-container">
          <input
            name="email"
            value={registerData.email}
            className="auth__input"
            type="text"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            name="password"
            value={registerData.password}
            className="auth__input"
            type="text"
            placeholder="Пароль"
            onChange={handleChange}
          />
        </div>

        <button className="auth__submit" type="submit">
          Зарегистрироваться
        </button>
        <Link className="auth__link" to="/sign-in">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
};

export default Register;
