const express = require('express');
const router = express.Router();
const {index, create, update, destroy, changeFlag} = require('../controllers/messages');

router.get('/', index);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', destroy);
router.post('/:id', changeFlag);

module.exports = router;
