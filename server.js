const express = require("express");
// const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();

// connect to database
connectDB();

// Init Middleware
app.use( express.json({ extended: false }));

app.get("/", (req, res) => res.send("API runing"));

 
//Define routes

app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/post", require("./routes/api/post"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));