import { useEffect, useState } from "react"
import {  useLocation } from "react-router-dom"

import DashSidebar from "../components/DashSidebar";
import DashComponent from "../components/DashComponent";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashBlogs from "../components/DashBlogs";
import DashCreateBlogPost from "../components/DashCreateBlogPost"
import DashUpdateBlog from "../components/DashUpdateBlog";


const Dashboard = () => {

    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const tabFromUrl = new URLSearchParams(location.search)
        const curTab = tabFromUrl.get('tab')
        setTab(curTab)
    }, [location.search])

    return (
        <div className="min-h-screen flex flex-col sm:flex-row dark:bg-black" >
            <div>
                <DashSidebar />
            </div>

            {tab === "main" && <DashComponent />}
            {tab === "profile" && <DashProfile />}
            {tab === "users" && <DashUsers />}
            {tab === "blogs" && <DashBlogs />}
            {tab === "create-blog" && <DashCreateBlogPost />}
        </div>
    )
}

export default Dashboard