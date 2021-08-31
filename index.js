const express = require('express');
const mongoose = require("mongoose");
const config = require("./server/config/key");
const cookieParser = require("cookie-parser");

const app = express();
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use('/api/users', require('./server/routes/user'));
app.use('/api/video', require('./server/routes/video'));
app.use('/api/subscribe', require('./server/routes/subscribe'));
app.use('/api/comment', require('./server/routes/comment'));
app.use('/api/like', require('./server/routes/like'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(5000, function () {
  console.log('Example app listening on http://localhost:5000');
});