import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

const DashboardAdminProtected = () => {
    const {user} = useSelector(state => state.user)
    return user.isAdmin ? <Outlet/> : <Navigate to='signin' />
}

export default DashboardAdminProtected