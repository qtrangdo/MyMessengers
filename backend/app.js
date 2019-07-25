const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");

const postsController = require('./controllers/posts');


mongoose.connect("mongodb+srv://user:YuRSoRQL2jXiyTjZ@cluster0-faqcb.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log("Connected to DB!"))
  .catch(err => console.log("Connection failed..."))

app.use(bodyParser.json());
app.use(cors());

app.use('/api/posts', postsController)


module.exports = app;