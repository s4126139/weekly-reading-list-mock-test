const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const connectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error(
      'MONGODB_CONNECTION_STRING is missing. Add it to the .env file.'
    );
  }

  await mongoose.connect(connectionString);
  console.log('Connected to MongoDB Atlas');

  return mongoose.connection;
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  mongoose
};
