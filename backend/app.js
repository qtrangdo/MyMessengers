const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

app.post('/api/posts', (req,res) => {
  console.log(req.body)
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