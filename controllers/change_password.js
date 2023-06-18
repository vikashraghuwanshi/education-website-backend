/* eslint-disable no-undef */
const changePasswordRouter = require('express').Router()
const User = require('../models/user')
const Token = require('../models/token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/send_email')
const crypto = require('crypto')
const config = require('../utils/config')




const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


// logged in user password change
changePasswordRouter.post('/', async(request, response) => {

  const { password } = request.body

  try {

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.email) {
      return response.status(401).json({ error: 'Invalid Token' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const email = decodedToken.email
    let user = await User.findOne({ email })
    user.passwordHash = passwordHash
    await User.findByIdAndUpdate(user._id, user)

    response.status(200).send('Password Changed Successfully!!!')
  } catch(error) {
    return response.status(400).json({
      error: 'Internal Server Error'
    })
  }
})



// users forgot password
changePasswordRouter.post('/forgot', async(request, response) => {

  const { email } = request.body

  try {
    const user = await User.findOne({ email })
    if(!user) return response.status(400).json('User not found!!!')

    let token = await Token.findOne({ userId: user._id })

    if(token) token.remove()

    token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex')
    }).save()


    console.log('Frontend Host:- ' + config.FRONTEND_HOST)
    const verification_link = `${config.FRONTEND_HOST}/users/${user._id}/forgot/${token.token}`
    const html =   `Hi ${user.firstname} ${user.lastname},<br><br><p>Please click 
        <a href='${ verification_link }'>here</a> to reset your password.</p><br>Best Regards,
        <br>Team XYZ`
    console.log(verification_link)

    await sendEmail(user.email, 'Reset Password', html)

    response.status(200).send('Reset link sent to your email successfully!!!')

  } catch(error) {
    return response.status(400).json({
      error: 'Internal Server Error'
    })
  }
})




changePasswordRouter.post('/reset', async(request, response) => {

  const { password, id } = request.body

  try {
    let user = await User.findOne({ _id: id })
    if(!user) {
      return response.status(400).json({
        error: 'Invalid Link'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    user.passwordHash = passwordHash
    await User.findByIdAndUpdate(user._id, user)

    response.status(200).send('Password Changed Successfully!!!')
  } catch(error) {
    return response.status(400).json({
      error: 'Internal Server Error'
    })
  }
})


module.exports = changePasswordRouter