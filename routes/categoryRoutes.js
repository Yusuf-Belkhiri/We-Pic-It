const express = require('express')
const router = express.Router()

const { 
    createCategory,
    deleteNode

} = require('../controllers/categoryController')

router.post('/categories', createCategory)
router.delete('/categories', deleteNode)

module.exports = router