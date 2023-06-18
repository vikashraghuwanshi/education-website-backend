/* eslint-disable no-undef */
const resetLinkVerifyRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Token = require('../models/token')


resetLinkVerifyRouter.get('/:id/forgot/:token', async(request, response) => {
  try {
    let user = await User.findOne({ _id: request.params.id })
    if(!user) return response.status(400).json('Invalid Link')

    const verify_token = await Token.findOne({
      userId: user._id,
      token: request.params.token
    })

    if(!verify_token) return response.status(400).json('Invalid Link')

    user.verified = true
    await User.findByIdAndUpdate(user._id, user)

    console.log(request.params.token)

    await verify_token.remove()

    const userForToken = {
      email: user.email,
      id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
      .status(200)
      .send({ token })
  } catch(error) {
    return response.status(400).json('Internal Server Error')
  }
})


module.exports = resetLinkVerifyRouter