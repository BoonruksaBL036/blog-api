const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Please provide username and password" });
  }
  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).send({ message: "Username is already used" });
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      username,
      password: hashedPassword,
    });
    res.send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something occurred while registering a new user",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({
      message: "User or Password are missing, please provide all fields.",
    });
  }
  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordMatched) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Internal Serve Error: Authentication failed!" });
      }
      res.send({ message: "Logged in successfully",
        id: userDoc._id,
        username: userDoc.username,
        accessToken: token });
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something occurred while registering a new user",
    });
  }
};
