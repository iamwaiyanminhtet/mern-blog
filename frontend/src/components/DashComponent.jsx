import { Breadcrumb, Card, Table, Avatar, Button } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom"
import { HiHome } from "react-icons/hi"
import { FaUsers } from "react-icons/fa6";
import { FaLongArrowAltUp, FaBloggerB, FaCommentAlt } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashComponent = () => {

  const { user: curUser } = useSelector(state => state.user)
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [blogs, setBlogs] = useState({
    blogs: [],
    totalBlogs: 0,
    thisMonthBlogs: 0
  })
  const [users, setUsers] = useState({
    totalUsers: 0,
    thisMonthUsers: 0
  })
  const [categories, setCategories] = useState({
    totalCategories: 0,
    thisMonthCategories: 0
  })
  const [comments, setComments] = useState({
    totalComments: 0,
    thisMonthComments: 0
  })

  // check if admin or not
  useEffect(() => {
    if (!curUser.isAdmin) {
      navigate('/dashboard?tab=profile')
    }
  }, [curUser.isAdmin])

  useEffect(() => {
    setLoading(true)
    const fetchBlogs = async () => {
      const res = await fetch(`/api/blog/get-blogs?limit=${5}&sorting=desc`)
      const data = await res.json();

      if (data.success === false) {
        setError(data.message)
      }

      if (res.ok) {
        setBlogs({
          blogs: data.blogs,
          totalBlogs: data.totalBlogs,
          thisMonthBlogs: data.lastMonthBlogs
        })
        setError(null)
      }
    }

    const fetchUsers = async () => {
      const res = await fetch(`/api/user/get-users`)
      const data = await res.json();
      if (data.success === false) {
        setError(data.message)
      }

      if (res.ok) {
        setUsers({
          totalUsers: data.totalUsers,
          thisMonthUsers: data.lastMonthUsers
        })
        setError(null)
      }
    }

    const fetchCategories = async () => {
      const res = await fetch(`/api/category/getCategories`)
      const data = await res.json();
      if (data.success === false) {
        setError(data.message)
      }

      if (res.ok) {
        setCategories({
          totalCategories: data.totalCategories,
          thisMonthCategories: data.lastMonthCategories
        })
        setError(null)
      }
    }

    const fetchComments = async () => {
      const res = await fetch(`/api/comment/get-comments`)
      const data = await res.json();
      if (data.success === false) {
        setError(data.message)
      }

      if (res.ok) {
        setComments({
          totalComments: data.totalComments,
          thisMonthComments: data.lastMonthComments
        })
        setError(null)
      }
    }

    setLoading(true)
    fetchUsers()
    fetchCategories()
    fetchBlogs()
    fetchComments()
    setLoading(false)
  }, [])

  return (
    <>
      {
        loading &&
        <p className="text-center my-5">Loading...</p>
      }

      {
        error &&
        <p className="text-center my-5 text-red-500">{error}</p>
      }
      {
        !loading &&
        <div className="sm:ps-3 mt-3 sm:mt-0 w-full overflow-x-auto ">
          <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800 mb-3">
            <Link to='/'>
              <Breadcrumb.Item icon={HiHome} as={'div'} >
                Home
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item as={'div'} >
              <Link to='/dashboard?tab=main'>Dashboard</Link>
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-5">
            <Card className=" w-4/6 sm:max-w-[200px] sm:min-w-[200px]" >
              <div className="flex justify-around">
                <div className="flex items-center" >
                  <FaUsers size={30} color="#5BC0BE" />
                </div>
                <h2 className="text-2xl" >Users</h2>
              </div>
              <p className="text-5xl text-center font-semibold" >
                {users.totalUsers}
              </p>
              <div className="flex justify-center">
                <div className="flex items-center">
                  <FaLongArrowAltUp color="#00ff6b" className="font-bold" />
                  <span className="text-sm text-nowrap">
                    <span className="font-semibold text-[#00ff6b]">{users.thisMonthUsers} {users.thisMonthUsers > 1 ? "users" : "user"}</span> this month
                  </span>
                </div>
              </div>
            </Card>
            <Card className=" w-4/6 sm:max-w-[200px] sm:min-w-[200px]" >
              <div className="flex justify-around">
                <div className="flex items-center" >
                  <BiSolidCategory size={30} color="#F5853F" />
                </div>
                <h2 className="text-2xl" >Categories</h2>
              </div>
              <p className="text-5xl text-center font-semibold" >{categories.totalCategories}</p>
              <div className="flex justify-center">
                <div className="flex items-center">
                  <FaLongArrowAltUp color="#00ff6b" className="font-bold" />
                  <span className="text-sm text-nowrap">
                    <span className="font-semibold text-[#00ff6b]">{categories.thisMonthCategories} {categories.thisMonthCategories > 1 ? "categories" : "cateogry"}</span> this month
                  </span>
                </div>
              </div>
            </Card>
            <Card className=" w-4/6 sm:max-w-[200px] sm:min-w-[200px]" >
              <div className="flex justify-around">
                <div className="flex items-center" >
                  <FaBloggerB size={30} color="#7CEA9C" />
                </div>
                <h2 className="text-2xl" >Blogs</h2>
              </div>
              <p className="text-5xl text-center font-semibold" >
                {
                  blogs.totalBlogs
                }
              </p>
              <div className="flex justify-center">
                <div className="flex items-center">
                  <FaLongArrowAltUp color="#00ff6b" className="font-bold" />
                  <span className="text-sm text-nowrap">
                    <span className="font-semibold text-[#00ff6b]">{blogs.thisMonthBlogs} {blogs.thisMonthBlogs > 1 ? "blogs" : "blog"}</span> this month
                  </span>
                </div>
              </div>
            </Card>
            <Card className=" w-4/6 sm:max-w-[200px] sm:min-w-[200px]" >
              <div className="flex justify-around">
                <div className="flex items-center" >
                  <FaCommentAlt size={30} color="#DB7F67" />
                </div>
                <h2 className="text-2xl" >Comments</h2>
              </div>
              <p className="text-5xl text-center font-semibold" >
                {comments.totalComments}
              </p>
              <div className="flex justify-center">
                <div className="flex items-center">
                  <FaLongArrowAltUp color="#00ff6b" className="font-bold" />
                  <span className="text-sm text-nowrap">
                    <span className="font-semibold text-[#00ff6b]">{comments.thisMonthComments} {comments.thisMonthComments > 1 ? "comments" : "comment"}</span> this month
                  </span>
                </div>
              </div>
            </Card>
          </div >

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <div className="my-5 pr-3 overflow-x-auto scrollbar-thin scrollbar-thumb-sky-700 dark:scrollbar-thumb-sky-400 scrollbar-track-slate-300 dark:scrollbar-track-slate-600">
            <div className="flex items-center justify-evenly">
              <h2 className="text-2xl text-center my-5">Recent Blogs</h2>
              <Link to='/dashboard?tab=blogs'>
                <Button gradientDuoTone="cyanToBlue" outline >See all</Button>
              </Link>
            </div>
            <Table hoverable className="overflow-x-auto " >
              <Table.Head>
                <Table.HeadCell>No</Table.HeadCell>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>By</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {
                  blogs.blogs.map((blog, index) =>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={blog._id} >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>
                        <Avatar img={(props) => (
                          <img
                            alt={blog.title}
                            referrerPolicy="no-referrer"
                            src={blog.image || blog.defaultImage}
                            {...props}
                          />
                        )} size='md' rounded />

                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <Link to={`/blogs/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        {blog.categoryId?.category}
                      </Table.Cell>
                      <Table.Cell>
                        {blog.userId?.username}
                      </Table.Cell>
                    </Table.Row>
                  )
                }
              </Table.Body>
            </Table>
          </div>
        </div >
      }
    </>
  )
}

export default DashComponent