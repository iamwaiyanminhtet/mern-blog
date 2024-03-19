import { Sidebar } from 'flowbite-react';
import { HiChartPie } from 'react-icons/hi';
import { RiLogoutBoxRFill } from "react-icons/ri";
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
            if (res.ok) {
                dispatch(signOutSuccess());
                navigate('/signin')

            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Sidebar aria-label="Sidebar with content separator example" className='w-full min-w-[280px]'>
            <Sidebar.Items >
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to='/dashboard?tab=main'>
                        <Sidebar.Item icon={HiChartPie} as={'div'} active={tab === "main"} >
                            Dashboard
                        </Sidebar.Item>
                    </Link>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item icon={HiChartPie} as={'div'} active={tab === "profile"} >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {
                        user.isAdmin &&
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item icon={HiChartPie} as={'div'} active={tab === "users"} >
                                Users
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
