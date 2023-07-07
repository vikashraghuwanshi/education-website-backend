const loginRouter = require('express').Router()
const loginService = require('../services/login_service')




loginRouter.post('/', async (request, response) => {
  const { email, firstname, lastname, password, login_by } = request.body

  const res = await loginService.loginUser(email, firstname, lastname, password, login_by)

  if(res.status === 200) {
    response
      .status(res.status)
      .send(res.data)
  } else {
    return response.status(res.status).json({
      error: res.error
    })
  }

})



module.exports = loginRouter