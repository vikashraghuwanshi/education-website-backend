const sendOtpPhoneRouter = require('express').Router()
const otpPhoneService = require('../services/send_otp_phone')



sendOtpPhoneRouter.post('/', async (request, response) => {
  try {
    const result = await otpPhoneService
      .sendOtpPhoneService(request.body.phone)

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


sendOtpPhoneRouter.post('/verify', async (request, response) => {
  try {
    const result = await otpPhoneService
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


module.exports = sendOtpPhoneRouter
