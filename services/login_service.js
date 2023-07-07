const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Token = require('../models/token')
const config = require('../utils/config')
const sendEmailClient = require('../clients/send_email_client')
const userRepository = require('../repository/user_repository')
const tokenRepository = require('../repository/token_repository')



async function loginUser(email, firstname, lastname, password, login_by) {

  try {
    var user = await userRepository.findUserByEmail(email)

    if(login_by === 'google') {
      // create user if user not present
      if(!user) {
        const passwordHash = ''
        const verified = true
        const newUser = new User({
          email, firstname, lastname, passwordHash, login_by, verified
        })

        user = await userRepository.createUser(newUser)
      } else {
        user.verified = true
        await userRepository.updateUserById(user)
      }
    } else if(!user) {
      return { status: 401, error: 'Invalid Email or Password!!!' }
    }

    if(login_by === 'database') {

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        return { status: 404, error: 'Invalid Email or Password!!!' }
      }

      if(!user.verified) {

        let token = await tokenRepository.findTokenById(user._id)

        if(token) tokenRepository.deleteToken(token)

        token = new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex')
        })

        tokenRepository.createToken(token)

        console.log('Frontend Host:- ' + config.FRONTEND_HOST)
        const verification_link = `${config.FRONTEND_HOST}/users/${user._id}/verify/${token.token}`
        console.log(verification_link)

        const html =   `Hi ${user.firstname},<br><br><p>Please click 
            <a href='${ verification_link }'>here</a> to verify your email</p><br>Best Regards,
            <br>Team XYZ`

        await sendEmailClient(user.email, 'Email Verification Link', html)

        return { status: 401, error: 'Verification link sent to your email. Please verify!!!' }
      }
    }

    const userForToken = {
      email: user.email,
      id: user._id,
    }

    const token = jwt.sign(userForToken, config.SECRET)

    return { status: 200, data: { token, email: user.email, firstname: user.firstname,
      lastname: user.lastname } }
  } catch(error) {
    return { status: 401, error: 'Some Error Occured. Try Again!!!' }
  }
}



module.exports = { loginUser }