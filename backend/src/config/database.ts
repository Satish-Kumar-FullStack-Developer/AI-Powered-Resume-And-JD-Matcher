import mongoose from 'mongoose';
import logger from './logger';

interface MongooseConnection {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const mongooseConnection: MongooseConnection = {
  connect: async () => {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-matcher';
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });

      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.warn('MongoDB connection failed:', error);
      logger.warn('Server will start but database features may be unavailable');
      // Don't exit - allow server to start in degraded mode
    }
  },

  disconnect: async () => {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('MongoDB disconnection failed:', error);
      throw error;
    }
  },
};

export default mongooseConnection;
