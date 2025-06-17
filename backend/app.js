const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const ConversationsRouter = require('./routes/conversationsRoute');
const UserRouter = require('./routes/userRouter');
const MessageRouter = require('./routes/messageRoute');
const gloabalErroController = require('./controller/errorController');
const AppError = require('./utils/appError');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/conversations', ConversationsRouter);
app.use('/user', UserRouter);
app.use('/message', MessageRouter);

app.all(/ */, (req, res, next) => {
  next(new AppError(`cant find any ${req.originalUrl} on this server`, 404));
});

app.use(gloabalErroController);
module.exports = app;
