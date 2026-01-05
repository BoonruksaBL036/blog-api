const PostModel = require("../models/Post");
const UserModel = require("../models/User");

exports.createPost = async (req, res) => {
  if(!req.file){
    return res.status(400).json({message:"Image is required"});
  }

  const { title, summary, content, cover } = req.body;
  const authorId = req.authorId;
  if (!title || !summary || !content || !cover) {
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
      cover:req.file.firebaseURL,
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
    const posts = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
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
exports.getById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  try {
    const post = await PostModel.findById(id)
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    if (!post) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something occurred while retrieving posts",
    });
  }
};
exports.getByAuthorId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Author id is missing",
    });
  }
  try {
    const posts = await PostModel.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    if (!posts) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something occurred while retrieving posts",
    });
  }
};
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.authorId;
  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  const { title, summary, content, cover} = req.body;
  if (!title || !summary || !content || !cover ) {
    return res.status(400).send({
      message: "Please provide all fields",
    });
  }
  try {
    const postDoc = await PostModel.findOne({ _id: id, author: authorId });
    if (!postDoc) {
      return res
        .status(404)
        .send({ message: "Post with this author id is not found" });
    }
    if (postDoc.length < 0) {
      return res.status(403).send({
        message:
          "Unauthorize to edit this post, because you are not the author of this post",
      });
    } else {
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = cover;
      await postDoc.save();
      res.send({ message: "Post update successfully" });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something occurred while retrieving posts",
    });
  }
};
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const author = req.authorId;
  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  if (!author) {
    return res.status(400).send({
      message: "Author Id is missing",
    });
  }try {
    const postDoc = await PostModel.findByIdAndDelete({ author, _id: id });
    if (!postDoc) {
      return res.status(500).send({ message: "Cannot delete this post" });
    }
    res.send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something occurred while retrieving posts",
    });
  }
};
