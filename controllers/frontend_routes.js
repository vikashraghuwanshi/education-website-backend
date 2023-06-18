const frontendRoutesRouter = require('express').Router()
const path = require('path')


frontendRoutesRouter.get('*', (req, res) => {
  // eslint-disable-next-line no-undef
  console.log('**********************************Routed from Backend**********************=')
  // eslint-disable-next-line no-undef
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})


module.exports = frontendRoutesRouter