/* eslint-disable react/prop-types */
import { Badge, Spinner } from "flowbite-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const RelatedArticles = ({ categoryId, curBlogId }) => {

    const [relatedArticles, setRelatedArticles] = useState([])
    const [relatedArticlesError, setRelatedArticlesError] = useState(null)
    const [relatedArticlesLoading, setRelatedArticlesLoading] = useState(false)

    useEffect(() => {
        if (categoryId != "undefined" || categoryId != undefined) {
            const fetchBlog = async () => {
                setRelatedArticlesLoading(true)

                try {
                    const res = await fetch(`/api/blog/get-blogs?categoryId=${categoryId}&limit=${4}&sorting=desc`)

                    const data = await res.json();

                    if (data.success === false) {
                        setRelatedArticlesError('Cannot fetch the related blogs data.')
                        setRelatedArticlesLoading(false)
                        return
                    }
                    if (res.ok) {
                        if (categoryId !== undefined) {
                            setRelatedArticles(data.blogs)
                            setRelatedArticlesLoading(false)
                            return
                        }
                    }
                } catch (error) {
                    setRelatedArticlesError(error.message)
                    setRelatedArticlesLoading(false)
                }
            }
            fetchBlog()
        }
    }, [categoryId])

    return (
        <>
            {
                relatedArticlesLoading &&
                <div className="text-center p-5 bg-inherit" >
                    <Spinner  ></Spinner>
                </div>
            }

            {
                relatedArticlesError &&
                <p>Loading error occurs</p>
            }

            {
                !relatedArticlesLoading && Array.isArray(relatedArticles) && relatedArticlesError === null &&
                <section className="py-6 " >
                    <div className="container p-6 mx-auto space-y-8">
                        <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-bold text-black dark:text-slate-100">Related Articles</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4 items-center">
                            {
                                relatedArticles.filter(rl => rl._id !== curBlogId)
                                    .map(relatedArticle =>
                                        <article key={relatedArticle._id} className="flex flex-col border-2 border-blue-500">
                                            <Link to={`/blogs/${relatedArticle.slug}`} aria-label={relatedArticle.title}>
                                                <img alt="" className="object-cover w-full h-52 dark:bg-gray-500" src={relatedArticle.image} />
                                            </Link>
                                            <div className="flex flex-col flex-1 p-6">
                                                <Badge color="indigo" size="xs" className="max-w-fit">
                                                    {relatedArticle.categoryId?.category}
                                                </Badge>
                                                <Link to={`/blogs/${relatedArticle.slug}`}>
                                                    <h3 className="flex-1 py-2 text-lg font-semibold leading-snug hover:underline">
                                                        {relatedArticle.title}
                                                    </h3>
                                                </Link>
                                                <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-slate-400">
                                                    <span>
                                                        {new Date(relatedArticle.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span>{relatedArticle.viewCount} views</span>
                                                </div>
                                            </div>
                                        </article>
                                    )

                            }
                        </div>
                    </div>
                </section>
            }
        </>
    )
}

export default RelatedArticles