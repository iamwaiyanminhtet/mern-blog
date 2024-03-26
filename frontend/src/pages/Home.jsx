import FooterComponent from "../components/Footer";
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div>
      <div className="h-[calc(90vh-80px)] max-h-[calc(80dvh-80px)] sm:max-h-[calc(90dvh-80px)] flex flex-col justify-center items-center p-5 gap-5">
        <h1 className="text-4xl font-extrabold text-center lg:text-6xl 2xl:text-7xl">
          <span className="logo-text-shadow me-4">WIA</span>
          <span className="text-transparent bg-gradient-to-bl bg-clip-text from-sky-400 via-cyan-500 to-emerald-500 dark:from-sky-500 dark:via-blue-400 dark:to-green-700 font-serif text-center ">
            as a weird
          </span>
        </h1>
        <p className="max-w-[70%] text-center text-md sm:text-lg">
          I will not be writing blogs occasionally as this is created with the intention to improve web dev skills. That being said, I have written couple blogs those are utterly original.
          <Link className="ms-2 font-semibold text-sky-500 underline hover:opacity-85 uppercase" to='/search'>Take a look!</Link>
        </p>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  )
}

export default Home