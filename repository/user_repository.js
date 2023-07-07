const User = require('../models/user')



async function findUserByEmail(email) {
  return User.findOne({ email })
}


async function createUser(user) {
  return await user.save()
}


async function updateUserById(user) {
  return await User.findByIdAndUpdate(user._id, user)
}


module.exports = { findUserByEmail, createUser, updateUserById }