const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

// router for user controller: create, update, delete
router.get('/', userController.view);
router.post('/', userController.find);


router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/viewuser/:id', userController.viewall);
router.get('/:id', userController.delete);


// export this module so that other files can use it
module.exports = router;