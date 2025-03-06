import { useLocation } from "react-router-dom";
import SideBar from "../Components/Navigation/SideBar/SideBar";


export default function SideMenuWrapper() {
    const location = useLocation();
    // const isPageNotFoundPage = location.pathname === '/' || location.pathname === '/About-Me' || location.pathname === '/LearnHtml' || 
    // location.pathname === '/LearnTailwind' ||  location.pathname === '/LearnCss' || location.pathname.includes('LearnReact') || location.pathname.includes('LearnAngular');
    const shouldShowSideMenu =  location.pathname !== '/login' ;
    
    return (
        shouldShowSideMenu ? <SideBar/> : null
    );

};
  