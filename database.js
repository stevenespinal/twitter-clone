const mongoose = require("mongoose");

const database = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = database;
