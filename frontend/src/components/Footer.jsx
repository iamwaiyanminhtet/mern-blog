import { BsFacebook, BsGithub, BsReddit } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const FooterComponent = () => {
    return (
        <footer className="py-6 px-5 bg-inherit">
                <div className="flex flex-col sm:flex-row  justify-start items-center  sm:items-center sm:justify-between gap-5 ">
                    <div className="flex flex-col sm:flex-row gap-4 text-sm ">
                        <span>©2024 Wai Yan Min Htet <span className='mx-4 hidden sm:inline'>|</span> </span>
                        <Link rel="noopener noreferrer" to='/' className='underline'>
                            <span>Home</span>
                        </Link>
                        <Link to='/search' rel="noopener noreferrer" className='underline'>
                            <span>Blogs</span>
                        </Link>
                    </div>
                    <div className="flex  justify-start gap-5 ">
                        <Link to='https://www.github.com/iamwaiyanminhtet' rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full dark:bg-teal-300 dark:text-gray-900" target='_blank'>
                            <BsGithub size={23} />
                        </Link>
                        <Link to='https://www.facebook.com/iamwaiyanminhtet' rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full dark:bg-teal-300 dark:text-gray-900" target='_blank'>
                            <BsFacebook size={23} />
                        </Link>
                        <Link to='https://www.reddit.com/user/iamwaiyanminhtet/' rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full dark:bg-teal-300 dark:text-gray-900" target='_blank'>
                            <BsReddit size={23} />
                        </Link>
                    </div>
                </div>
         
        </footer>

    )
}

export default FooterComponent