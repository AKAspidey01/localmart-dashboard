import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Profile.scss';
import ProfileDummyImg from '../../assets/images/profile-dummy-image.svg';


const Profile = () => {

  const [passwordHandle , setPasswordHandle] = useState(false);  

  return (
    <div className="Profile bg-DashboardGray w-full h-screen">
      <div className="inner-profile-main-section pl-[270px] py-8 pr-8">
          <div className="top-business-heading">
            <h2 className='text-3xl font-semibold'>Porfile Information</h2>
          </div>
          <div className="profile-details-cards-section bg-white rounded-xl  mt-10">
            <div className="main-inner-profile-section-password-updet">
              <div className="inner-admin-profile-section flex items-center  p-6 justify-between">
                  <div className="left-image-name-section-profile flex items-center gap-6">
                    <div className="profile-image">
                      <img src={ ProfileDummyImg} className='rounded-full w-[60px] h-[60px]' alt="" />
                    </div>
                    <div className="profile-details-prof">
                      <h6 className='text-Black font-medium text-xl'>Admin Local Mart</h6>
                      <p className='text-LightText'>admin@localmart.com</p>
                    </div>
                  </div>
                  <div className="right-side-profile-role-badge">
                    <p className='px-6 py-2 rounded-lg text-lg bg-green-600 bg-opacity-10 text-green-500'>Super Amdin</p>
                  </div>
              </div>
              <div className="change-password-section">
                <div className="change-password-head-sec bg-LightBlue w-full py-4 px-5">
                  <p className='text-lg font-medium text-Black'>Credentials</p>
                </div>
                <div className="inner-credentials-section p-6">
                  <div className="inner-fields-grid-outer-main grid grid-cols-12 gap-5">
                      <div className="form-inputsec relative col-span-6">
                          <div className="label-section mb-1">
                              <p className='text-BusinessFormLabel'>Email*</p>
                          </div>
                          <input type="text" name="firstName" placeholder='Enter First Name' disabled={true} value={'admin@localmart.com'}
                              className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black disabled:bg-LightGrayBg`} 
                          />                                
                      </div>
                      <div className="form-inputsec  col-span-6">
                          <div className="label-section mb-1">
                              <p className='text-BusinessFormLabel'>Password*</p>
                          </div>
                          <div className="inner-form-input-section relative">
                              <input type={passwordHandle ? 'text' : 'password'} name="password" placeholder='Enter Password*' disabled={true} value={"94687854565"}
                                  className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black disabled:bg-LightGrayBg `} 
                              />                                
                              <button type="button" className="email-input-icon password-login-icon owa absolute right-4 top-1/2" onClick={() => setPasswordHandle(!passwordHandle)}>
                                  <i className={`${passwordHandle ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl text-LightText`}></i>
                              </button>
                          </div>
                      </div>
                      <div className="bottom-form-submitter col-span-3  overflow-hidden relative group ">
                          <button type='button' className='w-full py-2 px-4 rounded-md text-white h-full bg-Primary disabled:bg-opacity-35 '>Update Creadentials</button>
                      </div>
                  </div>                                                                                                                                                                                         
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

Profile.propTypes = {};

Profile.defaultProps = {};

export default Profile;
