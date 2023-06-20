// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const config = require('../utils/config')
const authToken = config.TWILIO_AUTH_TOKEN
const accountSid = config.TWILIO_ACCOUNT_SID
const serviceSid = config.TWILIO_SERVICE_SID
const client = require('twilio')(accountSid, authToken)



async function sendOtpToPhone(phone) {
  try {
    const accountSid = config.TWILIO_ACCOUNT_SID
    const authToken = config.TWILIO_AUTH_TOKEN
    const client = require('twilio')(accountSid, authToken)

    await client.verify
      .v2.services(serviceSid)
      .verifications
      .create({ to: phone, channel: 'sms' })

    console.log('OTP sent successfully')
    return { success: true, message: 'OTP sent successfully' }

  } catch(error) {
    console.log('Error in sendOtpPhone Client utils: ' + error.message)
    throw new Error('Failed to verify OTP')
  }
}




async function verifyPhoneOTP(phone, code) {

  try {
    const check = await client.verify
      .v2
      .services(serviceSid)
      .verificationChecks
      .create({ to: phone, code: code })


    if(check.status === 'approved') {
      console.log('OTP verified successfully')
    } else {
      console.log('Error. Not Verified')
      throw new Error('Failed to verify OTP')
    }
  } catch(error) {
    console.log('Error in verifyOtpPhone Client utils: ' + error.message)
    throw new Error('Some Error Occured. Try Again!!!')
  }
}


module.exports = { sendOtpToPhone, verifyPhoneOTP }