const nodemailer = require('nodemailer');
const templates = require('./emailTemplates');
const { convert } = require('html-to-text');
// const sendEmail = async (option) => {
//   //1.Create Transport
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   const mailOptions = {
//     from: 'Aman yadav <amanyadavheisenberg.com>',
//     to: option.email,
//     subject: option.subject,
//     text: option.message,
//     html: option.html, // Added this line to support HTML!
//   };
//   //send email
//   await transporter.sendMail(mailOptions);
// };
// module.exports = sendEmail;
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(' ')[0] : 'User';
    this.url = url;
    this.from = `Pluse Team <${process.env.EMAIL_FROM || 'noreply@pluse.app'}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
      //sendGrid
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 2525,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
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
  async send(type, subject) {
    try {
      let info;
      if (type === 'welcome') {
        const html = templates.welcomeEmailTemplate(this.firstName);
        const mailOption = {
          from: this.from,
          to: this.to,
          subject,
          html,
          text: convert(html),
        };
        info = await this.newTransport().sendMail(mailOption);
      } else {
        const html = templates.resetPasswordTemplate(this.url);
        const mailOption = {
          from: this.from,
          to: this.to,
          subject,
          html,
          text: convert(html),
        };
        info = await this.newTransport().sendMail(mailOption);
      }

      // If using Ethereal, log the preview URL so the developer can see the email!
      if (info && info.messageId && nodemailer.getTestMessageUrl(info)) {
        console.log(
          '✉️ Email sent! Preview URL: %s',
          nodemailer.getTestMessageUrl(info)
        );
      } else {
        console.log('✉️ Email (Fallback): Reset URL is', this.url);
      }
    } catch (err) {
      console.error('Failed to send email:', err.message);
      // We don't throw here to avoid crashing the whole signup process!
    }
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to Pluse Family');
  }
  async sendResetPassword() {
    await this.send(
      'passwordReset',
      'Your password reset token is valid only for 10 min'
    );
  }
};
