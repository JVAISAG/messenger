const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};
const createSendToken = (statusCode, user, res) => {
  const id = user._id.toString();
  const token = signToken(id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'none',
  };

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = CatchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  createSendToken(201, user, res);
});

exports.login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)Get user and match for email and pass
  const user = await User.findOne({ email }).select('+passwordHash');
  console.log('user: ', user);
  const passwordMatched = await user.correctPassword(
    password,
    user.passwordHash
  );
  console.log(passwordMatched);

  if (!user || !passwordMatched) {
    return next(new AppError('Invalid email or password', 401));
  }
  console.log('this is here');

  createSendToken(200, user, res);
});

exports.protect = CatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  //check if user still exists after token generation
  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  //check if user has changed password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password changed please login again'));
  }

  req.user = currentUser;
  next();
});

exports.checkAuth = CatchAsync(async (req, res, next) => {
  const token = req.cookie.jwt;

  if (!token) {
    return next(new AppError('invalid token please login again!', 401));
  }

  res.status(200).json({
    status: 'success',
    message: 'user is logged in',
  });
});

exports.logout = CatchAsync(async (req, res, next) => {
  res.clearCookie('jwt');
});
