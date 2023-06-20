const otpToPhoneClient = require('../clients/send_otp_phone')



async function sendOtpPhoneService(phone) {
  try {

    const result = await otpToPhoneClient.sendOtpToPhone(phone)
    console.log('Result: ' + result)
    if (result.success) {

      // store verificationSid on the database
      console.log('Result: ' + result.verificationSid)

      return { success: true, message: 'OTP sent successfully' }
    } else {
      return { success: false, error: 'Failed to send OTP' }
    }
  } catch (error) {
    console.log('Error in sendOTPPhoneService: ' + error.message)
    return { success: false, error: 'Failed to send OTP' }
  }
}


async function verifyPhoneOTPService(phone, code) {
  try {

    // get verificationSid from database by using findOne({ phone })
    // const verificationSid = 'VE0bb7c0c5594c3483788b919467ce60bd'

    await otpToPhoneClient.verifyPhoneOTP(phone, code)
    return { success: true, message: 'OTP verified successfully' }
  } catch (error) {
    console.log('Error in verifyPhoneOTPService: ' + error.message)
    return { success: false, error: error.message }
  }
}


module.exports = { sendOtpPhoneService, verifyPhoneOTPService }