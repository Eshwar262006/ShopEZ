const mongoose = require('mongoose');

const uri = "mongodb+srv://Shopze:shopze123@cluster0.pe3wxtg.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB Atlas connection failed:", err.message);
    process.exit(1);
  });
