import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from "antd";
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId;
    const variable = {
        videoId
    }
    const [videoDetail, setVideoDetail] = useState({});
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert("비디오 정보를 가져오기를 실패했습니다.");
                }
            })
        
        axios.post('/api/comment/getComments', variable)
            .then(response => {
                if (response.data.success) {
                    setComments(response.data.comments);
                    console.log(comments);
                } else {
                    alert('댓글 정보를 가져오는 것을 실패했습니다.');
                }
            })
    }, [])

    const refreshFunction = (newComment) => {
        setComments(comments.concat(newComment));
    }

    if (videoDetail.writer) {

        const subscribeButton = videoDetail.writer._id !== localStorage.getItem('userId')
            && <Subscribe userTo={videoDetail.writer} userFrom={localStorage.getItem('userId')} />

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${videoDetail.filePath}`} controls />
                        <List.Item
                            actions={[subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={videoDetail.writer.image} />}
                                title={videoDetail.writer.name}
                                description={videoDetail.description}
                            />
                        </List.Item>
                        <Comment refreshFunction={refreshFunction} commentLists={comments} postId={videoId} />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (
            <div>...Loading</div>
        )
    }

}

export default VideoDetailPage
