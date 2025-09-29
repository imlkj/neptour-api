import nodemailer from "nodemailer";
import pug from "pug";
import { htmlToText } from "html-to-text";
import { resolvePath } from "./pathHelper.js";

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Lalit Jaiswal <${process.env.EMAIL_FROM}>`;
  }

  createTransporter() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //1. REnder HTML on pug template
    const html = pug.renderFile(
      resolvePath("views", "emails", `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    //2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
      //html
    };

    //3. Create a transport and send email
    await this.createTransporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("elcome", "Welcome to the Natours family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your passrd token (vaild for only 10 minutes) ",
    );
  }
}
