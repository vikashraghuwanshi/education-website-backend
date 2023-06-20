const nodemailer = require('nodemailer')
const config = require('../utils/config')

module.exports = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: config.HOST,
      service: config.SERVICE,
      // port: Number(config.EMAIL_PORT),
      // secure: Boolean(config.SECURE),
      auth: {
        user: config.EMAIL_USER,
        pass: config.PASS
      }
    })

    await transporter.sendMail({
      from: config.EMAIL_USER,
      to: email,
      subject: subject,
      html: html
    })

    console.log('Email sent successfully!!!')

  } catch(error) {
    console.log('Email not sent: ' + error)
  }
}