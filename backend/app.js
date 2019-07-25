const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");

const Post = require('./models/post');

mongoose.connect("mongodb+srv://user:YuRSoRQL2jXiyTjZ@cluster0-faqcb.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => console.log("Connected to DB!"))
  .catch(err => console.log("Connection failed..."))

app.use(bodyParser.json());
app.use(cors());

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body
  const post = new Post({ title, content })
  console.log(post)
  res.status(201).send();
})

app.get('/api/posts', (req, res, next) => {
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