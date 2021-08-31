import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReplyComment from './ReplyComment';
import SingleComment from './SingleComment';

function Comment(props) {
    const videoId = props.postId;
    const user = useSelector(state => state.user);
    const [comment, setComment] = useState("");

    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setComment(value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variable = {
            content: comment,
            writer: user.userData._id,
            postId: videoId,
        }

        axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);
                    setComment("");
                    props.refreshFunction(response.data.result);
                } else {
                    alert('댓글을 저장하지 못했습니다.');
                }
            })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && 
                    <div key={index}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} postId={videoId} />
                    </div>
                )
            ))}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onChange}
                    value={comment}
                    placeholder="댓글을 작성해주세요."
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment
