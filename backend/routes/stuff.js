const express = require('express')
const {
  createThing,
  getThing,
  getThings,
  deleteThing,
  updateThing
} = require('../controllers/stuff')

const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, createThing)
router.get('/:id', auth, multer, getThing)
router.put('/:id', auth, updateThing)
router.delete('/:id', auth, deleteThing)
router.get('/', auth, getThings)

module.exports = router
