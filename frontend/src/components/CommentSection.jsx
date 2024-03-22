/* eslint-disable react/prop-types */
import { Button, Toast } from "flowbite-react"
import { useState } from "react";
import { GoHeart } from "react-icons/go";
import { useSelector } from "react-redux"

const CommentSection = ({ blog }) => {

    const { user: curUser } = useSelector(state => state.user)
    const [commentInput, setCommentInput] = useState('')

    // create comment states
    const [comments, setComments] = useState([])
    const [createCommentError, setCreateCommentError] = useState(null)
    const [createCommentLoading, setCreateCommentLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        setCreateCommentLoading(true)
        setCreateCommentError(null)

        if (!commentInput || commentInput === '') {
            return setCreateCommentError('All fileds are required.')
        }

        try {
            const res = await fetch(`/api/comment/create-comment/${blog._id}/${curUser._id}`, {
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

                <form className="mb-6" onSubmit={handleSubmit} >
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea id="comment" rows="6"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Write a comment..." onChange={(e) => setCommentInput(e.target.value)} value={commentInput} required></textarea>
                    </div>
                    <Button size='sm' type="submit" >Post a comment</Button>
                </form>
                {/* {
                    comments &&
                    <>
                        <article className="p-6 text-base bg-white rounded-lg dark:bg-black">
                            <footer className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                        <img
                                            className="mr-2 w-6 h-6 rounded-full"
                                            src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                            alt="Michael Gough" />Michael Gough</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400"><time dateTime="2022-02-08"
                                        title="February 8th, 2022">Feb. 8, 2022</time></p>
                                </div>
                            </footer>
                            <p className="text-gray-500 dark:text-gray-400">
                                Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
                                instruments for the UX designers. The knowledge of the design tools are as important as the
                                creation of the design strategy.
                            </p>
                            <div className="flex items-center mt-4 space-x-4">
                                <button type="button"
                                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                    <GoHeart strokeWidth={2} size='18px' />
                                </button>
                                <span className="ms-2 text-sm text-gray-500  dark:text-gray-400" >3 Likes</span>
                            </div>
                        </article>
                        <article className="p-6 mb-3 ml-6 mt-2 lg:ml-12 text-base bg-white rounded-lg dark:bg-black">
                            <footer className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                        className="mr-2 w-6 h-6 rounded-full"
                                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        alt="Jese Leos" />Jese Leos</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400"><time dateTime="2022-02-12"
                                        title="February 12th, 2022">Feb. 12, 2022</time></p>
                                </div>
                            </footer>
                            <p className="text-gray-500 dark:text-gray-400">Much appreciated! Glad you liked it ☺️</p>
                            <div className="flex items-center mt-4 space-x-4">
                                <div className="flex items-center mt-4 space-x-4">
                                    <button type="button"
                                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                        <GoHeart strokeWidth={2} size='18px' />
                                    </button>
                                    <span className="ms-2 text-sm text-gray-500  dark:text-gray-400" >3 Likes</span>
                                </div>
                            </div>
                        </article></>
                } */}
            </div>
        </section>
    )
}

export default CommentSection