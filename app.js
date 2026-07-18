const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend URL from env
  credentials: true
}));
app.use(cookieParser());

const globalErrorHandler = require('./controllers/errorControlle');
const commentRouter = require('./routes/commentsRouter');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const notificationRouter = require('./routes/notificationRouter');
const morgan = require('morgan');
app.use(express.json());
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/comments', commentRouter);
app.use(globalErrorHandler);

module.exports = app;
