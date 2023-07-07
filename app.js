const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login_controller')
const phoneOtpRouter = require('./controllers/phone_otp_controller')
const usersSignupRouter = require('./controllers/users_signup_controller')
const emailVerifyRouter = require('./controllers/email_verify_controller')
const changePasswordRouter = require('./controllers/change_password_controller')
const frontendRoutesRouter = require('./controllers/frontend_routes_controller')
const resetLinkVerifyRouter = require('./controllers/reset_link_verify_controller')



mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)


app.use('/api/login-user', loginRouter)
app.use('/api/users', emailVerifyRouter)
app.use('/api/phone-otp', phoneOtpRouter)
app.use('/api/add-user', usersSignupRouter)
app.use('/api/update-password', changePasswordRouter)
app.use('/api/reset-link-verify', resetLinkVerifyRouter)


// Handle all other routes and return the main React application
app.use('*', frontendRoutesRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app