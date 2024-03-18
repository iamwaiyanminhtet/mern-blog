import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

const DashboardProtect = () => {
    const {user} = useSelector(state => state.user)
    return user ? <Outlet/> : <Navigate to='signin' />
}

export default DashboardProtect