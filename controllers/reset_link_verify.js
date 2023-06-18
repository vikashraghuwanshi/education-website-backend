/* eslint-disable no-undef */
const resetLinkVerifyRouter = require('express').Router()
const User = require('../models/user')
const Token = require('../models/token')


resetLinkVerifyRouter.get('/:id/forgot/:token', async(request, response) => {
  try {
    let user = await User.findOne({ _id: request.params.id })
    if(!user) return response.status(400).json('Invalid Link')

    const token = await Token.findOne({
      userId: user._id,
      token: request.params.token
    })

    if(!token) return response.status(400).json('Invalid Link')

    user.verified = true
    await User.findByIdAndUpdate(user._id, user)

    console.log(request.params.token)

    await token.remove()

    response.status(200).send({ id: user._id })
  } catch(error) {
    return response.status(400).json('Internal Server Error')
  }
})


module.exports = resetLinkVerifyRouter