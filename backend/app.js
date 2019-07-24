const express = require("express");
const app = express();
const port = 3000;

app.use('/api/posts', (req, res, next) => {
  const posts = [
    { 
      id: "ashdgr348hk",
      title: "First server post",
      content: "this is from server"
    },
    { 
      id: "jhwg237648vj",
      title: "Second server post",
      content: "this is from server too"
    }
  ]
  res.status(200).json({
    message: "Posts fetched successfully",
    posts: posts
  })
})

module.exports = app;