const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Token = require('../models/token')
const sendEmail = require('./sendEmail')
const crypto = require('crypto')
const config = require('../utils/config')


usersRouter.post('/', async (request, response) => {
  const { email, firstname, lastname, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const foundUser = await User.findOne({ email })

  var user = new User({
    email,
    firstname,
    lastname,
    passwordHash,
    login_by: 'database'
  })

  if(foundUser) {
    if(foundUser.login_by === 'google') {
      user._id = foundUser._id
      User.findByIdAndUpdate(user._id, user)
        .then(updatedUser => {
          response.status(201).json(updatedUser)
        })
    } else {
      return response.status(400).json({ ok: false, msg: 'User Already Exists' })
    }

  } else {
    await user.save()
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex')
    }).save()

    const url = `${config.BASE_URL}users/${user._id}/verify/${token.token}`

    await sendEmail(user.email, 'Verify Email', url)

    return response.status(201).json('Email sent to your account. Please verify')
  }
})


module.exports = usersRouter