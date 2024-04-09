const error = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.error(err);

  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
  next();
};

module.exports = error;
