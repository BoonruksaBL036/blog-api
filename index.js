const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const BASE_URL = process.env.BASE_URL;

const UserRouter = require("./routers/user.router");
const PostRouter = require("./routers/post.router");

const app = express();

app.use(express.json());
app.use(cors({ origin: BASE_URL, methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization","x-access-token"] }));
app.get("/", (req, res) => {
  res.send("<h1>Welcome to SE NPRU Restful API</h1>");
});

//Connect to database
if (!DB_URL) {
  console.error("DB_URL is missing. PLease set it in your .env file.");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error", error.message);
    });
}

//use router
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/posts", PostRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
