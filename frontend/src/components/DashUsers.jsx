/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Table, Badge } from "flowbite-react"
import { HiHome } from "react-icons/hi";

const DashUsers = () => {
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate();

    // fetch user data state
    const [usersData, setUsersData] = useState([]);
    const [usersDataLoading, setUsersDataLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);

    // check if admin or not
    useEffect(() => {
        if (!user.isAdmin) {
            navigate('/dashboard?tab=main')
        }
    }, [user.isAdmin])

    useEffect(() => {
        const fetchUsers = async () => {
            setUsersDataLoading(true)
            const res = await fetch(`/api/user/get-users`)
            const data = await res.json();
            if (res.ok) {
                setUsersData(data.users)
                setUsersDataLoading(false)
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }
        }
        if (user.isAdmin) {
            fetchUsers()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id])

    console.log(usersData)

    return (
        <>
            <div className="sm:ps-3 mt-3 sm:mt-0 w-full">
                <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800">
                    <Link to='/'>
                        <Breadcrumb.Item icon={HiHome} as={'div'} >
                            Home
                        </Breadcrumb.Item>
                    </Link>
                    <Breadcrumb.Item as={'div'} >
                        <Link to='/dashboard?tab=users'>Users</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>

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
                        <Table hoverable>
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
                                                    <Badge color="success" size='sm'>Admin</Badge>  :
                                                    <Badge color="failure" size='sm'>User</Badge>
                                                }
                                            </Table.Cell>
                                            <Table.Cell>
                                                <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                                    Edit
                                                </a>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                    }
                </div>
            </div>


        </>
    )
}

export default DashUsers