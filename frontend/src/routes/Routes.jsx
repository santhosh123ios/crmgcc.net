
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/main/Main";
import LoginLayoutAdmin from "../layout/admin/LoginLayoutAdmin";
import DashboardLayoutAdmin from "../layout/admin/DashboardLayoutAdmin";
import Authgard from "../hooks/Authgard";
import Home from "../layout/main/Home";
import VendorDashboardLayout from "../layout/vendor/VendorDashboardLayout";
import MemberDashboardLayout from "../layout/member/MemberDashboardLayout";
import VerifyEmail from "../layout/main/VerifyEmail";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            { path: "/home", element: <Home/> },
            { path: "/login", element: <LoginLayoutAdmin/> },
            { path: "/verify-email", element: <VerifyEmail/> },
            { path: "/admin-dashboard", element: (<Authgard> <DashboardLayoutAdmin/> </Authgard>) },
            { path: "/vendor-dashboard", element: (<Authgard> <VendorDashboardLayout/> </Authgard>) },
            { path: "/member-dashboard", element: (<Authgard> <MemberDashboardLayout/> </Authgard>) }
            
        ],
    }
  ]);
  export default router; 