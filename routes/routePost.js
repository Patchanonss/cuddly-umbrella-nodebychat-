const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const User = require("../models/User");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// route to create post
router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // Get user ID from JWT
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const newPost = new Post({
    title,
    content,
    author: userId, // Store the user who created the post
  });
  await newPost.save().catch((err) => {
    console.error("❌ Error creating post:", err);
    return res.status(500).json({ message: "Failed to create post" });
  });

  console.log("Post written by you created!");
  return res
    .status(201)
    .json({ message: "Post created successfully", post: newPost });
});

// route to get all post
router.get("/posts", async (req, res) => {
  try {
    const temppost = await Post.find().lean(); // Await the DB query
    console.log("✅ Fetched all posts");
    res.json(temppost); // Send posts as JSON response
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// route to get cretain post
router.get("/posts/:id", async (req, res) => {
  try {
    const temppost = await Post.findById(req.params.id); // Fetch post by ID

    if (!temppost) {
      return res.status(404).json({ message: "Post not found" }); // Handle not found case
    }
    res.json(temppost);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// route to edit certain post
router.put("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from JWT (middleware)
    const postId = req.params.id;
    const { title, content } = req.body; // Get new data from request body

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the author
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can't edit this post" });
    }
    // ✅ Validate and update `title`
    if (title !== undefined && title.trim() !== "") {
      post.title = title;
    } else if (title !== undefined) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    // ✅ Update `content` only if provided
    if (content !== undefined) {
      post.content = content;
    }
    // Save the updated post
    await post.save();

    return res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("❌ Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// route to delete post by Id
router.delete("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from JWT (middleware)
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can't delete this post" });
    }
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
