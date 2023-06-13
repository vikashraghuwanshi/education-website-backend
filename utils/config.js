/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const BASE_URL = process.env.BASE_URL
const HOST = process.env.HOST
const SERVICE = process.env.SERVICE
const EMAIL_PORT=process.env.EMAIL_PORT
const SECURE=process.env.SECURE
const EMAIL_USER=process.env.EMAIL_USER
const PASS=process.env.PASS

module.exports = {
  MONGODB_URI,
  PORT,
  BASE_URL,
  HOST,
  SERVICE,
  EMAIL_PORT,
  SECURE,
  EMAIL_USER,
  PASS
}
