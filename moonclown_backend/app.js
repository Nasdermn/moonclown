require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');

const { PORT, MONGODBADDRESS } = process.env;
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect(MONGODBADDRESS);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
