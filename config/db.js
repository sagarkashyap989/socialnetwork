// This is just to connect to mngoDB atlas database

const mongoose = require("mongoose");
// import mongoose from "mongoose"
const config = require("config");
// import config from "config"
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect(db);

        console.log("mongoDB connected...");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

// export default connectDB

module.exports = connectDB;