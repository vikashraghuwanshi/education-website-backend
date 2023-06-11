const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

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
      response.status(400).json({ ok: false, msg: 'User Already Exists' })
    }

  } else {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
})

module.exports = usersRouter