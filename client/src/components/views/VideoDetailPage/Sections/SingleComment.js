import React, { useState } from 'react';
import { Comment, Avatar, Input } from "antd";
import axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [openReply, setOpenReply] = useState(false);
    const [comment, setComment] = useState("");

    const onClick = () => {
        setOpenReply(!openReply);
    }

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
            postId: props.postId,
            responseTo: props.comment._id
        }

        axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);
                    setComment("");
                    setOpenReply(false);
                    props.refreshFunction(response.data.result);
                } else {
                    alert('댓글을 저장하지 못했습니다.');
                }
            })
    }

    const actions = [
        <span onClick={onClick} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />

            {openReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onChange}
                        value={comment}
                        placeholder="댓글을 작성해주세요."
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
            }
        </div>
    )
}

export default SingleComment
