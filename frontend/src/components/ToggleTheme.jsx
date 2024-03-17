import { useSelector } from "react-redux"

const ToggleTheme = ({children}) => {
  const { curTheme } = useSelector(state => state.theme)  

  return (
    <div className={curTheme}>
        <div className="bg-white text-gray-700 dark:bg-black dark:text-slate-100 min-h-screen">
            {children}
        </div>
    </div>
  )
}

export default ToggleTheme