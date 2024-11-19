import bcrypt from "bcryptjs";
import userModel from "../models/user.model";
import BadRequestError from "../utils/errors/BadRequestError";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import delay from "../utils/delayFunction";

class PasswordService {
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

  async recoverPassword(email: string) {
    try {
      const user = await userModel.findOne({ email }).select("+password");
      if (user) {
        const secretKey = `${process.env.RESET_PASSWORD_KEY}${user.password}`;
        const token = jwt.sign({ userId: user._id }, secretKey, {
          expiresIn: "30m",
        });

        const resetLink = `${process.env.WEBSITE_URL}/password/reset/${user._id}/${token}`;
        const mailOptions = {
          from: process.env.MAIL_LOGIN,
          to: email,
          subject: "Сброс пароля на сайте moonclown",
          text: `Мы получили запрос на сброс пароля для вашей учётной записи.\n\n Если вы делали такой запрос, нажмите на ссылку ниже. Если нет, просто проигнорируйте это письмо.\n\n ${resetLink}`,
        };
        await this.transporter.sendMail(mailOptions);
      } else await delay(620, 800);
    } catch (error) {
      throw error;
    }
  }

  async checkToken(id: string, token: string) {
    const user = await userModel.findById(id).select("+password");
    if (!user) {
      throw new BadRequestError("Пользователя с указанным id не существует");
    }
    const secretKey = `${process.env.RESET_PASSWORD_KEY}${user.password}`;
    try {
      jwt.verify(token, secretKey);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError("Недействительный токен.");
      }
      throw error;
    }
  }

  async resetPassword(id: string, token: string, newPassword: string) {
    const user = await userModel.findById(id).select("+password");
    if (!user) {
      throw new BadRequestError("Пользователя с указанным id не существует");
    }
    const secretKey = `${process.env.RESET_PASSWORD_KEY}${user.password}`;
    try {
      const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;
      if (await bcrypt.compare(newPassword, user.password)) {
        throw new BadRequestError(
          "Введённый вами пароль совпадает с вашим текущим паролем, поэтому обновление пароля не требуется."
        );
      }
      const { userId } = decodedToken;

      const hashedPassword = await bcrypt.hash(
        newPassword,
        Number(process.env.SALT_ROUNDS)
      );

      await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError("Недействительный токен.");
      }
      throw error;
    }
  }
}
export default new PasswordService();
