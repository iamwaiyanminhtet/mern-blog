/* eslint-disable react/prop-types */
import { GoHeart } from "react-icons/go";

const Comment = ({ comment }) => {
    return (
        <>
            <article className="p-6 text-base bg-white rounded-lg dark:bg-black">
                <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
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
                                {new Date(comment.createdAt).toLocaleString()}
                            </time>
                        </p>
                    </div>
                </footer>
                <p className="text-gray-500 dark:text-gray-400">
                    {comment.comment}
                </p>
                <div className="flex items-center mt-4 space-x-4">
                    <button type="button"
                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                        <GoHeart strokeWidth={2} size='18px' />
                    </button>
                    <span className="ms-2 text-sm text-gray-500  dark:text-gray-400" >
                        {comment.likes.length !== 0 ? `${comment.likes.length} - likes` : '0 - likes'}
                    </span>
                </div>
            </article>
            {
                comment && comment.replies.length > 0 &&
                <article className="p-6 mb-3 ml-6 mt-2 lg:ml-12 text-base bg-white rounded-lg dark:bg-black">
                    <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
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
                                    {new Date(comment.createdAt).toLocaleString()}
                                </time>
                            </p>
                        </div>
                    </footer>
                    <p className="text-gray-500 dark:text-gray-400">
                        {comment.comment}
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                        <button type="button"
                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                            <GoHeart strokeWidth={2} size='18px' />
                        </button>
                        <span className="ms-2 text-sm text-gray-500  dark:text-gray-400" >
                            {comment.likes.length !== 0 ? `${comment.likes.length} - likes` : '0 - likes'}
                        </span>
                    </div>
                </article>
            }
        </>
    )
}

export default Comment