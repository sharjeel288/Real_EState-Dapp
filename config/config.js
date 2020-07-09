const mongoose = require('mongoose');

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-cnqwd.mongodb.net/Real_State?retryWrites=true&w=majority`;
const MongoConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
module.exports = MongoConnect;
