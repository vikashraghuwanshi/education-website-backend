/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { email, firstname, lastname, password, login_by } = request.body

  if (login_by === 'database' && !(email && password)) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }

  var user = await User.findOne({ email })

  if(!user && login_by === 'google') {
    // create user if user not present
    const passwordHash = ''
    const newUser = new User({
      firstname, lastname, email, passwordHash, login_by
    })

    user = await newUser.save()

  }

  if(login_by === 'database') {
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid email or password'
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