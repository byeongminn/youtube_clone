import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage(props) {
    const [videos, setVideos] = useState([]);


    useEffect(() => {
        axios.get("/api/video/getVideos")
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setVideos(response.data.videos);
                } else {
                    alert('비디오 가져오기를 실패했습니다.');
                }
            })
    }, [])

    const onClick = () => {
        axios.get("/api/users/logout")
            .then(response => {
                if (response.data.success) {
                    props.history.push("/login");
                } else {
                    alert("로그아웃에 실패하였습니다.");
                }
            })
    }

    const renderCards = videos.map((video, index) => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration - minutes * 60);

        return <Col key={index} lg={6} md={8} xs={24}>
            <a href={`/video/${video._id}`}>
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    <div className="duration">
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.name}</span><br />
            <span style={{ marginLeft: '3rem' }}>{video.views} views</span>
             - <span>{moment(video.createAt).format('MMM Do YY')}</span>
        </Col>
    })

    return (
        <div style={{ width: "85%", margin: '3rem auto' }}>
            <Title level={2}>Recommended</Title>
            <button onClick={onClick}>로그아웃</button>
            <hr />
            <Row gutter={[32, 16]}>

                {renderCards}
                
            </Row>
        </div>
    )
}

export default LandingPage
