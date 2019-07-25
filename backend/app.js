const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");

const Post = require('./models/post');

mongoose.connect("mongodb+srv://user:YuRSoRQL2jXiyTjZ@cluster0-faqcb.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log("Connected to DB!"))
  .catch(err => console.log("Connection failed..."))

app.use(bodyParser.json());
app.use(cors());

app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body
  const post = new Post({ title, content })
  const createdPost = await post.save();
  res.status(201).json({
    message: "Post added successfully",
    postId: createdPost._id
  })
})

app.put('/api/posts/:id', async (req, res) => {
  const { title, content } = req.body;
  const _id = req.params.id;
  try {
    if (_id !== "null") {
      const postToUpdate = await Post.findById(_id);
      if (!!postToUpdate) {
        postToUpdate.title = title;
        postToUpdate.content = content;
        await Post.updateOne({ _id: req.params.id }, postToUpdate);
        return res.status(201).json({
          message: "Post updated"
        })
      }
    }
    return res.status(400).json({
      message: "No post found"
    })
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    })
  }
})

app.get('/api/posts', async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: posts
    })
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    })
  }
})

app.get('/api/posts/:id', async (req, res, next) => {
  try {
    if (req.params.id !== "null") {
      const post = await Post.findById(req.params.id);
      if (!!post) {
        return res.status(200).json({
          message: "Post fetched successfully",
          post: post
        })
      }
    }
    return res.status(400).json({
      message: "No post found"
    })
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    })
  }
})

app.delete('/api/posts/:id', async (req, res, next) => {
  try {
    if (req.params.id !== "null") {
      const postToRemove = await Post.findById(req.params.id);
      if (!!postToRemove) {
        await postToRemove.remove();
        return res.status(201).json({
          message: "Post deleted"
        })
      }
    }
    return res.status(400).json({
      message: "No post found"
    })
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    })
  }
})


module.exports = app;