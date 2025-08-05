const path = require('path');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const { config } = require('./config/environment');
const { connectDatabase, setupConnectionEvents } = require('./config/database');
const { logger, loggerMiddleware } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const apiRoutes = require('./routes/api');

const app = express();

setupConnectionEvents();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors(config.cors));

app.use(compression());

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(loggerMiddleware);

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.round(config.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    api: 'Full Stack App API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);

if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

const startServer = async () => {
  try {
    const dbConnection = await connectDatabase();
    if (!dbConnection) {
      console.log('Running in demo mode without database connection');
    }

    const server = app.listen(config.port, config.host, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on ${config.host}:${config.port}`);
    });

    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
