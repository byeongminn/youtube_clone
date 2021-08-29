import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Subscribe(props) {
    const [subscribeNumber, setSubscribeNumber] = useState(0);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const variable = { userTo: props.userTo }

        axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.');
                }
            })

        const subscribedVariable = { userTo: props.userTo, userFrom: props.userFrom };

        axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed);
                } else {
                    alert('정보를 받아오지 못했습니다.');
                }
            })

    }, [])

    const onClick = () => {
        const subscribeVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        if (subscribed) {
            // 구독 중
            axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(subscribeNumber - 1);
                        setSubscribed(!subscribed);
                    } else {
                        alert('구독 취소하는데 실패했습니다.');
                    }
                })

        } else {
            // 구독 중이 아닐 때
            axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(subscribeNumber + 1);
                        setSubscribed(!subscribed);
                    } else {
                        alert('구독하는데 실패했습니다.');
                    }
                })
        }
    }
    
    return (
        <div>
            <button
                style={{
                    backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`, border: 'none', borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase' }}
                onClick={onClick}
            >
                {subscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
