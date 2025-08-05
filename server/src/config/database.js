const mongoose = require('mongoose');

const databaseConfig = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstackapp_dev',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    }
  },

  production: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority'
    }
  },

  test: {
    uri: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/fullstackapp_test',
    options: {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    }
  }
};

const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return databaseConfig[env];
};

const connectDatabase = async () => {
  try {
    const config = getCurrentConfig();

    if (!config.uri) {
      throw new Error('Database URI is not defined');
    }

    await mongoose.connect(config.uri, config.options);
    console.log(`MongoDB connected to ${config.uri.split('@')[1] || config.uri}`);

    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('Continuing without database connection for testing...');
    return null;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

const setupConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });

  process.on('SIGINT', async () => {
    await disconnectDatabase();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  setupConnectionEvents,
  getCurrentConfig
};
