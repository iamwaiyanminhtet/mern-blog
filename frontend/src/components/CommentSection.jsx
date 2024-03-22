/* eslint-disable react/prop-types */
import { Button, Toast, Spinner } from "flowbite-react"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import Comment from "./Comment";

const CommentSection = ({ blogId }) => {

    const { user: curUser } = useSelector(state => state.user)
    const [commentInput, setCommentInput] = useState('')

    // create comment states
    const [comments, setComments] = useState([])
    const [createCommentError, setCreateCommentError] = useState(null)
    const [createCommentLoading, setCreateCommentLoading] = useState(false)

    // load comments
    const [loadCommentsError, setLoadCommentsError] = useState(null)

    // get comments
    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`/api/comment/get-comments/${blogId}`)
            const data = await res.json()

            if (data.success === false) {
                setLoadCommentsError(data.message)
            }

            if (res.ok) {
                setComments(data)
                setLoadCommentsError(null)
            }
        }

        fetchComments()
    }, [blogId])


    const handleSubmit = async (e) => {
        e.preventDefault();

        setCreateCommentLoading(true)
        setCreateCommentError(null)

        if (!commentInput || commentInput === '') {
            return setCreateCommentError('All fileds are required.')
        }

        try {
            const res = await fetch(`/api/comment/create-comment/${blogId}/${curUser._id}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: commentInput })
            })

            const data = await res.json()

            if (data.success === false) {
                setCreateCommentError(data.message)
                setCreateCommentLoading(false)
            }

            if (res.ok) {
                setComments([...comments, data])
                console.log(data)
                setCreateCommentLoading(false)
                setCommentInput('')
            }
        } catch (error) {
            setCreateCommentError(error.message)
            setCreateCommentLoading(false)
        }
    }

    console.log(comments)

    return (
        <section className="bg-white dark:bg-black py-8 lg:py-16 antialiased">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion (20)</h2>
                </div>

                {
                    createCommentError &&
                    <Toast className="mt-2 mb-2 min-w-fit h-10 bg-red-500 dark:bg-red-500" >
                        <div className="ml-3 text-sm text-black font-sm sm:text-nowrap">
                            {createCommentError}
                        </div>
                        <Toast.Toggle />
                    </Toast>
                }

                {
                    loadCommentsError &&
                    <Toast className="mt-2 mb-2 min-w-fit h-10 bg-red-500 dark:bg-red-500" >
                        <div className="ml-3 text-sm text-black font-sm sm:text-nowrap">
                            {loadCommentsError}
                        </div>
                        <Toast.Toggle />
                    </Toast>
                }

                <form className="mb-6" onSubmit={handleSubmit} >
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea id="comment" rows="6"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Write a comment..." onChange={(e) => setCommentInput(e.target.value)} value={commentInput} required></textarea>
                    </div>
                    <Button size='sm' type="submit" >
                        {
                            createCommentLoading ?
                                <>
                                    <Spinner size="sm" /> <span className="ms-2">Post a comment</span>
                                </> :
                                <span>Post a comment</span>
                        }
                    </Button>
                </form>
                {
                    comments &&
                    <>
                        {
                            comments.map(comment => 
                                <Comment key={comment._id} comment={comment} />    
                            )
                        }
                    </>
                }
            </div>
        </section>
    )
}

export default CommentSection