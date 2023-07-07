const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Token = require('../models/token')
const config = require('../utils/config')




async function resetLinkVerify(id, request_token) {
  try {

    let user = await User.findOne({ _id: id })
    if(!user) return { success: false, error: 'Invalid Link' }

    const verify_token = await Token.findOne({
      userId: user._id,
      token: request_token
    })

    console.log('Verify Reset Link')

    if(!verify_token) return { success: false, error: 'Invalid Link' }

    user.verified = true
    await User.findByIdAndUpdate(user._id, user)

    await verify_token.remove()

    const userForToken = {
      email: user.email,
      id: user._id,
    }

    const token = jwt.sign(userForToken, config.SECRET)

    return { success: true, data: { token } }
  } catch(error) {
    return { success: false, error: 'Internal Server Error' }
  }
}


module.exports = { resetLinkVerify }