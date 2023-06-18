const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const frontendRoutesRouter = require('./controllers/frontend_routes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const verifyRouter = require('./controllers/verify')
const changePasswordRouter = require('./controllers/change_password')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const resetLinkVerifyRouter = require('./controllers/reset_link_verify')



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

app.use('/api/users', verifyRouter)
app.use('/api/login-user', loginRouter)
app.use('/api/add-user', usersRouter)
app.use('/api/update-password', changePasswordRouter)
app.use('/api/reset-link-verify', resetLinkVerifyRouter)


// Handle all other routes and return the main React application
app.use('*', frontendRoutesRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app