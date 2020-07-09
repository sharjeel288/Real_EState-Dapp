const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user');

const router = express.Router();

//API::api/user

router.post(
  '/signup',
  [
    check('name', 'name is Required').not().isEmpty(),
    check('email', 'Please Enter Valid Email').isEmail(),
    check(
      'password',
      'please enter your password atleast 6 characters long'
    ).isLength({ min: 6 }),
  ],
  userController.postRegisterUser
);

router.post('/login', userController.postLoginUser);

module.exports = router;
