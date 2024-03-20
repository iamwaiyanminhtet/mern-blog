import { useSelector, useDispatch } from "react-redux"
import { Avatar, Breadcrumb, Card, FileInput, Label, FloatingLabel, Button, Progress, Toast, Spinner, Modal } from 'flowbite-react'
import { HiHome, HiExclamation, HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi';
import { BiSolidUpArrowSquare } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { ref, getStorage, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { Link, useNavigate } from "react-router-dom";
import { updateSuccess, signOutSuccess } from "../redux/user/user.slice.js";


const DashProfile = () => {
  const { user } = useSelector(state => state.user)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [modal, setModal] = useState(false);

  // upload file input locally
  const [imgFile, setImgFile] = useState();
  const [imgFileUrl, setImgFileUrl] = useState();

  // image file uploading state to the firebase
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // update user data
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);

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

  // upload img to firebase
  const uploadImgToFirebase = () => {
    const storage = getStorage();
    const imgFileName = new Date().getTime() + imgFile.name;
    const storageRef = ref(storage, imgFileName);

    const uploadTask = uploadBytesResumable(storageRef, imgFile);

    setIsImageUploading(true)
    setImageFileUploadError(null)
    setImageFileUploadProgress(0)
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
          try {
            if (user.pfp.includes('firebasestorage.googleapis.com')) {
              deleteImgFromFirebase(user.pfp)
            }
            updateUserFetch({ pfp: downloadUrl })
          } catch (error) {
            setImageFileUploadError(error.message)
          }
        })
      }
    )
  }

  // handle other info submit 
  const handleSubmit = (e) => {
    e.preventDefault();

    setUpdateUserLoading(true)
    setUpdateUserError(null)

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes has made')
      setUpdateUserLoading(false)
      return;
    }
    if (isImageUploading) {
      setUpdateUserError('Please wait for image to be uploaded.')
      setUpdateUserLoading(false)
      return;
    }

    try {
      updateUserFetch(formData);
    } catch (error) {
      setUpdateUserError(error.message)
      setUpdateUserLoading(false)
    }
  }

  const updateUserFetch = async function (updateData) {
    const res = await fetch(`/api/user/update/${user._id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })

    const data = await res.json();

    if (data?.message?.includes('index: username_1 dup key') || data?.message?.includes('index: email_1 dup key')) {
      setUpdateUserError('Account with this credentials already exists');
      setUpdateUserLoading(false);
      return;
    }

    if (data.success === false) {
      setUpdateUserError(data.message)
      setUpdateUserLoading(false)
      return;
    }

    if (res.ok) {
      dispatch(updateSuccess(data));
      setUpdateUserSuccess('Your Information has been updated.')
      setUpdateUserLoading(false)
    } {
      setUpdateUserError(data.message)
      setUpdateUserLoading(false)
    }
  }

  const handleDelete = async () => {
    // delete firebase image first
    if (user.pfp.includes('firebasestorage.googleapis.com')) {
      deleteImgFromFirebase(user.pfp)
    }

    const res = await fetch(`/api/user/delete/${user._id}`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await res.json();
    if(data.success === false) {
      console.log(data.message)
    }
    if(res.ok) {
      dispatch(signOutSuccess())
      navigate('/signin')
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
        updateUserError &&
        <Toast className="mt-2 min-w-fit">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
            <HiExclamation className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal sm:text-nowrap">
            {updateUserError}
          </div>
          <Toast.Toggle />
        </Toast>
      }

      {
        updateUserSuccess &&
        <Toast className="mt-2 min-w-fit">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Information has been updated successfully.
          </div>
          <Toast.Toggle />
        </Toast>
      }

      <div className="flex flex-col lg:flex-row gap-3 mt-3">
        {/* img update section */}
        <Card className="min-w-full sm:min-w-[400px]">
          {
            isImageUploading &&
            <Progress progress={imageFileUploadProgress} textLabel="Uploading..." size="lg" labelProgress labelText color="green" />
          }
          <Avatar img={imgFileUrl || user.pfp || user.defaultPfp} size='xl'></Avatar>
          <div>
            <div className="mb-3">
              <Label htmlFor="profile-update" value="Upload Profile Image" />
            </div>
            <FileInput id="profile-update" helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)." onChange={handleImgChange} />
            <Button gradientDuoTone="greenToBlue" className="mt-3 text-black" onClick={handleImgUpdate}>
              <BiSolidUpArrowSquare /> <span className="ms-2">Update Image</span>
            </Button>
          </div>
        </Card>

        {/* other user data update section */}
        <div className="w-full">
          <Card>
            <form onSubmit={handleSubmit}>
              <h1 className="text-2xl font-semibold">Update Your Info</h1>
              <div className="mt-5 flex flex-col gap-5">
                <FloatingLabel variant="outlined" label="username" id="username" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} defaultValue={user.username} />
                <FloatingLabel variant="outlined" label="email" id="email" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} defaultValue={user.email} />
                <FloatingLabel variant="outlined" label="password" id="password" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} type="password" />
                <Button gradientDuoTone="greenToBlue" className="text-black" type="submit" >
                  {
                    updateUserLoading ?
                      <>
                        <Spinner size="sm" /> <span className="ms-2">Update</span>
                      </> :
                      <>
                      <BiSolidUpArrowSquare/>
                      <span className="ms-2" >Update</span>
                      </>
                  }
                </Button>
                <Button color="red" onClick={() => setModal(true)} >
                  <MdDelete/> <span className="ms-2">Delete Account</span>
                </Button>
              </div>
            </form>
          </Card>

          <Modal show={modal} size="md" onClose={() => setModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this account?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={() => handleDelete()}>
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => setModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>

    </div>
  )
}

export default DashProfile