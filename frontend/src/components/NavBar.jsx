import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { FaSun, FaMoon } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import logo from "../assets/w-letter.jpg"
import { toggleDarkTheme } from "../redux/theme/theme.slice.js"

const NavBarComponent = () => {
    const { curTheme } = useSelector(state => state.theme)

    const dispatch = useDispatch();

    return (
        <Navbar fluid rounded className='border-b-2 dark:bg-inherit'>
            <Navbar.Brand>
               <Link className='flex' to='/'>
                    <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                    <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">WYT</span>
               </Link>
            </Navbar.Brand>
            <div className="flex md:order-2 gap-3 sm:gap-8  items-center">
                <div className='hidden sm:flex gap-5'>
                    <Link className='hover:underline text-md' to='/'>Home</Link>
                    <Link className='hover:underline text-md'>Blogs</Link>
                </div>
                <button className='p-3 border-2 border-black dark:border-slate-100 hover:bg-black hover:dark:bg-slate-100 hover:text-slate-100 hover:dark:text-black rounded-full w-10 h-10 flex justify-center items-center' onClick={() => dispatch(toggleDarkTheme())}>
                    {
                        curTheme === "dark" ? <FaSun /> : <FaMoon />
                    }
                </button>

                <Link to='/signin'>
                    <Button gradientDuoTone="greenToBlue" outline className='dark:bg-inherit'> 
                        Sign In
                    </Button>
                </Link>
            
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded status='online' statusPosition='top-right' />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                    </Dropdown.Header>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse className='md:hidden'>
                <Navbar.Link as={'div'} active>
                    <Link className='hover:underline text-md' to='/'>Home</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBarComponent;