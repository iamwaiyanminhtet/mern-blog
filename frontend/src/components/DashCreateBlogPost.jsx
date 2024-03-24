/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux"
import { Breadcrumb, Card, FileInput, FloatingLabel, Button, Progress, Toast, Spinner, Select } from 'flowbite-react'
import { HiHome, HiExclamation, HiCheck } from 'react-icons/hi';
import { BiSolidUpArrowSquare } from "react-icons/bi";
import { useEffect, useState } from "react";
import { ref, getStorage, uploadBytesResumable, getDownloadURL, } from "firebase/storage"
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar from "../react-quill/EditorToobar";
import { modules, formats } from "../react-quill/EditorToobar.jsx";


const DashCreateBlogPost = () => {
    const { user: curUser } = useSelector(state => state.user)

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: ''
    });
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
    const [createBlogSuccess, setCreateBlogSuccess] = useState(null);
    const [createBlogError, setCreateBlogError] = useState(null);
    const [createBlogLoading, setCreateBlogLoading] = useState(false);

    // check if admin or not
    useEffect(() => {
        if (!curUser.isAdmin) {
            navigate('/dashboard?tab=main')
        }
    }, [curUser.isAdmin])

    // get all categories
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('/api/category/getCategories')
            const data = await res.json();

            setCategories(data.categories)
        }
        fetchCategories()
    }, [curUser._id])

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
                    setImgFileUrl(downloadUrl);
                    setImageFileUploadError(null);
                    setIsImageUploading(false);
                    setImgFileUploadSuccess(true)

                    try {
                        setFormData({ ...formData, image: downloadUrl })
                    } catch (error) {
                        setImageFileUploadError(error.message)
                    }
                })
            }
        )
    }

    // handle other info submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateBlogLoading(true)
        setCreateBlogError(null)

        if (!formData.title || !formData.content || !formData.categoryId || formData.categoryId === "choose") {
            setCreateBlogError('All Fileds are required.')
            setCreateBlogLoading(false)
            return;
        }
        if (isImageUploading) {
            setCreateBlogError('Please wait for image to be uploaded.')
            setCreateBlogLoading(false)
            return;
        }

        try {
            const res = await fetch(`/api/blog/create-blog`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: curUser._id })
            })

            const data = await res.json();

            console.log(data)
            if (data.success === false) {
                setCreateBlogError(data.message)
                setCreateBlogLoading(false)
                return;
            }

            if (res.ok) {
                setCreateBlogSuccess('New blog has created.')
                setCreateBlogLoading(false)
                setFormData({
                    title: '',
                    content: ''
                })
            } {
                setCreateBlogError(data.message)
                setCreateBlogLoading(false)
            }
        } catch (error) {
            setCreateBlogError(error.message)
            setCreateBlogLoading(false)
        }
    }

    return (
        <div className="sm:ps-3 mt-3 sm:mt-0 w-full">
            <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800">
                <Link to='/'>
                    <Breadcrumb.Item icon={HiHome} as={'div'} >
                        Home
                    </Breadcrumb.Item>
                </Link>
                <Breadcrumb.Item as={'div'} >
                    <Link to='/dashboard?tab=profile'>Profile</Link>
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
                createBlogError &&
                <Toast className="mt-2 min-w-fit">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                        <HiExclamation className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal sm:text-nowrap">
                        {createBlogError}
                    </div>
                    <Toast.Toggle />
                </Toast>
            }

            {
                createBlogSuccess &&
                <Toast className="mt-2 min-w-fit">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">
                        {createBlogSuccess}
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
                            <h1 className="text-2xl font-semibold">Create New Blog</h1>
                            <div className="mt-5 flex flex-col gap-5 ">
                                {
                                    isImageUploading &&
                                    <Progress progress={imageFileUploadProgress} textLabel="Uploading..." size="lg" labelProgress labelText color="green" />
                                }
                                <div className="w-[200px]" >
                                    <img src={imgFileUrl} alt="" />
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-center" >
                                    <div className="w-2/3" >
                                        <FileInput id="image" onChange={handleImgChange} />
                                    </div>
                                    <Button gradientDuoTone="greenToBlue" className="mt-3 text-black" onClick={handleImgUpdate} size='sm' >
                                        <BiSolidUpArrowSquare /> <span className="ms-2">Create Image</span>
                                    </Button>
                                </div>
                                <FloatingLabel variant="outlined" label="title" id="title" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} value={formData.title} />

                                <Select id="categoryId" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} required value={formData.categoryId} >
                                    <option value="choose" >Choose a category to select</option>
                                    {
                                        categories.map(category =>
                                            <option key={category._id} value={category._id} >
                                                {category.category}
                                            </option>
                                        )
                                    }
                                </Select>

                                <div className="text-editor" >
                                    <EditorToolbar />
                                    <ReactQuill theme="snow" onChange={(value) => setFormData({ ...formData, content: value })} className="h-72 mb-12" id="content" value={formData.content} modules={modules}
                                        formats={formats} />
                                </div>


                                <Button gradientDuoTone="greenToBlue" className="text-black" type="submit" >
                                    {
                                        createBlogLoading ?
                                            <>
                                                <Spinner size="sm" /> <span className="ms-2">Create</span>
                                            </> :
                                            <>
                                                <BiSolidUpArrowSquare />
                                                <span className="ms-2" >Create</span>
                                            </>
                                    }
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>

        </div>


    )
}

export default DashCreateBlogPost