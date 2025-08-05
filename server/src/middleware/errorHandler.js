const errorHandler = {
  notFound: (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  },

  errorHandler: (err, req, res, next) => {
    let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      statusCode = 404;
      message = 'Resource not found';
    }

    if (err.code === 11000) {
      statusCode = 400;
      const field = Object.keys(err.keyValue)[0];
      message = `${field} already exists`;
    }

    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }

    console.error(`Error ${statusCode}: ${message}`);
    console.error(err.stack);

    res.status(statusCode).json({
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  },

  asyncHandler: (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  },

  rateLimitHandler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000) || 60
    });
  }
};

module.exports = errorHandler;
