const router = require('express').Router()
const articleController = require('../controller/articleController')
const imageMiddleware = require('../middleware/image')
const authorization = require('../middleware/authorization')
const {
    upload, sendUploadToGCS
} = imageMiddleware

'localhost:3000/articles'

router.get('/', articleController.find)
router.get('/myArticles', articleController.findAll)
router.get('/:id', articleController.findOne)
router.post('/', upload.single('image'), sendUploadToGCS, articleController.create)
router.patch('/:id', authorization, upload.single('image'), sendUploadToGCS, articleController.update)
router.delete('/:id', authorization, articleController.delete)

module.exports = router