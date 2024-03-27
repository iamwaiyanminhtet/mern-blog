/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Table, Modal, Button, Toast, Select } from "flowbite-react"
import { getStorage, ref, deleteObject } from "firebase/storage"
import { HiHome, HiOutlineExclamationCircle, HiCheck } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const DashBlogs = () => {
  const { user: curUser } = useSelector(state => state.user)
  const navigate = useNavigate();
  const [categories, setCategories] = useState([])

  // fetch user data state
  const [blogsData, setBlogsData] = useState([]);
  const [blogsDataCopy, setBlogsDataCopy] = useState(null);
  const [blogsDataLoading, setBlogsDataLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [modal, setModal] = useState(false)
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);
  const [blogImgToDelete, setBlogImgToDelete] = useState(null);
  const [deleteBlogSuccess, setDeleteBlogSuccess] = useState(false);

  // check if admin or not
  useEffect(() => {
    if (!curUser.isAdmin) {
      navigate('/dashboard?tab=profile')
    }
  }, [curUser.isAdmin])

  // get all categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/category/getCategories')
      const data = await res.json();

      setCategories(data.categories)
    }
    fetchCategories()
  }, [curUser._id])

  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogsDataLoading(true)
      const res = await fetch(`/api/blog/get-blogs`)
      const data = await res.json();
      if (res.ok) {
        setBlogsData(data.blogs)
        setBlogsDataCopy(data.blogs)
        setBlogsDataLoading(false)
        if (data.blogs.length < 5 || data.blogs.length === data.totalBlogs) {
          setShowMore(false)
        }
      }
    }
    if (curUser.isAdmin) {
      fetchBlogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curUser._id])

  const handleDeleteBlog = async () => {

    if (blogImgToDelete !== undefined && blogImgToDelete.includes('firebasestorage.googleapis.com')) {
      deleteImgFromFirebase(blogImgToDelete)
    }

    const res = await fetch(`/api/blog/delete/${blogIdToDelete}`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await res.json();
    if (data.success === false) {
      console.log(data.message)
    }
    if (res.ok) {
      const curBlogsData = [...blogsData].filter(blog => blog._id !== blogIdToDelete)
      setBlogsData(curBlogsData)
      setBlogsDataCopy(curBlogsData)
      setBlogIdToDelete(null)
      setDeleteBlogSuccess(true)
      setModal(false)
    }
  }

  const handleSelectChange = (e) => {
    if (e.target.value === "all") {
      setBlogsData(blogsDataCopy);
      return;
    } else {
      setBlogsData([...blogsDataCopy].filter(blog => blog.categoryId._id === e.target.value))
    }
  }

  const handleShowMore = async () => {
    const startIndex = blogsData.length
    const res = await fetch(`/api/blog/get-blogs?startIndex=${startIndex}`)
    const data = await res.json();

    if (res.ok) {
      setBlogsData([...blogsData, ...data.blogs])
      setBlogsDataCopy([...blogsData, ...data.blogs])
      if (data.blogs.length < 5) {
        setShowMore(false)
      }
    }
  }

  // delete img from firebase
  const deleteImgFromFirebase = (imageUrl) => {
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, imageUrl);

    // Delete the file
    deleteObject(desertRef).then(() => {
      console.log('img deleted')
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <>
      <div className="sm:ps-3 mt-3 sm:mt-0 w-full overflow-x-auto ">
        <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800 mb-3">
          <Link to='/'>
            <Breadcrumb.Item icon={HiHome} as={'div'} >
              Home
            </Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item as={'div'} >
            <Link to='/dashboard?tab=blogs'>Blogs</Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 sm:mt-0   ${deleteBlogSuccess ? 'justify-between' : 'justify-end'}`} >

          {
            deleteBlogSuccess &&
            <Toast className="mt-2 min-w-fit">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                Blog has been deleted successfully.
              </div>
              <Toast.Toggle />
            </Toast>
          }

          <div className="flex flex-col sm:flex-row gap-2" >
            <Link to='/dashboard?tab=create-blog'>
              <Button className="" color="info" >
                Create
              </Button>
            </Link>

            {
              !blogsDataLoading &&
              <div className="max-w-md">
                <Select id="categoryId" onChange={handleSelectChange} >
                  <option value="all">All</option>
                  {
                    categories.map(category =>
                      <option key={category._id} defaultValue={category._id} value={category._id} >{category.category}</option>
                    )
                  }
                </Select>
              </div>
            }
          </div>
        </div>

        {/* table data */}
        <div className="overflow-x-auto mt-5  scrollbar-thin scrollbar-thumb-sky-700 dark:scrollbar-thumb-sky-400 scrollbar-track-slate-300 dark:scrollbar-track-slate-600">
          {/* user data loading */}
          {
            blogsDataLoading &&
            <>
              <div role="status" className="max-w-full animate-pulse p-5">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <span className="sr-only">Loading...</span>
              </div>
              <div role="status" className="max-w-full animate-pulse p-5">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <span className="sr-only">Loading...</span>
              </div>
              <div role="status" className="max-w-full animate-pulse p-5">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <span className="sr-only">Loading...</span>
              </div>
              <div role="status" className="max-w-full animate-pulse p-5">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <span className="sr-only">Loading...</span>
              </div>
              <div role="status" className="max-w-full animate-pulse p-5">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <span className="sr-only">Loading...</span>
              </div>


            </>
          }

          {/* actual data */}
          {
            !blogsDataLoading &&
            <>
              <Table hoverable className="overflow-x-auto   " >
                <Table.Head>
                  <Table.HeadCell>No</Table.HeadCell>
                  <Table.HeadCell>Image</Table.HeadCell>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>By</Table.HeadCell>
                  <Table.HeadCell>Views</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Edit</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {
                    blogsData.map((blog, index) =>
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
                          )} size='lg' className="min-w-[150px] max-w-full" />

                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                          <Link to={`/blogs/${blog.slug}`} className="hover:underline">
                            {blog.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {blog.categoryId?.category}
                        </Table.Cell>
                        <Table.Cell>
                          {blog.userId?.username}
                        </Table.Cell>
                        <Table.Cell>
                          {blog.viewCount}
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/update-blog/${blog._id}`} >
                            <span className="text-blue-400 hover:underline hover:cursor-pointer">Edit</span>
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {
                            blog._id === curUser._id ?
                              <></> :
                              <span className="text-red-500" onClick={() => {
                                setModal(true)
                                setBlogIdToDelete(blog._id)
                                setBlogImgToDelete(blog.image)
                                setDeleteBlogSuccess(false)
                              }} >
                                <FaTrash />
                              </span>
                          }
                        </Table.Cell>
                      </Table.Row>
                    )
                  }
                </Table.Body>
              </Table>
              {
                showMore &&
                <p className="text-blue-500 mt-3 text-center hover:text-blue-400 cursor-pointer" onClick={() => handleShowMore()} >Show more</p>
              }
              <Modal show={modal} size="md" onClose={() => setModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                  <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this blog?
                    </h3>
                    <div className="flex justify-center gap-4">
                      <Button color="failure" onClick={() => handleDeleteBlog()}>
                        {"Yes, I'm sure"}
                      </Button>
                      <Button color="gray" onClick={() => setModal(false)}>
                        No, cancel
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </>

          }
        </div>
      </div>
    </>
  )
}

export default DashBlogs