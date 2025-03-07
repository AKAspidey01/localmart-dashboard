import { useLocation } from "react-router-dom";
import SideBar from "../Components/Navigation/SideBar/SideBar";


export default function SideMenuWrapper() {
    const location = useLocation();
    const shouldShowSideMenu = location.pathname.replace(/\/$/, '') !== '/login';
    
    return (
        shouldShowSideMenu ? <SideBar/> : null
    );

};
  