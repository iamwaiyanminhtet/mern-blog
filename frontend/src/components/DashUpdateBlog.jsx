/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux"
import { Breadcrumb, Card, FileInput, FloatingLabel, Button, Progress, Toast, Spinner, Select } from 'flowbite-react'
import { HiHome, HiExclamation, HiCheck } from 'react-icons/hi';
import { BiSolidUpArrowSquare } from "react-icons/bi";
import { useEffect, useState } from "react";
import { ref, getStorage, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DashSidebar from "./DashSidebar";

const DashUpdateBlog = () => {
    const { user: curUser } = useSelector(state => state.user)
    const { blogId } = useParams();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const [categories, setCategories] = useState([])

    // upload file input locally
    const [imgFile, setImgFile] = useState();
    const [imgFileUrl, setImgFileUrl] = useState();

    // image file uploading state to the firebase
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [imgFileUploadSuccess, setImgFileUploadSuccess] = useState(false)

    // update user data
    const [updateBlogSuccess, setUpdateBlogSuccess] = useState(false);
    const [updateBlogError, setUpdateBlogError] = useState(null);
    const [updateBlogLoading, setUpdateBlogLoading] = useState(false);

    // check if admin or not
    useEffect(() => {
        if (!curUser.isAdmin) {
            navigate('/dashboard?tab=main')
        }
    }, [curUser.isAdmin])

    // get all categories
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('/api/blog/getCategories')
            const data = await res.json();

            setCategories(data)
        }
        fetchCategories()
    }, [curUser._id])

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`/api/blog/get-blogs?blogId=${blogId}`)
            const data = await res.json();

            setFormData({
                content: data.blogs[0].content,
                title: data.blogs[0].title,
                image: data.blogs[0].image
            })
        }
        fetchPost();
    }, [blogId])

    // handle file input change locally
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file)
            setImgFileUrl(URL.createObjectURL(file))
        }
    }

    // update img to fire base
    const handleImgUpdate = () => {
        uploadImgToFirebase();
    }


    // upload img to firebase
    const uploadImgToFirebase = () => {
        const storage = getStorage();
        const imgFileName = new Date().getTime() + imgFile.name;
        const storageRef = ref(storage, imgFileName);

        const uploadTask = uploadBytesResumable(storageRef, imgFile);

        setIsImageUploading(true)
        setImageFileUploadError(null)
        setImageFileUploadProgress(0)
        setImgFileUploadSuccess(false)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // set upload img file progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0))
            },
            // fail state
            () => {
                // to show error in ui
                setImageFileUploadError("File must be image types and less than 2 MB.")

                // reset file input local states
                setImgFile(null)
                setImgFileUrl(null)

                // upload progress state
                setImageFileUploadProgress(null)
                setIsImageUploading(false)
            },
            // success state
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                    try {
                        if (formData.image.includes('firebasestorage.googleapis.com')) {
                            deleteImgFromFirebase(formData.image)
                        }
                        updateBlogFetch({ image: downloadUrl })
                    } catch (error) {
                        setImageFileUploadError(error.message)
                    }
                    setImgFileUrl(downloadUrl);
                    setImageFileUploadError(null);
                    setIsImageUploading(false);
                    setImgFileUploadSuccess(true)
                })
            }
        )
    }

    // handle other info submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateBlogLoading(true)
        setUpdateBlogError(null)
        setImgFileUploadSuccess(false)

        if (isImageUploading) {
            setUpdateBlogError('Please wait for image to be uploaded.')
            setUpdateBlogLoading(false)
            return;
        }

        try {
            updateBlogFetch({
                title : formData.title,
                content : formData.content,
                categoryId : formData.categoryId
            })
        } catch (error) {
            setUpdateBlogError(error.message)
            setUpdateBlogLoading(false)
        }
    }

    // delete img from firebase
    const deleteImgFromFirebase = (imageUrl) => {
        const storage = getStorage();

        // Create a reference to the file to delete
        const desertRef = ref(storage, imageUrl);

        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log('file deleted')
        }).catch((error) => {
            console.log(error)
        });
    }

    const updateBlogFetch = async (updateData) => {

        setUpdateBlogSuccess(false)

        const res = await fetch(`/api/blog/update/${blogId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        })

        const data = await res.json();

        console.log(data)
        if (data.success === false) {
            setUpdateBlogError(data.message)
            setUpdateBlogLoading(false)
            return;
        }

        if (res.ok) {
            setUpdateBlogSuccess(true)
            setUpdateBlogLoading(false)
        } {
            setUpdateBlogError(data.message)
            setUpdateBlogLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col sm:flex-row dark:bg-black" >
            <div>
                <DashSidebar />
            </div>
            <div className="sm:ps-3 mt-3 sm:mt-0 w-full">
                <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800">
                    <Link to='/'>
                        <Breadcrumb.Item icon={HiHome} as={'div'} >
                            Home
                        </Breadcrumb.Item>
                    </Link>
                    <Breadcrumb.Item as={'div'} >
                        <Link to='/dashboard?tab=blogs'>Blog</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>

                {
                    imageFileUploadError &&
                    <Toast className="mt-2 min-w-fit">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                            <HiExclamation className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal sm:text-nowrap">
                            {imageFileUploadError}
                        </div>
                        <Toast.Toggle />
                    </Toast>
                }

                {
                    updateBlogError &&
                    <Toast className="mt-2 min-w-fit">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                            <HiExclamation className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal sm:text-nowrap">
                            {updateBlogError}
                        </div>
                        <Toast.Toggle />
                    </Toast>
                }

                {
                    updateBlogSuccess &&
                    <Toast className="mt-2 min-w-fit">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">
                            Blog has been updated.
                            <Link className="ms-1 font-semibold underline" to="/dashboard?tab=blogs">See Blog list</Link>
                        </div>
                        <Toast.Toggle />
                    </Toast>
                }

                {
                    imgFileUploadSuccess &&
                    <Toast className="mt-2 min-w-fit">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">
                            Blog image is uploaded.
                        </div>
                        <Toast.Toggle />
                    </Toast>
                }

                <div className="flex flex-col lg:flex-row gap-3 mt-3">
                    {/* create blog section */}
                    <div className="w-full">
                        <Card>
                            <form onSubmit={handleSubmit}>
                                <h1 className="text-2xl font-semibold">Update  Blog</h1>
                                <div className="mt-5 flex flex-col gap-5 ">
                                    {
                                        isImageUploading &&
                                        <Progress progress={imageFileUploadProgress} textLabel="Uploading..." size="lg" labelProgress labelText color="green" />
                                    }
                                    <div className="w-[200px] mx-auto" >
                                        <img src={imgFileUrl || formData.image} alt="" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center" >
                                        <div className="w-2/3" >
                                            <FileInput id="image" onChange={handleImgChange} />
                                        </div>
                                        <Button gradientDuoTone="greenToBlue" className="mt-3 text-black" onClick={handleImgUpdate} size='sm' >
                                            <BiSolidUpArrowSquare /> <span className="ms-2">Create Image</span>
                                        </Button>
                                    </div>
                                    <FloatingLabel variant="outlined" label="title" id="title" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} value={formData.title || ''} />

                                    <ReactQuill theme="snow" onChange={(value) => setFormData({ ...formData, content: value })} className="h-72 mb-12" id="content" value={formData.content || ''} />

                                    <Select id="categoryId" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} required  >
                                        <option value="choose" >Choose a category to select</option>
                                        {
                                            categories.map(category =>
                                                <option key={category._id} value={category._id} >
                                                    {category.category}
                                                </option>
                                            )
                                        }
                                    </Select>
                                    <Button gradientDuoTone="greenToBlue" className="text-black" type="submit" >
                                        {
                                            updateBlogLoading ?
                                                <>
                                                    <Spinner size="sm" /> <span className="ms-2">Update</span>
                                                </> :
                                                <>
                                                    <BiSolidUpArrowSquare />
                                                    <span className="ms-2" >Update</span>
                                                </>
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashUpdateBlog