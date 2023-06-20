/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const BACKEND_HOST = process.env.BACKEND_HOST
const FRONTEND_HOST = process.env.FRONTEND_HOST
const HOST = process.env.HOST
const SERVICE = process.env.SERVICE
const EMAIL_PORT=process.env.EMAIL_PORT
const SECURE=process.env.SECURE
const EMAIL_USER=process.env.EMAIL_USER
const PASS=process.env.PASS
const TWILIO_ACCOUNT_SID=process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const TWILIO_SERVICE_SID=process.env.TWILIO_SERVICE_SID

module.exports = {
  MONGODB_URI,
  PORT,
  BACKEND_HOST,
  FRONTEND_HOST,
  HOST,
  SERVICE,
  EMAIL_PORT,
  SECURE,
  EMAIL_USER,
  PASS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID
}
