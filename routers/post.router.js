const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const authJwt = require("../middlewares/authJwt.middleware");
const {upload, uploadToSupabase} = require("../middlewares/supabase.middleware")

//http://localhost:5000/api/v1/post
router.post("",authJwt.verifyToken,upload,uploadToSupabase, PostController.createPost);
//http://localhost:5000/api/v1/post
router.get("", PostController.getAllPost);
//http://localhost:5000/api/v1/post/id
router.get("/:id", PostController.getById);
//http://localhost:5000/api/v1/post/author/id
router.get("/author/:id", PostController.getByAuthorId);
//http://localhost:5000/api/v1/post/id
router.put("/:id", authJwt.verifyToken, PostController.updatePost);
//http://localhost:5000/api/v1/post/id
router.delete("/:id", authJwt.verifyToken, PostController.deletePost);
module.exports = router;
