const express = require('express');
const UserController = require('../controller/userController');
const authController = require('../controller/authController');

const Router = express();

Router.route('/login').post(authController.login);
Router.route('/signup').post(authController.signup);
Router.route('/checkauth').get(authController.checkAuth);

Router.route('/').get(authController.protect, UserController.search);

Router.route('/:id')
  .get(authController.protect, UserController.getUserById)
  .delete(authController.protect, UserController.deleteUser);

Router.route('/checkauth').get(authController.checkAuth);

module.exports = Router;
