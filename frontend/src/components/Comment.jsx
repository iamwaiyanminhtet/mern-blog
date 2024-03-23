/* eslint-disable react/prop-types */
import { Button, Textarea, Toast } from "flowbite-react";
import { useRef, useState } from "react";
import { FaHeart, FaReply } from "react-icons/fa6";
import { useSelector } from "react-redux";
import moment from "moment"
import Reply from "./Reply";

const Comment = ({ comment, onEdit, onLike, blogId, setComments }) => {

    const { user: curUser } = useSelector(state => state.user)

    // // edit states
    const [isEditing, setIsEditing] = useState(false)
    const [editingContent, setEditingContent] = useState(comment.comment)
    const [editError, setEditError] = useState(null)

    // reply states
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyError, setReplyError] = useState(null)

    const handleEditSave = async (commentValue, isReply) => {
        if (isReply) {
            const res = await fetch(`/api/comment/update/${comment._id}/${comment.userId._id}/${isReply}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: commentValue })
            })
            const data = await res.json()

            console.log(data)
        } else {
            const res = await fetch(`/api/comment/update/${comment._id}/${comment.userId._id}/${isReply}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: commentValue })
            })
            const data = await res.json()

            if (data.success === false) {
                setEditError(data.message)
            }

            if (res.ok) {
                setIsEditing(false)
                onEdit(comment, editingContent)
            }
        }
    }

    const handleCreateReply = async () => {
        const res = await fetch(`/api/comment/create-comment/${blogId}/${curUser._id}/true/${comment._id}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: replyContent })
        })

        const data = await res.json()
        if(data.message === false) {
            setReplyError(data.message)
        }
        if(res.ok) {
            setComments(data)
            setIsReplying(false)
        }
    }

    return (
        <>
            {/* {comment.replies.length > 0 ? `mb-3 ml-6 mt-2 lg:ml-12 text-base` : ``} */}
            {
                !comment.isReply &&

                <article className={`p-6 text-base bg-white rounded-lg dark:bg-black `} >
                    <footer className="flex justify-between flex-col sm:flex-row items-start mb-2">
                        <div className="flex items-center flex-col sm:flex-row gap-1 ">
                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                <img
                                    className="mr-2 w-8 h-8 rounded-full"
                                    src={comment.userId.pfp || comment.userId.defaultPfp}
                                    alt={comment.userId.username} />
                                <span>{comment.userId.username}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <time dateTime={new Date(comment.createdAt).toLocaleString()}
                                    title={new Date(comment.createdAt).toLocaleString()}>
                                    {moment(comment.createdAt).fromNow()}
                                </time>
                            </p>
                        </div>
                    </footer>
                    {
                        isEditing ?
                            <>

                                {
                                    editError &&
                                    <Toast className="mt-2 mb-2 min-w-fit h-10 bg-red-500 dark:bg-red-500" >
                                        <div className="ml-3 text-sm text-black font-sm sm:text-nowrap">
                                            {editError}
                                        </div>
                                        <Toast.Toggle />
                                    </Toast>
                                }

                                <Textarea defaultValue={editingContent} onChange={(e) => setEditingContent(e.target.value)} rows={3} />
                                <div className="flex justify-end mt-2 gap-1">
                                    <Button size="xs" onClick={() => handleEditSave(editingContent, false)}>Save</Button>
                                    <Button size="xs" color='light' onClick={() => setIsEditing(false)} >Cancel</Button>
                                </div>

                            </>
                            :
                            <>
                                <p className="text-gray-700 dark:text-gray-400">
                                    {comment.comment}
                                </p>
                            </>
                    }
                    <div className={`flex mt-4 space-x-4 justify-between `}>
                        <div className="flex flex-row">
                            <button type="button"
                                className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                <FaHeart className="shadow-md" strokeWidth={2} size='18px' fill={`${comment.likes.includes(curUser._id) ? '#E02424' : 'gray'}`} onClick={() => onLike(comment._id, curUser._id)} />
                            </button>
                            <span className="ms-2 text-sm text-gray-500  dark:text-gray-400 font-semibold" >
                                {comment.likes.length !== 0 ? `${comment.likes.length} - likes` : '0 - likes'}
                            </span>
                        </div>
                        <div className="text-sm flex gap-2 ">
                            <button className="text-sm text-gray-500 hover:underline flex items-center dark:text-gray-400 font-semibold"> <FaReply /> <span className="ms-1" onClick={() => setIsReplying(true)} >Reply</span>
                            </button>
                            {
                                (curUser?.isAdmin || curUser?._id === comment.userId._id) &&
                                <>
                                    <button className="text-blue-500  dark:text-blue-600 hover:underline font-semibold" onClick={() => setIsEditing(true)} >Edit</button>
                                    <button className="text-red-500  dark:text-red-600  hover:underline font-semibold">Delete</button>
                                </>
                            }
                        </div>
                    </div>
                    {
                        isReplying &&
                        <div className="mt-3">
                            {
                                replyError &&
                                <Toast className="mt-2 mb-2 min-w-fit h-10 bg-red-500 dark:bg-red-500" >
                                    <div className="ml-3 text-sm text-black font-sm sm:text-nowrap">
                                        {replyError}
                                    </div>
                                    <Toast.Toggle />
                                </Toast>
                            }
                            <Textarea onChange={(e) => setReplyContent(e.target.value)} rows={3} placeholder="reply..." />
                            <div className="flex justify-end mt-2 gap-1">
                                <Button size="xs" onClick={() => handleCreateReply()}>Reply</Button>
                                <Button size="xs" color='light' onClick={() => setIsReplying(false)} >Cancel</Button>
                            </div>
                        </div>
                    }
                </article>
            }
            {
                comment && comment.replies.length > 0 &&
                comment.replies.map(curReply =>
                    <Reply
                        key={curReply._id}
                        curReply={curReply}
                        editError={editError}
                        onLike={onLike}
                        handleEditSave={handleEditSave}
                    />
                )
            }

        </>
    )
}

export default Comment