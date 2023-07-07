const bcrypt = require('bcrypt')
const usersSignupRouter = require('express').Router()
const User = require('../models/user')
const Token = require('../models/token')
const sendEmail = require('../clients/send_email_client')
const crypto = require('crypto')
const config = require('../utils/config')



usersSignupRouter.post('/', async (request, response) => {
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
      user.verified = true
      await User.findByIdAndUpdate(user._id, user)

      return response.status(401).json({
        error: 'Account Created!!!'
      })
    } else {
      return response.status(400).json({
        error : 'Email Already Exists!!!'
      })
    }

  } else {
    await user.save()
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex')
    }).save()


    console.log('Frontend Host:- ' + config.FRONTEND_HOST)
    const verification_link = `${config.FRONTEND_HOST}/users/${user._id}/verify/${token.token}`
    const html =   `Hi ${user.firstname} ${user.lastname},<br><br><p>Please click 
      <a href='${ verification_link }'>here</a> to verify your email</p><br>Best Regards,
      <br>Team XYZ`
    console.log(verification_link)

    await sendEmail(user.email, 'Email Verification Link', html)

    return response.status(401).json({
      error: 'Verification link sent to your email. Please verify!!!'
    })
  }
})


module.exports = usersSignupRouter