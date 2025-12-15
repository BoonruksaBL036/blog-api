const PostModel = require("../models/Post");
const UserModel = require("../models/User");

exports.createPost = async (req, res) => {
  const { title, summary, content, cover, authorId } = req.body;
  if (!title || !summary || !content || !cover || !authorId) {
    return res.status(400).send({
      message: "Please provide all fields.",
    });
  }
  try {
    const existedPost = await PostModel.findOne({ title });
    if (existedPost) {
      return res.status(400).send({
        message: "Post title is already used.",
      });
    }

    const author = await UserModel.findById({ _id: authorId });
    if (!author) {
      return res.status(400).send({
        message: "User not found.",
      });
    }

    const createPost = await PostModel.create({
      title,
      summary,
      content,
      cover,
      author,
    });

    if (!createPost) {
      return res.status(404).send({
        message: "Cannot create a new post.",
      });
    }
    res.send({
      message: "Create post successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something occurred while registering a new post.",
    });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const posts = (await PostModel.find().populate("author", ["username"]))
      .toSorted({ createdAt: -1 })
      .limit(20);
    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something occurred while retrieving posts",
    });
  }
};
exports.getById = async (req, res) => {};
exports.getByAuthorId = async (req, res) => {};
