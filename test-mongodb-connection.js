// Test MongoDB Atlas Connection
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Make sure you have updated your .env file with your MongoDB Atlas password');
      return;
    }

    // Hide password in logs for security
    const uri = process.env.MONGODB_URI;
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log('Connecting to:', maskedUri);

    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test creating a simple document
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ 
      message: 'Connection test successful', 
      timestamp: new Date() 
    });
    
    console.log('✅ Successfully inserted test document');
    
    // Clean up test document
    await testCollection.deleteOne({ message: 'Connection test successful' });
    console.log('✅ Test document cleaned up');
    
    // Test User model
    const User = require('./server/src/models/User');
    console.log('✅ User model loaded successfully');
    
    console.log('🎉 MongoDB Atlas is ready for your application!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Fix: Check your MongoDB Atlas password in the .env file');
      console.log('   Make sure you replaced YOUR_ACTUAL_PASSWORD with your real password');
    } else if (error.message.includes('not allowed to access')) {
      console.log('\n💡 Fix: Add your IP address to MongoDB Atlas Network Access');
      console.log('   1. Go to MongoDB Atlas dashboard');
      console.log('   2. Navigate to Network Access');
      console.log('   3. Add your current IP address or use 0.0.0.0/0 for development');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Fix: Check your internet connection and MongoDB Atlas cluster status');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testConnection();