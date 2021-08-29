import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const onChange = (event) => {
        const {
            target: { name, value }
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const body = {
            email,
            password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    window.localStorage.setItem('userId', response.payload.userId);
                    props.history.push("/");
                } else {
                    alert("Error");
                }
            })
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"
            , width: "100%", height: "100vh"
        }}>
            <form style={{
                display: "flex", flexDirection: "column"
            }} onSubmit={onSubmit} >
                <label>Email</label>
                <input name="email" type="email" value={email} onChange={onChange} />
                <label>Password</label>
                <input name="password" type="password" value={password} onChange={onChange} />
                <br />
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}

export default LoginPage
