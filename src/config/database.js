const mongoose = require("mongoose");

const connectDB = async () => {
  // await mongoose.connect(process.env.MONGO_URI);
  await mongoose

  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log("MongoDB connected");

    console.log("Database:", mongoose.connection.name);

  })

  .catch((err) => {

    console.error("Error connecting to MongoDB:", err);

  });
};

module.exports = connectDB;