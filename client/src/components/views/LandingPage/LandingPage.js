import React from 'react';
import axios from 'axios';

function LandingPage(props) {
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

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"
            , width: "100%", height: "100vh"
        }}>
            시작 페이지
            <button onClick={onClick}>로그아웃</button>
        </div>
    )
}

export default LandingPage
