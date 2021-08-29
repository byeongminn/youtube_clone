const express = require('express');
const mongoose = require("mongoose");
const config = require("./server/config/key");
const cookieParser = require("cookie-parser");

const { User } = require("./server/models/User");
const { auth } = require("./server/middleware/auth");
const { Video } = require("./server/models/Video");

const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use('/api/subscribe', require('./server/routes/subscribe'));

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

// Video
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== ".mp4") {
            return cb(res.status(400).end("only mp4 is allowed"), false);
        }
        cb(null, true);
      
      }
  })
  
const upload = multer({ storage: storage }).single("file");

app.post("/api/video/uploadfiles", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    })
})

app.post("/api/video/thumbnail", (req, res) => {
    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
        console.log("Will generate " + filenames.join(", "));
        console.log(filenames);

        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
        console.log("Screenshots taken");
        return res.json({ success: true, url: filePath, fileDuration: fileDuration });
    })
    .on("error", function (err) {
        console.log(err);
        return res.json({ success: false, err });
    })
    .screenshots({
        count: 3,
        folder: "uploads/thumbnails",
        size: "320x240",
        filename: "thumbnail-%b.png"
    })
})

app.post("/api/video/uploadVideo", (req, res) => {
    const video = new Video(req.body);

    video.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    })
})

app.get("/api/video/getVideos", (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos });
        })
})

app.post("/api/video/getVideoDetail", (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videoDetail });
        })
})

app.listen(5000, function () {
  console.log('Example app listening on http://localhost:5000');
});