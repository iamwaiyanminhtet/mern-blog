import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div>
      <section className="bg-gray-50 dark:bg-inherit ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 page-min-height-without-navbar mt-10" >
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-inherit dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Join us today!
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                  <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" placeholder="username" />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" placeholder="name@company.com" />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" required="" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-inherit dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-400 dark:focus:border-cyan-400" required="" />
                </div>
                <div className="flex items-center justify-between">
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <Button className="w-full dark:text-black" outline gradientDuoTone="greenToBlue">Sign In</Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" to='/signin'>Sign In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Signup;