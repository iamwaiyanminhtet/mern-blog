import { Button, Toast, Spinner } from "flowbite-react";
import { MdError } from "react-icons/md";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import GoogleLoginButton from "../components/GoogleLoginButton";
import FooterComponent from "../components/Footer";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // get user input data
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // make api call the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return setError("All fields are required!")
    }

    try {
      setLoading(true);
      setError(null);

      // signup user
      const res = await fetch('/api/auth/signup', {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      })
      const data = await res.json();

      // if req failed
      setLoading(false)
      if (data.success === false) {
        return setError(data.message)
      }

      // if sign up successful
      if (res.ok) {
        setError(null)
        navigate('/signin', { state: { signup: true } })
      }
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }

  }

  return (
    <div>
      <section className="bg-gray-50 dark:bg-inherit ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 page-min-height-without-navbar mt-10" >
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-inherit dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Join us today!
              </h1>
              {
                error &&
                <Toast className="min-w-full bg-red-200 dark:bg-red-00">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-800 text-red-200">
                    <MdError className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-semibold text-black">
                    {error}
                  </div>
                  <Toast.Toggle onClick={() => setError(null)} />
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
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                  <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" placeholder="username" onChange={(e) => handleInput(e)} />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" placeholder="name@company.com" onChange={(e) => handleInput(e)} />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" required="" onChange={(e) => handleInput(e)} />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" required="" onChange={(e) => handleInput(e)} />
                </div>
                <div className="flex items-center justify-between">
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <Button type="submit" className={`w-full dark:text-black ${loading ? 'opacity-50' : ''}`} outline gradientDuoTone="greenToBlue">
                  {
                  loading ?
                    <>
                      <Spinner size="sm" /> <span className="ms-2">Sign Up</span>
                    </> :
                    <span>Sign Up</span>
                  }
                </Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" to='/signin'>Sign In</Link>
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

export default Signup;