import { Link } from "react-router-dom"
const NotFound = () => {
    return (
        <>
            <div className="min-h-[calc(90vh-80px)] max-w-full flex justify-center items-center p-5 ">
                <div className="flex flex-col gap-5 sm:gap-3">
                    <h1 className="text-4xl font-extrabold text-center lg:text-6xl 2xl:text-7xl">
                        <span className="text-transparent bg-gradient-to-bl bg-clip-text from-sky-400 via-cyan-500 to-emerald-500 dark:from-sky-500 dark:via-blue-400 dark:to-green-700 font-serif text-center ">
                            404 Not Found
                        </span>
                    </h1>
                    <p className="text-sm text-center">It looks like the page you are trying to search does not exist yet :(</p>
                    <Link to='/' className="text-sky-500 font-semibold text-center">
                        <p>Go Back Home?</p>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default NotFound