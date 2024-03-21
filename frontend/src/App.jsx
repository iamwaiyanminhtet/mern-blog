import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBarComponent from "./components/NavBar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import DashboardProtect from "./private/DashboardProtect";
import Dashboard from "./pages/Dashboard";
import DashboardAdminProtected from "./private/DashboardAdminProtected" 
import DashUpdateBlog from "./components/DashUpdateBlog";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <NavBarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<DashboardProtect />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<DashboardAdminProtected/>} >
            <Route path="/update-blog/:blogId" element={<DashUpdateBlog/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;