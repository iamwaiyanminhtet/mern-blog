/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Breadcrumb, Table, Modal, Button, Toast, TextInput } from "flowbite-react"
import { HiHome, HiOutlineExclamationCircle, HiCheck } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const DashComments = () => {
  const { user: curUser } = useSelector(state => state.user)
  const navigate = useNavigate();

  // fetch comment data state
  const [commentsData, setCommentsData] = useState([]);
  const [comentsDataLoading, setCommentsDataLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [modal, setModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [isDeleteCommentReply, setIsDeleteCommentReply] = useState(null)
  const [deleteCommentSuccess, setDeleteCommentSuccess] = useState(false);

  const [searchTerm, setSearchTerm] = useState('')

  // check if admin or not
  useEffect(() => {
    if (!curUser.isAdmin) {
      navigate('/dashboard?tab=main')
    }
  }, [curUser.isAdmin])

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsDataLoading(true)
      const res = await fetch(`/api/comment/get-comments`)
      const data = await res.json();
      if (res.ok) {
        setCommentsData(data.comments)
        setCommentsDataLoading(false)
        if (data.comments.length < 5) {
          setShowMore(false)
        }
      }
    }
    if (curUser.isAdmin) {
      fetchComments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curUser._id])

  const handleDeleteComment = async () => {
    const res = await fetch(`/api/comment/delete/${commentIdToDelete}/${curUser._id}/${isDeleteCommentReply}`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await res.json();
    if (data.success === false) {
      console.log(data.message)
    }
    if (res.ok) {
      setDeleteCommentSuccess(true)
      setCommentsData(commentsData.filter(c => c._id !== commentIdToDelete))
      setCommentIdToDelete(null)
      setIsDeleteCommentReply(null)
      setModal(false)
    }
  }


  const handleShowMore = async () => {
    const startIndex = commentsData.length
    const res = await fetch(`/api/comment/get-comments?startIndex=${startIndex}`)
    const data = await res.json();

    if (res.ok) {
      setCommentsData([...commentsData, ...data.comments])
      if (data.comments.length < 5) {
        setShowMore(false)
      }
    }
  }

  const handleSearch = async () => {
    const startIndex = commentsData.length
    const res = await fetch(`/api/comment/get-comments?startIndex=${startIndex}&searchTerm=${searchTerm.trim()}&limit=${20}`)
    const data = await res.json();

    if (res.ok) {
      setCommentsData(data.comments)
    }
  }

  console.log(commentsData)

  return (
    <>
      <div className="sm:ps-3 mt-3 sm:mt-0 w-full overflow-x-auto">
        <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800 mb-3">
          <Link to='/'>
            <Breadcrumb.Item icon={HiHome} as={'div'} >
              Home
            </Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item as={'div'} >
            <Link to='/dashboard?tab=comments'>Comments</Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 sm:mt-0 ${deleteCommentSuccess ? "justify-between" : "justify-end"}`} >

          {
            deleteCommentSuccess &&
            <Toast className="mt-2 min-w-fit">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                Comment has been deleted successfully.
              </div>
              <Toast.Toggle />
            </Toast>
          }

          <div className="flex gap-2 justify-end" >
            <TextInput placeholder="search" onChange={(e) => setSearchTerm(e.target.value)} />
            <Button onClick={handleSearch} >Search</Button>
          </div>
        </div>

        {/* table data */}
        <div className="overflow-x-auto mt-5">
          {/* user data loading */}
          {
            comentsDataLoading &&
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
            !comentsDataLoading &&
            <>
              <Table hoverable className="overflow-auto" >
                <Table.Head>
                  <Table.HeadCell>No</Table.HeadCell>
                  <Table.HeadCell>Comment</Table.HeadCell>
                  <Table.HeadCell>By</Table.HeadCell>
                  <Table.HeadCell>Blog</Table.HeadCell>
                  <Table.HeadCell>isReply</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Delete</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {
                    commentsData.map((comment, index) =>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={comment._id} >
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell className="max-w-[50px] font-medium text-gray-900 dark:text-white">
                          <p className="line-clamp-1 break-all" >{comment.comment}</p>
                        </Table.Cell>
                        <Table.Cell>
                          {comment.userId?.username}
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/blogs/${comment.blogId?.slug}`} className="underline hover:opacity-90 truncate ..." >
                            {comment.blogId?.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {comment.isReply.toString()}
                        </Table.Cell>
                        <Table.Cell>
                          in blog
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-red-500" onClick={() => {
                            setModal(true)
                            setCommentIdToDelete(comment._id)
                            setDeleteCommentSuccess(false)
                            setIsDeleteCommentReply(comment.isReply.toString())
                          }} >
                            <FaTrash />
                          </span>
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
                      Are you sure you want to delete this comment?
                    </h3>
                    <div className="flex justify-center gap-4">
                      <Button color="failure" onClick={() => handleDeleteComment()}>
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

export default DashComments