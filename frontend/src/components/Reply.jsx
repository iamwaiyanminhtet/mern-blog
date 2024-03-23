/* eslint-disable react/prop-types */
import { useState } from 'react'
import moment from 'moment'
import { Toast, Textarea, Button } from 'flowbite-react'
import { useSelector } from 'react-redux'
import { FaHeart } from 'react-icons/fa6'

const Reply = ({ curReply, editError, onLike, handleEditSave }) => {
    const { user: curUser } = useSelector(state => state.user)

    const [isReplyEditing, setIsReplyEditing] = useState(false)
    const [replyEditingContent, setReplyEditingContent] = useState(curReply.comment)

    return (
        <article key={curReply._id} className={`p-6 mb-3 ml-6 mt-2 lg:ml-12 text-base bg-white rounded-lg dark:bg-black `} >
            <footer className="flex justify-between flex-col sm:flex-row items-start mb-2">
                <div className="flex items-center flex-col sm:flex-row gap-1 ">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        <img
                            className="mr-2 w-8 h-8 rounded-full"
                            src={curReply.userId.pfp || curReply.userId.defaultPfp}
                            alt={curReply.userId.username} />
                        <span>{curReply.userId.username}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <time dateTime={new Date(curReply.createdAt).toLocaleString()}
                            title={new Date(curReply.createdAt).toLocaleString()}>
                            {moment(curReply.createdAt).fromNow()}
                        </time>
                    </p>
                </div>
            </footer>
            {
                isReplyEditing ?
                    <>

                        {
                            editError &&
                            <Toast className="mt-2 mb-2 min-w-fit h-10 bg-red-500 dark:bg-red-500" >
                                <div className="ml-3 text-sm text-black font-sm sm:text-nowrap">
                                    {'hhhhhhh'}
                                </div>
                                <Toast.Toggle />
                            </Toast>
                        }

                        <Textarea defaultValue={replyEditingContent} onChange={(e) => setReplyEditingContent(e.target.value)} rows={3} />
                        <div className="flex justify-end mt-2 gap-1">
                            <Button size="xs" onClick={() => handleEditSave(replyEditingContent, true)}>Save</Button>
                            <Button size="xs" color='light' onClick={() => setIsReplyEditing(false)} >Cancel</Button>
                        </div>

                    </>
                    :
                    <>
                        <p className="text-gray-700 dark:text-gray-400"  >
                            {curReply.comment}
                        </p>
                    </>
            }
            <div className={`flex mt-4 space-x-4 justify-between `}>
                <div className="flex flex-row">
                    <button type="button"
                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                        <FaHeart className="shadow-md" strokeWidth={2} size='18px' fill={`${curReply.likes.includes(curUser._id) ? '#E02424' : 'gray'}`} onClick={() => onLike(curReply._id, curUser._id)} />
                    </button>
                    <span className="ms-2 text-sm text-gray-500  dark:text-gray-400 font-semibold" >
                        {curReply.likes.length !== 0 ? `${curReply.likes.length} - likes` : '0 - likes'}
                    </span>
                </div>
                <div className="text-sm flex gap-2 ">
                    {/* <button className="text-sm text-gray-500 hover:underline dark:text-gray-400 font-semibold">Reply</button> */}
                    {
                        (curUser?.isAdmin || curUser?._id === curReply.userId._id) &&
                        <>
                            <button className="text-blue-500  dark:text-blue-600 hover:underline font-semibold" onClick={() => {
                                setIsReplyEditing(true)
                                setReplyEditingContent(replyEditingContent)
                            }} >Edit</button>
                            <button className="text-red-500  dark:text-red-600  hover:underline font-semibold">Delete</button>
                        </>
                    }
                </div>
            </div>
        </article>
    )
}

export default Reply