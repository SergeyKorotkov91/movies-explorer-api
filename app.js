require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const cors = require('cors');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const { port, mongodbURI } = require('./utils/config');


const app = express();
app.use(cors({
    origin: [
      'https://kanc1er.nomoreparties.co',
      'http://kanc1er.nomoreparties.co',
      'http://localhost:3000',
    ],
    credentials: true,
    maxAge: 30,
  }));
app.use(requestLogger);
app.use(helmet());
app.use(bodyParser.json());
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(error);

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
});

app.listen(port);