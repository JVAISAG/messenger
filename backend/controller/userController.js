const User = require('../models/userModel');
const AppError = require('../utils/appError');
const CatchAsync = require('../utils/catchAsync');

exports.getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUserById = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(`User not found`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUserByUserName = CatchAsync(async (req, res, next) => {
  const user = await User.findOne({ userName: req.body.userName });

  if (!user) {
    return next(new AppError(`User not found`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
