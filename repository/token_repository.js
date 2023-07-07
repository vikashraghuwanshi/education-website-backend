const Token = require('../models/token')



async function findTokenById(userId) {
  return await Token.findOne({ userId: userId })
}


async function createToken(token) {
  return await token.save()
}


async function deleteToken(token) {
  return await token.remove()
}


module.exports = { findTokenById, createToken, deleteToken }