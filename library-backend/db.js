const mongoose = require('mongoose');

const connectToDatabase = async (uri) => {
  console.log('Connecting to dabase:', uri);

  try {
    await mongoose.connect(uri);
    console.log('connected to mongoDB');
  } catch (error) {
    console.log('error connecting to mongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
