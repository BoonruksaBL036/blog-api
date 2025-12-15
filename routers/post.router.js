const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");

//http://localhost:5000/api/v1/post
router.post("", PostController.createPost);
//http://localhost:5000/api/v1/post
router.get("", PostController.getAllPost);
//http://localhost:5000/api/v1/post/id
router.get("/:id", PostController.getById);
//http://localhost:5000/api/v1/post/author/id
router.get("author/:id", PostController.getByAuthorId);
//http://localhost:5000/api/v1/post/id
router.put("/:id", PostController.updatePost);
//http://localhost:5000/api/v1/post/id
router.delete("/:id", PostController.deletePost);
module.exports = router;
