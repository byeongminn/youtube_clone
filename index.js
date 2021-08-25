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

app.post("/api/users/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({ loginSuccess: false, message: "등록되지 않은 이메일입니다." });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
            })
        })
    })
})

app.listen(5000, function () {
  console.log('Example app listening on http://localhost:5000');
});