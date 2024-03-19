/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Table, Badge, Modal, Button, Toast, Label, Select } from "flowbite-react"
import { HiHome, HiOutlineExclamationCircle, HiCheck } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const DashUsers = () => {
    const { user: curUser } = useSelector(state => state.user)
    const navigate = useNavigate();

    // fetch user data state
    const [usersData, setUsersData] = useState([]);
    const [usersDataCopy, setUsersDataCopy] = useState(null);
    const [usersDataLoading, setUsersDataLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [modal, setModal] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [deleteUserSuccess, setDeleteUserSuccess] = useState(false);

    // check if admin or not
    useEffect(() => {
        if (!curUser.isAdmin) {
            navigate('/dashboard?tab=main')
        }
    }, [curUser.isAdmin])

    useEffect(() => {
        const fetchUsers = async () => {
            setUsersDataLoading(true)
            const res = await fetch(`/api/user/get-users`)
            const data = await res.json();
            if (res.ok) {
                setUsersData(data.users)
                setUsersDataCopy(data.users)
                setUsersDataLoading(false)
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }
        }
        if (curUser.isAdmin) {
            fetchUsers()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curUser._id])

    const handleDeleteUser = async () => {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await res.json();
        if (data.success === false) {
            console.log(data.message)
        }
        if (res.ok) {
            const curUsersData = [...usersData].filter(user => user._id !== userIdToDelete)
            setUsersData(curUsersData)
            setUsersDataCopy(curUsersData)
            setUserIdToDelete(null)
            setDeleteUserSuccess(true)
            setModal(false)
        }
    }

    const handleSelectChange = (e) => {
        if(e.target.value === 'all') {
            setUsersData(usersDataCopy)
        }
        if(e.target.value === 'admin') {
            setUsersData([...usersDataCopy].filter(user => user.isAdmin))
        }
        if(e.target.value === 'user') {
            setUsersData([...usersDataCopy].filter(user => user.isAdmin === false))
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
                        <Link to='/dashboard?tab=users'>Users</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 sm:mt-0   ${deleteUserSuccess ? 'justify-between' : 'justify-end'}`} >
                    {
                        deleteUserSuccess &&
                        <Toast className="mt-2 min-w-fit">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">
                                User has been deleted successfully.
                            </div>
                            <Toast.Toggle />
                        </Toast>
                    }

                    <div className="max-w-md">
                        <Select id="countries" onChange={handleSelectChange} >
                            <option value='all' >All</option>
                            <option value='admin' >Admin</option>
                            <option value='user' >User</option>
                        </Select>
                    </div>
                </div>

                {/* table data */}
                <div className="overflow-x-auto mt-5">
                    {/* user data loading */}
                    {
                        usersDataLoading &&
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
                        !usersDataLoading &&
                        <>
                            <Table hoverable className="overflow-auto" >
                                <Table.Head>
                                    <Table.HeadCell>No</Table.HeadCell>
                                    <Table.HeadCell>Profile</Table.HeadCell>
                                    <Table.HeadCell>Username</Table.HeadCell>
                                    <Table.HeadCell>Email</Table.HeadCell>
                                    <Table.HeadCell>Admin</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {
                                        usersData.map((user, index) =>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user._id} >
                                                <Table.Cell>{index + 1}</Table.Cell>
                                                <Table.Cell>
                                                    <Avatar img={(props) => (
                                                        <img
                                                            alt={user.username}
                                                            referrerPolicy="no-referrer"
                                                            src={user.pfp || user.defaultPfp}
                                                            {...props}
                                                        />
                                                    )} size='md' rounded />

                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {user.username}
                                                </Table.Cell>
                                                <Table.Cell>{user.email}</Table.Cell>
                                                <Table.Cell >
                                                    {
                                                        user.isAdmin ?
                                                            <Badge color="success" size='sm'>Admin</Badge> :
                                                            <Badge color="failure" size='sm'>User</Badge>
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        user._id === curUser._id ?
                                                            <></> :
                                                            <span className="text-red-500" onClick={() => {
                                                                setModal(true)
                                                                setUserIdToDelete(user._id)
                                                                setDeleteUserSuccess(false)
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
                            <Modal show={modal} size="md" onClose={() => setModal(false)} popup>
                                <Modal.Header />
                                <Modal.Body>
                                    <div className="text-center">
                                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                            Are you sure you want to delete this account?
                                        </h3>
                                        <div className="flex justify-center gap-4">
                                            <Button color="failure" onClick={() => handleDeleteUser()}>
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

export default DashUsers