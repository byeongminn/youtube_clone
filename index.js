const express = require('express');
const mongoose = require("mongoose");
const config = require("./server/config/key");

const { User } = require("./server/models/User");

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

app.post("/api/users/register", (req, res) => {
    const user = User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(5000, function () {
  console.log('Example app listening on http://localhost:5000');
});