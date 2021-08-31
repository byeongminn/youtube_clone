import React, { useState, useEffect } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    const [childCommentNumber, setChildCommentNumber] = useState(0);
    const [openReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        })
        setChildCommentNumber(commentNumber);
    }, [props.commentLists])

    const renderReplyComment = (parentCommentId) => (
        props.commentLists.map((comment, index) => (
            <div key={index}>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} postId={props.videoId}/>
                    </div>
                }
            </div>
        ))
    )

    const onClick = () => {
        setOpenReplyComments(!openReplyComments);
    }

    return (
        <div>
            {childCommentNumber > 0 &&
                <span style={{ fontSize: '14px', margin: 0, color: 'gray', cursor: 'pointer' }} onClick={onClick}>
                    View {childCommentNumber} more comment(s)
                </span>
            }
            {openReplyComments && 
                renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment
