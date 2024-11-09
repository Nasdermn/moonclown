import nodemailer from "nodemailer";
import codeModel from "../models/code.model";
import userModel from "../models/user.model";
import BadRequestError from "../utils/errors/BadRequestError";
import GoneError from "../utils/errors/GoneError";
import ConflictError from "../utils/errors/ConflictError";
import { config } from "dotenv";
config();

class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  generateRandomCode(length: number) {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
    const paddedCode = randomNumber.toString().padStart(length, "0");
    return paddedCode;
  }

  async sendCode(email: string) {
    const isUserExists = await userModel.findOne({ email });

    if (!isUserExists) {
      try {
        const lastCode = await codeModel
          .findOne({ email })
          .sort({ createdAt: -1 });
        if (lastCode) {
          const currentTime = new Date();
          const nextSendAllowedAt = new Date(lastCode.nextSendAllowedAt);
          if (currentTime < nextSendAllowedAt) {
            const remainingSeconds = Math.floor(
              (nextSendAllowedAt.getTime() - currentTime.getTime()) / 1000
            );
            throw new BadRequestError(
              `Подождите еще ${remainingSeconds} секунд(у/ы), чтобы отправить код на эту почту.`
            );
          }
        }

        await codeModel.deleteMany({ email });
        const generatedCode = this.generateRandomCode(6);
        await codeModel.create({ email, code: generatedCode });
        await this.transporter.sendMail({
          from: process.env.MAIL_LOGIN,
          to: email,
          subject: "Подтвердите регистрацию в веб-приложении moonclown",
          html: `
            <p>Введите данный код регистрации: <strong>${generatedCode}</strong></p>
            <p>Если вы не регистрировались на сайте, проигнорируйте или удалите данное сообщение.</p>
          `,
        });
      } catch (error) {
        throw error;
      }
    } else {
      throw new ConflictError(
        "Указанный email уже используется другим пользователем. Пожалуйста, введите другую почту."
      );
    }
  }

  async checkCode(email: string, userCode: string) {
    try {
      const results = await codeModel
        .find({ email })
        .sort({ createdAt: -1 })
        .select("+code");

      if (results.length === 0) {
        throw new GoneError(
          "Код подтверждения уже истек. Вернитесь назад и получите новый код."
        );
      }

      if (results[0].code === userCode)
        return {
          status: 200,
          message: "Коды совпали. Верификация успешно выполнена.",
        };

      throw new BadRequestError("Код подтверждения введен неправильно.");
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(email: string, name: string, message: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_LOGIN,
        to: process.env.MOONCLOWN_EMAIL,
        subject: `MOONCLOWN - Сообщение от ${name}`,
        html: `
          <p><strong>Имя пользователя:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Сообщение:</strong> ${message}</p>
        `,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new MailService();
