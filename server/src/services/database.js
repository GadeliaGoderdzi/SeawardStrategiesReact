const mongoose = require('mongoose');

class DatabaseService {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstackapp';

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false
      };

      this.connection = await mongoose.connect(connectionString, options);

      console.log(`MongoDB connected: ${this.connection.connection.host}`);

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      return this.connection;
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  getConnectionStatus() {
    return mongoose.connection.readyState;
  }

  async healthCheck() {
    try {
      const state = this.getConnectionStatus();
      const stateLabels = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };

      return {
        status: stateLabels[state] || 'unknown',
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        collections: Object.keys(mongoose.connection.collections)
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}

module.exports = new DatabaseService();
