import React from 'react';
import PropTypes from 'prop-types';
import './SideBar.scss';
import Logo from '../../../assets/images/logo-svg.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/AuthContext';


const SideBar = () => {

  const { logout , userRole } = useAuth()

  console.log(userRole)
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="SideBar h-full bg-white py-8 w-full">
      {/* <div className="inner-side-bar-section relative h-full">
        <div className="top-logo-section-sidebar px-5">
          <img src={Logo} className='w-full max-w-32' alt="" />
        </div>
        <div className="main-side-bar-nav mt-6">
          <nav>
            <ul className='flex flex-col gap-y-1'>
              <li><NavLink className={`text-Black text-lg py-3 px-5 w-full flex items-center gap-3`} to={'/'}><i className="ri-dashboard-fill"></i> <p>Dashboard</p></NavLink></li>
              <li><NavLink className={`text-Black text-lg py-3 px-5 w-full flex items-center gap-3`} to={'/business'}><i className="ri-file-list-3-fill"></i> <p>Businesses</p></NavLink></li>
              <li><NavLink className={`text-Black text-lg py-3 px-5 w-full flex items-center gap-3`} to={'/users'}><i className="ri-group-fill"></i> <p>Users</p></NavLink></li>
              <li><NavLink className={`text-Black text-lg py-3 px-5 w-full flex items-center gap-3`} to={'/categories'}><i className="bi bi-tags-fill"></i> <p>Categories</p></NavLink></li>
              <li><NavLink className={`text-Black text-lg py-3 px-5 w-full flex items-center gap-3`} to={'/advertisements'}><i className="bi bi-cast"></i> <p>Adds</p></NavLink></li>
              <li><NavLink className={`text-Black text-lg py-3 px-5 w-full flex items-center gap-3`} to={'/cities'}><i className="bi bi-crosshair"></i> <p>Cities</p></NavLink></li>
              <li><NavLink className={`text-Black text-lg py-3 px-5 w-full flex items-center gap-3`} to={'/profile'}><i className="bi bi-person-circle"></i> <p>Profile</p></NavLink></li>
            </ul>
          </nav>
        </div>
        <div className="bottom-logout-button absolute bottom-0 left-0">
          <button  onClick={() => {logout() , navigate('/login')}} type="button" className='text-red-400 font-medium text-lg w-full py-3 px-5 text-left'>Log Out</button>
        </div>
      </div> */}
      <div className="inner-side-bar-section relative h-full ">
        <div className="top-logo-section-sidebar px-5">
          <img src={Logo} className="w-full max-w-32" alt="Logo" />
        </div>
        <div className="main-side-bar-nav mt-6">
          <nav>
            <ul className="flex flex-col gap-y-1">
              {/* Admin can access everything */}
                <li>
                  <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/">
                    <i className="ri-dashboard-fill"></i> <p>Dashboard</p>
                  </NavLink>
                </li>

              {(userRole === "admin" || userRole === "reviewer") && (
                <li>
                  <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/business">
                    <i className="ri-file-list-3-fill"></i> <p>Businesses</p>
                  </NavLink>
                </li>
              )}

              {userRole === "admin" && (
                <>
                  <li>
                    <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/users">
                      <i className="ri-group-fill"></i> <p>Users</p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/categories">
                      <i className="bi bi-tags-fill"></i> <p>Categories</p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/advertisements">
                      <i className="bi bi-cast"></i> <p>Adds</p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/cities">
                      <i className="bi bi-crosshair"></i> <p>Cities</p>
                    </NavLink>
                  </li>
                </>
              )}

              {userRole === "technician" && (
                <>
                  <li>
                    <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/categories">
                      <i className="bi bi-tags-fill"></i> <p>Categories</p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/advertisements">
                      <i className="bi bi-cast"></i> <p>Adds</p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/cities">
                      <i className="bi bi-crosshair"></i> <p>Cities</p>
                    </NavLink>
                  </li>
                </>
              )}

              {/* All roles can access Profile */}
              <li>
                <NavLink className="text-Black text-lg py-3 px-5 w-full flex items-center gap-3" to="/profile">
                  <i className="bi bi-person-circle"></i> <p>Profile</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="bottom-logout-button absolute bottom-0 left-0">
          <button onClick={handleLogout} type="button" className="text-red-400 font-medium text-lg w-full py-3 px-5 text-left">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

SideBar.propTypes = {};

SideBar.defaultProps = {};

export default SideBar;
