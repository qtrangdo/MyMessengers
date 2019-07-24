const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log("first middleware");
  next();
})

module.exports = app;