import { Button, Toast, Spinner } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/user.slice.js"
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";
import FooterComponent from "../components/Footer.jsx";

const Signin = () => {
  // if the user come from signup page?
  const { state } = useLocation();
  let signup = false;
  if (state) {
    signup = state.signup
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get redux user data
  const { user, loading, error } = useSelector(state => state.user)

  const [formData, setFormData] = useState({});

  // handle input data
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // handle sign in
  const handleSubmit = async (e) => {
    e.preventDefault();

    // all fields are required
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('All fileds are required!'))
    }

    try {
      dispatch(signInStart())

      // signup user
      const res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        })
      })
      const data = await res.json();

      // if sign in failed
      if (data.success === false) {
        return dispatch(signInFailure(data.message))
      }

      // sign in successful
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div>
      <section className="bg-gray-50 dark:bg-inherit ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 page-min-height-without-navbar" >
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-inherit dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              {
                signup &&
                <Toast className="min-w-full bg-green-200 dark:bg-green-00">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-800 text-green-200">
                    <MdError className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-semibold text-black">
                    Signed up successfully. Please Sign In!
                  </div>
                  <Toast.Toggle />
                </Toast>
              }
              {
                error &&
                <Toast className="min-w-full bg-red-200 dark:bg-red-00">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-800 text-red-200">
                    <MdError className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-semibold text-black">
                    {error}
                  </div>
                  <Toast.Toggle />
                </Toast>
              }
             <GoogleLoginButton/>
              <div className="flex items-center w-full my-4">
                <hr className="w-full dark:text-gray-400" />
                <p className="px-3 dark:text-gray-400 text-sm">OR</p>
                <hr className="w-full dark:text-gray-400" />
              </div>
              <form className="space-y-4 md:space-y-6" onSubmit={(e) => handleSubmit(e)} >
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" placeholder="name@company.com" required onChange={(e) => handleInput(e)} />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" required onChange={(e) => handleInput(e)} />
                </div>
                <div className="flex items-center justify-between">

                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <Button type="submit" className={`w-full dark:text-black ${loading ? 'opacity-50' : ''}`} gradientDuoTone="greenToBlue">
                  {
                    loading ?
                      <>
                        <Spinner size="sm" /> <span className="ms-2">Sign In</span>
                      </> :
                      <span>Sign In</span>
                  }
                </Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don&apos;t have an account yet? <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" to='/signup'>Sign Up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <FooterComponent/>
    </div>
  )
}

export default Signin;