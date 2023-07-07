const phoneOtpRouter = require('express').Router()
const phoneOtpService = require('../services/phone_otp_service')



phoneOtpRouter.post('/send', async (request, response) => {
  try {
    const result = await phoneOtpService
      .sendOtpToPhoneService(request.body.phone)

    if (result.success) {
      response.status(200).json({ message: result.message })
    } else {
      response.status(400).json({ error: result.error })
    }
  } catch (error) {
    console.log('Error in sendOtpPhoneController: ' + error.message)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})



phoneOtpRouter.post('/verify', async (request, response) => {
  try {
    const result = await phoneOtpService
      .verifyPhoneOTPService(request.body.phone,
        request.body.code)

    if (result.success) {
      response.status(200).json({ message: result.message })
    } else {
      response.status(400).json({ error: result.error })
    }
  } catch (error) {
    console.log('Error in verifyOtpController: ' + error.message)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})


module.exports = phoneOtpRouter
