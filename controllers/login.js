/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const Token = require('../models/token')
const sendEmail = require('./sendEmail')
const crypto = require('crypto')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { email, firstname, lastname, password, login_by } = request.body


  var user = await User.findOne({ email })

  if(!user && login_by === 'google') {
    // create user if user not present
    const passwordHash = ''
    const newUser = new User({
      email, firstname, lastname, passwordHash, login_by
    })

    user = await newUser.save()

  }

  if(!user) {
    return response.status(401).json({
      error: 'Invalid Email or Password'
    })
  }

  if(login_by === 'database') {

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(404).json({
        error: 'Invalid Email or Password'
      })
    }

    if(!user.verified) {

      let token = await Token.findOne({ userId: user._id })

      if(token) token.remove()

      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex')
      }).save()

      const url = `${config.BASE_URL}users/${user._id}/verify/${token.token}`

      await sendEmail(user.email, 'Verify Email', url)


      return response.status(401).json({
        error: 'Please Verify Email'
      })
    }
  }

  const userForToken = {
    email: user.email,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, email: user.email, firstname: user.firstname,
      lastname: user.lastname })
})

module.exports = loginRouter