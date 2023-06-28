const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/uasDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('CONNECTED TO MONGODB');
  } catch (error) {
    console.error('FAILED TO CONNECT TO MONGO DB', error);
    process.exit(1); // Exit the process with a failure
  }
};

module.exports = connectDB;
