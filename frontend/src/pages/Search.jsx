import { Badge, TextInput, Button, Select } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import HTMLReactParser from "html-react-parser"
import { FaInfoCircle, FaTimes } from "react-icons/fa"
import FooterComponent from "../components/Footer"

// https://lottiefiles.com/animations/loading-599Uz5RpL5

const Search = () => {
    const { user: curUser } = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const [blogsData, setBlogsData] = useState({
        blogs: [], total: 0
    })
    const [blogsDataCopy, setBlogsDataCopy] = useState([])
    const [showMore, setShowMore] = useState(true)
    const searchRef = useRef()
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({})

    // get all categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            const res = await fetch('/api/category/getCategories')
            const data = await res.json();

            if (data.success === false) {
                setLoading(false)
                setError(data.message)
                return
            }

            if (res.ok) {
                setCategories(data.categories)
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true)
            const res = await fetch(`/api/blog/get-blogs`)
            const data = await res.json();

            if (data.success === false) {
                setLoading(false)
                setError(data.message)
                return
            }

            if (res.ok) {
                setBlogsData({
                    blogs: data.blogs,
                    total: data.totalBlogs
                })
                setBlogsDataCopy({
                    blogs: data.blogs,
                    total: data.totalBlogs
                })
                setLoading(false)
                if (data.blogs.length < 5) {
                    setShowMore(false)
                }
            }
        }
      
            fetchBlogs()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSearch = async () => {
        setError(null)
        if (!formData.searchTerm || !formData.searchTerm === '') {
            setError('Type in search')
            searchRef.current.focus();
            return
        }
        setLoading(true)

        const sorting = formData.sorting || 'desc'
        const category = formData.categoryId === 'all' ? '' : formData.categoryId || ''

        const res = await fetch(`/api/blog/get-blogs?searchTerm=${formData.searchTerm}&sorting=${sorting}&categoryId=${category}`)
        const data = await res.json();

        if (data.success === false) {
            setLoading(false)
            setError(data.message)
            return
        }

        if (res.ok) {
            setBlogsData({ ...blogsData, blogs: data.blogs })
            setBlogsDataCopy({ ...blogsData, blogs: data.blogs })
            setLoading(false)
            if (data.blogs.length < 5 || data.totalBlogs === data.blogs.length) {
                setShowMore(false)
            }
        }
    }

    const handleShowMore = async () => {
        setError(null)
        const startIndex = blogsData.blogs.length;
        const sorting = formData.sorting || 'desc'
        const searchTerm = formData.searchTerm || ''
        const category = formData.categoryId === 'all' ? '' : formData.categoryId || ''

        const res = await fetch(
            `/api/blog/get-blogs?startIndex=${startIndex}&searchTerm=${searchTerm}&sorting=${sorting}&categoryId=${category}`
        )
        const data = await res.json();

        if (data.success === false) {
            setError(data.message)
            return
        }

        if (res.ok) {
            setBlogsData({ ...blogsData, blogs: [...blogsData.blogs, ...data.blogs] })
            setBlogsDataCopy({ ...blogsData, blogs: [...blogsData.blogs, ...data.blogs] })
            setLoading(false)
            if (data.blogs.length < 5 || data.totalBlogs === data.blogs.length) {
                setShowMore(false)
            }
        }
    }

    const handleCategorySelectChange = (e) => {
        if (e.target.value === "all") {
            setBlogsData({ ...blogsData, blogs: blogsDataCopy.blogs });
            return;
        } else {
            setBlogsData({ ...blogsData, blogs: blogsDataCopy.blogs.filter(blog => blog.categoryId._id === e.target.value) })
        }
    }

    const handleSortingSelectChange = (e) => {
        if(e.target.value === "desc") {
            setBlogsData({...blogsData, blogs : blogsData.blogs.sort((a,b) =>  new Date(b.createdAt) - new Date(a.createdAt))})
        }
        if(e.target.value === "asc") {
            setBlogsData({...blogsData, blogs : blogsData.blogs.sort((a,b) =>  new Date(a.createdAt) - new Date(b.createdAt))})
        }
    }

    return (
        <div className="bg-inherit max-w-4xl mx-auto">
            {
                loading &&
                <p className="text-lg text-center my-5">Loading.....</p>
            }
            {
                error &&
                <div className=" my-5" >
                    <div id="alert-2" className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <FaInfoCircle />
                        <span className="sr-only">Info</span>
                        <div className="ms-3 text-sm font-medium">
                            <span>{error}</span>
                        </div>
                        <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
                            <span className="sr-only">Close</span>
                            <FaTimes />
                        </button>
                    </div>
                </div>
            }

            {
                !loading &&
                <div className="pb-10 max-w-4xl px-5 lg:px-0 dark:text-slate-300 mt-5">
                    <div className="my-5 flex flex-col sm:flex-row  justify-start  md:justify-between gap-3 ">
                        <div>
                            <Select className="max-w-fit" id="categoryId" onChange={(e) => {
                                setFormData({ ...formData, [e.target.id]: e.target.value })
                                handleCategorySelectChange(e)
                            }} value={formData.categoryId || ''}  >
                                <option value="all">All</option>
                                {categories &&
                                    categories.map(category =>
                                        <option key={category._id} value={category._id} >
                                            {category.category}
                                        </option>
                                    )
                                }
                            </Select>
                        </div>
                        <div>
                            <Select className="max-w-fit" id="sorting" onChange={(e) => {
                                setFormData({ ...formData, [e.target.id]: e.target.value })
                                handleSortingSelectChange(e)
                            }} value={formData.sorting || ''} >
                                <option value="desc">latest</option>
                                <option value="asc">newest</option>
                            </Select>
                        </div>
                        <div className="flex">
                            <TextInput ref={searchRef} placeholder="search" className="max-w-fit" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} as={'input'} id="searchTerm" defaultValue={formData.searchTerm || ''} />
                            <Button type="button" onClick={handleSearch} >Search</Button>
                        </div>

                    </div>
                    <div className="flex flex-col sm:flex-row my-5 gap-3  justify-start md:justify-between items-start sm:items-center">
                        <p className="text-lg ">currently displaying {blogsData.blogs.length} of {blogsData.total} blogs</p>
                        <p className="text-sm max-w-80">
                            how filtering works in here : just selecting will filter from current display data. however, when search button is clicked, selected values will be carried to search from whole data.
                        </p>
                    </div>
                    <div className="flex flex-col gap-5" >
                        {
                            blogsData && blogsData.blogs.length > 0 &&
                            blogsData.blogs.map(blog =>
                                <div key={blog._id} className="container  px-10 py-6  rounded-lg  border-2 border-sky-400 shadow-md dark:shadow-lg  dark:shadow-sky-400 bg-inherit">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm ">
                                            {new Date(blog.createdAt).toDateString()}
                                        </span>
                                        <Badge as={'div'} size="lg" color="info" >{blog?.categoryId?.category}</Badge>
                                    </div>
                                    <div className="mt-3">
                                        <Link rel="noopener noreferrer" className="text-2xl font-bold hover:underline" to={`/blogs/${blog.slug}`} >
                                            {blog.title}
                                        </Link>
                                        <div className="mt-2 line-clamp-1">
                                            {HTMLReactParser(blog?.content || '')}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <Link rel="noopener noreferrer" to={`/blogs/${blog.slug}`} className="hover:underline dark:text-sky-600">Read more</Link>
                                        <div>
                                            <div className="flex items-center">
                                                <img src={blog?.userId?.pfp || blog?.userId?.defaultPfp} alt={blog?.userId?.username} className="object-cover w-10 h-10 mx-4 rounded-full " />
                                                <span >
                                                    {blog?.userId?.username}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {
                        showMore &&
                        <div className="mt-10 pb-5 flex justify-center">
                            <button type="button" onClick={handleShowMore} className="bg-sky-500 p-2 text-black  rounded-lg ">
                                <p className="text-center text-xs font-bold ">Load more</p>
                            </button>
                        </div>
                    }
                </div>
            }
            <FooterComponent />
        </div>
    )
}

export default Search