/**
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: Mongoose, MongoDB Atlas, and dotenv documentation.
 */

const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

/** Connect once using the Atlas URI stored outside source control in .env. */
async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const connectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error(
      'MONGODB_CONNECTION_STRING is missing. Add it to the .env file.',
    );
  }

  await mongoose.connect(connectionString);
  console.log('Connected to MongoDB Atlas');

  return mongoose.connection;
}

/** Close the active connection so CLI scripts can finish cleanly. */
async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  mongoose,
};
