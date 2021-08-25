const express = require('express');
const mongoose = require("mongoose");
const config = require("./server/config/key");
const cookieParser = require("cookie-parser");

const { User } = require("./server/models/User");
const { auth } = require("./server/middleware/auth");

const app = express();
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get("/api/hello", (req, res) => {
    res.send("Hello");
})

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

app.get("/api/users/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })
})

app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({ success: true });
    })
})

app.listen(5000, function () {
  console.log('Example app listening on http://localhost:5000');
});