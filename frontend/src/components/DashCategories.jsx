/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Breadcrumb, Table, Button, TextInput, Toast, Modal, Label } from "flowbite-react"
import { HiHome, HiCheck, HiExclamation, HiOutlineExclamationCircle } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const DashCategories = () => {
    const { user: curUser } = useSelector(state => state.user)
    const navigate = useNavigate();
    const [categories, setCategories] = useState([])
    const [categoryDataLoading, setCategoryDataLoading] = useState(false)
    const [showMore, setShowMore] = useState(true);

    // create states
    const [categoryInput, setCategoryInput] = useState('');
    const [createCategoryError, setCreateCategoryError] = useState(null);
    const [createCategorySuccess, setCreateCategorySuccess] = useState(false);

    // update states
    const [updateFormModal, setUpdateFormModal] = useState(false)
    const [updateCategoryId, setUpdateCategoryId] = useState('')
    const [updateContent, setUpdateContent] = useState('')
    const [updateCategoryError, setUpdateCategoryError] = useState(null);
    const [updateCategorySuccess, setUpdateCategorySuccess] = useState(false);

    // delete states
    const [deleteFormModal, setDeleteFormModal] = useState(false)
    const [deleteCategoryId, setDeleteCategoryId] = useState('')
    const [deleteCategoryError, setDeleteCategoryError] = useState(null);
    const [deleteCategorySuccess, setDeleteCategorySuccess] = useState(false);


    // check if admin or not
    useEffect(() => {
        if (!curUser.isAdmin) {
            navigate('/dashboard?tab=profile')
        }
    }, [curUser.isAdmin])

    // get all categories
    useEffect(() => {
        const fetchBlogs = async () => {
            setCategoryDataLoading(true)
            const res = await fetch(`/api/category/getCategories`)
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories)
                setCategoryDataLoading(false)
                if (data.categories.length < 9) {
                    setShowMore(false)
                }
            }
        }
        if (curUser.isAdmin) {
            fetchBlogs()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createCategory = async () => {

        if(!categoryInput || categoryInput === '') {
            setCreateCategoryError('Category is required')
            return
        }

        const res = await fetch(`/api/category/create-category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: categoryInput })
        })
        const data = await res.json();

        if (data.success === false) {
            setCreateCategoryError(data.message)
            setCreateCategorySuccess(false)
        }

        if (res.ok) {
            setCreateCategorySuccess(true)
            setCreateCategoryError(null)
            setCategories([data, ...categories])
        }
    }

    const handleDelete = async () => {
        const res = await fetch(`/api/category/delete/${deleteCategoryId}`, {
            method: "DELETE"
        })
        const data = await res.json();
        if (data.success === false) {
            setDeleteCategoryError(data.message)
            setDeleteCategorySuccess(false)
        }

        if (res.ok) {
            setDeleteCategorySuccess(true)
            setDeleteCategoryError(null)
            setCategories(categories.filter(c => c._id !== data._id))
            setDeleteFormModal(false)
        }
    }

    const handleUpdate = async () => {
        const res = await fetch(`/api/category/update/${updateCategoryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: updateContent })
        })
        const data = await res.json();

        if (res.ok) {
            setUpdateCategorySuccess(true)
            setUpdateCategoryError(null)
            setCategories(categories.map(category =>
                category._id === data._id ? data : category
            ))
            setUpdateCategoryId(null)
            setUpdateFormModal(false)
        } else {
            setUpdateCategoryError("Error occurs")
            setUpdateCategorySuccess(false)
        }
    }


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
                        <Link to='/dashboard?tab=categories'>Categories</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div>

                    {
                        createCategoryError &&
                        <Toast className="mt-2 min-w-fit">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                <HiExclamation className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal sm:text-nowrap">
                                {createCategoryError}
                            </div>
                            <Toast.Toggle />
                        </Toast>
                    }


                    {createCategorySuccess &&
                        <Toast className="mt-2 mb-2 min-w-fit">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">
                                Category has been created successfully.
                            </div>
                            <Toast.Toggle />
                        </Toast>
                    }

                    {
                        updateCategoryError &&
                        <Toast className="mt-2 min-w-fit">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                <HiExclamation className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal sm:text-nowrap">
                                {updateCategoryError}
                            </div>
                            <Toast.Toggle />
                        </Toast>
                    }


                    {updateCategorySuccess &&
                        <Toast className="mt-2 mb-2 min-w-fit">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">
                                Category has been updated successfully.
                            </div>
                            <Toast.Toggle />
                        </Toast>
                    }

                    {
                        deleteCategoryError &&
                        <Toast className="mt-2 min-w-fit">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                <HiExclamation className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal sm:text-nowrap">
                                {deleteCategoryError}
                            </div>
                            <Toast.Toggle />
                        </Toast>
                    }


                    {deleteCategorySuccess &&
                        <Toast className="mt-2 mb-2 min-w-fit">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">
                                Category has been deleted successfully.
                            </div>
                            <Toast.Toggle />
                        </Toast>
                    }

                </div>

                <div className="flex gap-2 justify-end" >
                    <TextInput placeholder="create a category" onChange={(e) => setCategoryInput(e.target.value)} />
                    <Button onClick={createCategory} >Create</Button>
                </div>

                {/* table data */}
                <div className="overflow-x-auto mt-5 scrollbar-thin scrollbar-thumb-sky-700 dark:scrollbar-thumb-sky-400 scrollbar-track-slate-300 dark:scrollbar-track-slate-600">
                    {/* user data loading */}
                    {
                        categoryDataLoading &&
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
                        !categoryDataLoading &&
                        <>
                            <Table hoverable className="overflow-x-auto" >
                                <Table.Head>
                                    <Table.HeadCell>No</Table.HeadCell>
                                    <Table.HeadCell>Category</Table.HeadCell>
                                    <Table.HeadCell>Edit</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {
                                        categories.map((category, index) =>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={category._id} >
                                                <Table.Cell>{index + 1}</Table.Cell>
                                                <Table.Cell>
                                                    {category.category}
                                                </Table.Cell>
                                                <Table.Cell>

                                                    <span className="text-blue-400 hover:underline hover:cursor-pointer" onClick={() => {
                                                        setUpdateFormModal(true)
                                                        setUpdateCategoryId(category._id)
                                                        setUpdateContent(category.category)
                                                    }}>Edit</span>

                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className="text-red-500"
                                                        onClick={() => {
                                                            setDeleteFormModal(true)
                                                            setDeleteCategoryId(category._id)
                                                            setDeleteCategoryError(null)
                                                            setDeleteCategorySuccess(false)
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </span>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    }
                                </Table.Body>
                            </Table>
                        </>
                    }
                </div>

                <Modal show={updateFormModal} size="md" onClose={() => setUpdateFormModal(false)} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Update Category</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Category" />
                                </div>
                                <TextInput
                                    type="text"
                                    placeholder="update category"
                                    onChange={(e) => setUpdateContent(e.target.value)}
                                    defaultValue={updateContent}
                                />
                            </div>
                            <div className="flex gap-2" >
                                <Button size="sm" onClick={handleUpdate}  >Update</Button>
                                <Button size="sm" color="dark" onClick={() => setUpdateFormModal(false)} >Cancel</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={deleteFormModal} size="md" onClose={() => setDeleteFormModal(false)} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this category?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={() => handleDelete()}>
                                    {"Yes, I'm sure"}
                                </Button>
                                <Button color="gray" onClick={() => setDeleteFormModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>


        </>
    )
}

export default DashCategories