const jsonwebtoken = require('jsonwebtoken');
const { AuthorizationError } = require('../Error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError({ message: 'Необходима авторизация' }));
  }
  req.user = payload;
  next();
  return true;
};
