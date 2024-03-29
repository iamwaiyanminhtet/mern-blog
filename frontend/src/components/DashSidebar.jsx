import { Sidebar } from 'flowbite-react';
import { HiChartPie } from 'react-icons/hi';
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaBloggerB, FaCommentAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOutSuccess } from "../redux/user/user.slice.js"
import { useEffect, useState } from 'react';

const DashSidebar = () => {
    const { user } = useSelector(state => state.user);
    const [tab, setTab] = useState('');

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const tabFromUrl = new URLSearchParams(location.search)
        const curTab = tabFromUrl.get('tab')
        setTab(curTab)
    }, [location.search])

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/auth/signout', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user._id })
            })

            const data = await res.json();
            if(data.success === false) {
                console.log(data.message) 
            }
            if (res.ok) {
                dispatch(signOutSuccess());
                navigate('/signin')

            } 
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Sidebar aria-label="Sidebar with content separator example" className='w-full min-w-[280px]'>
            <Sidebar.Items >
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {
                        user.isAdmin &&
                        <Link to='/dashboard?tab=main'>
                            <Sidebar.Item icon={HiChartPie} as={'div'} active={tab === "main"} >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    }
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item icon={CgProfile} as={'div'} active={tab === "profile"} >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {
                        user.isAdmin &&
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item icon={FaUsers} as={'div'} active={tab === "users"} >
                                Users
                            </Sidebar.Item>
                        </Link>
                    }
                    {
                        user.isAdmin &&
                        <Link to='/dashboard?tab=categories'>
                            <Sidebar.Item icon={BiSolidCategory} as={'div'} active={tab === "categories"} >
                                Categories
                            </Sidebar.Item>
                        </Link>
                    }
                    {
                        user.isAdmin &&
                        <Link to='/dashboard?tab=blogs'>
                            <Sidebar.Item icon={FaBloggerB} as={'div'} active={tab === "blogs"} >
                                Blogs
                            </Sidebar.Item>
                        </Link>
                    }
                    {
                        user.isAdmin &&
                        <Link to='/dashboard?tab=comments'>
                            <Sidebar.Item icon={FaCommentAlt} as={'div'} active={tab === "comments"} >
                                Comments
                            </Sidebar.Item>
                        </Link>
                    }
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={RiLogoutBoxRFill} as={'div'} onClick={() => handleSignout()} >
                        Signout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default DashSidebar;
