const phoneOtpClient = require('../clients/phone_otp_client')



async function sendOtpToPhoneService(phone) {

  try {
    const result = await phoneOtpClient.sendOtpToPhone(phone)

    if (result.success) {
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

    await phoneOtpClient.verifyPhoneOTP(phone, code)
    return { success: true, message: 'OTP verified successfully' }
  } catch (error) {
    console.log('Error in verifyPhoneOTPService: ' + error.message)
    return { success: false, error: error.message }
  }
}


module.exports = { sendOtpToPhoneService, verifyPhoneOTPService }