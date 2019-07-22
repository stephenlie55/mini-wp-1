const router = require('express').Router()
const articleRouter = require('./articleRouter')
const userController = require('../controller/userController')
const authentication = require('../middleware/authentication')

router.post('/login', userController.login)
router.post('/register', userController.register)

router.use(authentication)
router.use('/articles',articleRouter)


module.exports = router