const express = require('express');
const mongoose = require("mongoose");
const config = require("./server/config/key");

const app = express();
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(5000, function () {
  console.log('Example app listening on http://localhost:5000');
});