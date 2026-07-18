const appError = require('../utils/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new appError(message, 400);
};
const handleDuplicateFields = (err) => {
  // const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field}: ${value} already exits.try different name `;
  return new appError(message, 400);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data type: ${errors.join('. ')}`;
  return new appError(message, 400);
};
const handleJWTError = () =>
  new appError('Invalid Jsonwbetoke,Please log in again!', 401);
const handleTokenExpireError = () =>
  new appError('token has been expired,Please Login again', 401);
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
    status: err.status,
    message: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('error', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = err;
  if (error.name === 'CastError') error = handleCastError(err);
  if (error.code === 11000) error = handleDuplicateFields(err);
  if (error.name === 'ValidationError') error = handleValidationError(err);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleTokenExpireError();
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, req, res);
  }
};
