/* eslint-disable no-undef */
const resetLinkVerifyRouter = require('express').Router()
const resetLinkVerifyService = require('../services/reset_link_verify_service')



resetLinkVerifyRouter.get('/:id/forgot/:token', async(request, response) => {
  const result = await resetLinkVerifyService
    .resetLinkVerify(request.params.id, request.params.token)

  if(result.success) {
    response
      .status(200)
      .send(result.data)
  } else {
    console.log(result.error)
    return response.status(400).json(result.error)
  }
})


module.exports = resetLinkVerifyRouter