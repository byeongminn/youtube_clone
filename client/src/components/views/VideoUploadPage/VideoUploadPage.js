import React, { useState } from 'react';
import { Typography, Button, Form, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" }
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [videoTitle, setVideoTitle] = useState("");
    const [description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);  // private: 0, public: 1
    const [category, setCategory] = useState("Film & Animation");
    const [filePath, setFilePath] = useState("");
    const [duration, setDuration] = useState("");
    const [thumbnailPath, setThumbnailPath] = useState("");

    const onChange = (event) => {
        const {
            target: { name, value }
        } = event;
        if (name === "videoTitle") {
            setVideoTitle(value);
        } else if (name === "description") {
            setDescription(value);
        } else if (name === "private") {
            setPrivate(value);
        } else if (name === "category") {
            setCategory(value);
        }
    }

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: { "content-type": "multipart/form-data" }
        }
        formData.append("file", files[0]);

        axios.post("/api/video/uploadfiles", formData, config)
            .then((response) => {
                if (response.data.success) {
                    console.log(response.data);

                    setFilePath(response.data.url);

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    axios.post("/api/video/thumbnail", variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.url);
                            } else {
                                alert("썸네일 생성에 실패했습니다.");
                            }
                        })
                } else {
                    alert("파일 업로드를 실패했습니다.");
                }
            })
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variable = {
            writer: user.userData._id,
            title: videoTitle,
            description: description,
            privacy: Private,
            filePath: filePath,
            category: category,
            duration: duration,
            thumbnail: thumbnailPath
        }

        axios.post("/api/video/uploadVideo", variable)
            .then(response => {
                if (response.data.success) {
                    message.success("성공적으로 업로드를 했습니다.");
                    setTimeout(() => {
                        props.history.push("/");
                    }, 3000)
                } else {
                    alert("비디오 업로드에 실패했습니다.");
                }
            })
    }

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={1000000000}>
                        {({ getRootProps, getInputProps }) => (
                          <div style={{ width: "300px", height: "240px", border: "1px solid lightgray", display: "flex",
                              alignItems: "center", justifyContent: "center"}}
                              {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <PlusOutlined style={{ fontSize: "3rem" }} />
                          </div>  
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    {thumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${thumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    name="videoTitle"
                    onChange={onChange}
                    value={videoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    name="description"
                    onChange={onChange}
                    value={description}
                />
                <br />
                <br />
                <select name="private" onChange={onChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <select name="category" onChange={onChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
