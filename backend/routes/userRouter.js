const express = require('express');
const UserController = require('../controller/userController');
const authController = require('../controller/authController');

const Router = express();

Router.route('/login').post(authController.login);
Router.route('/signup').post(authController.signup);
Router.route('/checkauth').get(authController.checkAuth);

Router.route('/')
  .get(authController.protect, UserController.getAllUsers)
  .post(authController.protect, UserController.getUserByUserName);

Router.route('/:id')
  .get(authController.protect, UserController.getUserById)
  .delete(authController.protect, UserController.deleteUser);

module.exports = Router;
