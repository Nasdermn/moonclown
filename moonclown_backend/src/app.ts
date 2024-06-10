import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.middleware';
import router from './routes/index';
import { config } from 'dotenv';
config();
const { PORT, MONGODBADDRESS } = process.env;

mongoose.connect(MONGODBADDRESS as string);
const dataBase = mongoose.connection;
dataBase.on('error', (error) => console.log(error));
dataBase.once('open', () => console.log('Соединение с БД установлено'));

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
