import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\\1/)[0] : 'field';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  console.error(`[DEV ERROR TRACE]`, err.stack);
  logger.error(`[DEV ERROR] ${req.method} ${req.originalUrl}`, { error: err });
  
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn(`[OP ERROR] ${req.method} ${req.originalUrl}: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } 
  
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  logger.error(`[CRIT ERROR] 💥 ${req.method} ${req.originalUrl}`, { error: err });

  // 2) Send generic message
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went very wrong!'
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Handle Clerk Unauthenticated errors globally before entering dev/prod logic
  if (err.message === 'Unauthenticated' && err.statusCode === 500) {
    err = new AppError('Authentication failed. Please log in.', 401);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
