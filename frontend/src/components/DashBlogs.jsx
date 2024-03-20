/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Table, Badge, Modal, Button, Toast, Select } from "flowbite-react"
import { HiHome, HiOutlinePlusCircle, HiOutlineExclamationCircle, HiCheck } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const DashBlogs = () => {
  const { user: curUser } = useSelector(state => state.user)
  const navigate = useNavigate();

  // check if admin or not
  useEffect(() => {
    if (!curUser.isAdmin) {
      navigate('/dashboard?tab=main')
    }
  }, [curUser.isAdmin])

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
            <Link to='/dashboard?tab=blogs'>Blogs</Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 sm:mt-0  justify-end `} >
          <Link to='/dashboard?tab=create-blog' >
            <Button size='sm' className="py-1" >
              <HiOutlinePlusCircle /> <span className="ms-1" >Create</span>
            </Button>
          </Link>
        </div>

      </div>
    </>
  )
}

export default DashBlogs