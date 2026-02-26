const mongoose = require('mongoose');

const connectDB = async () => {
  // Check for MONGO_URI before attempting connection
  if (!process.env.MONGO_URI) {
    console.error('FATAL: MONGO_URI environment variable is not defined.');
    console.error('Set MONGO_URI in your .env file (local) or Render environment variables (production).');
    // Delay exit so error messages flush to stdout
    setTimeout(() => process.exit(1), 100);
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Delay exit so error messages flush to stdout
    setTimeout(() => process.exit(1), 100);
  }
};

module.exports = connectDB;
