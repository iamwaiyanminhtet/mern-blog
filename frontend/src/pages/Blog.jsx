import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import HTMLReactParser from "html-react-parser"
import CommentSection from "../components/CommentSection";
import { HiExclamation } from 'react-icons/hi'
import { Toast } from "flowbite-react";
import RelatedArticles from "../components/RelatedArticles";
import FooterComponent from "../components/Footer"

const Blog = () => {
    const { blogSlug } = useParams();
    const [blog, setBlog] = useState({});

    // fetch blog state
    const [blogLoading, setBlogLoading] = useState(false)
    const [blogError, setBlogError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            setBlogLoading(true)

            try {
                const res = await fetch(`/api/blog/get-blogs?slug=${blogSlug}`)
                const data = await res.json();

                if (data.success === false) {
                    setBlogError('Cannot fetch the blog data.')
                    setBlogLoading(false)
                    return;
                }

                if (res.ok) {
                    setBlog(data.blogs[0])
                    setBlogLoading(false)
                }
            } catch (error) {
                setBlogError(error.message)
                setBlogLoading(false)
            }
        }

        fetchBlog()



    }, [blogSlug])


    useEffect(() => {
        const increaseViewCount = async (blogId) => {
            const res = await fetch(`/api/blog/increase-view-count/${blogId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json();
            if (data.success === false) {
                setBlogError('Increased view count error')
                return;
            }
        }

        if(blog._id) {
            increaseViewCount(blog._id)
        }
    }, [blog._id])

    console.log(blog.content)

    return (
        <>
            {
                blogError &&
                <Toast className="mt-2 min-w-fit">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                        <HiExclamation className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal sm:text-nowrap">
                        {blogError}
                    </div>
                    <Toast.Toggle />
                </Toast>
            }
            {
                blogLoading &&
                <div className="max-w-2xl px-3 sm:px-6 py-16 mx-auto space-y-12" >
                    <div role="status" className="space-y-8 animate-pulse flex-col md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
                        <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700">
                            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                        <div className="w-full mt-3">
                            <div className="h-2.5 mt-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>



            }
            {
                !blogLoading && blog &&
                <>
                    <div className="max-w-2xl px-6 py-16 mx-auto space-y-12">
                        <article className="space-y-8 dark:bg-black dark:text-gray-50">
                            <div className="space-y-6">
                                <h1 className="text-4xl font-bold md:tracking-tight md:text-5xl">
                                    {blog.title}
                                </h1>
                                <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center dark:text-gray-400">
                                    <div className="flex items-center justify-between md:space-x-2 gap-3">
                                        <img src={blog && (blog?.userId?.pfp || blog?.userId?.defaultPfp)} className="w-14 h-14 border rounded-full dark:bg-gray-500 dark:border-gray-700" />
                                        <p className="text-sm flex flex-col">
                                            <span>
                                                {blog?.userId?.username}
                                            </span>
                                            <span className="ms-2">
                                                {new Date(blog.createdAt).toDateString()}
                                            </span>
                                        </p>
                                    </div>
                                    <p className="flex-shrink-0 mt-3 text-sm md:mt-0">
                                        <span>{Math.floor(blog?.content?.length / 238) === 0 ? 1 : Math.floor(blog?.content?.length / 238)} min read</span> •
                                        <span className="ms-1" >{blog.viewCount} views</span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <img src={blog.image} alt="" />
                            </div>
                            <div className="dark:text-gray-100">
                                <div className="blog-content appearance-auto" >
                                    {HTMLReactParser(blog?.content || '')}
                                </div>
                                <h1 className="appearence-auto">Hello</h1>
                            </div>
                        </article>
                        <div>
                            <div className="flex flex-wrap py-6 gap-2 border-t border-dashed dark:border-gray-400">
                                <a rel="noopener noreferrer" className="px-3 py-1 rounded-sm hover:underline dark:bg-blue-400 dark:text-gray-900">#{blog.categoryId?.category}</a>
                            </div>
                        </div>
                        <CommentSection blogId={blog._id} />
                    </div>
                    <RelatedArticles categoryId={blog?.categoryId?._id} curBlogId={blog._id} />
                    <FooterComponent />
                </>

            }
        </>
    )
}

export default Blog