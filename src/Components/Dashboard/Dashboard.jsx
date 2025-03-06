import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Dashboard.scss';
import SideBar from '../Navigation/SideBar/SideBar';
import { config } from '../../env-services';
import axios from 'axios';

const Dashboard = () => {

  const [categoriesData , setCategoriesData] = useState([]);
  const [userToken , setUserToken] = useState('');
  const [businessData , setBusinessData] = useState([]);
  const [allUsers , setAllUsers] = useState([]);
  const [allAdverts , setAllAdverts] = useState([])


  useEffect(() => {
    getAllCategories();
    const fetchData = async () => {
      await getUserDetails();
    };
    fetchData();
  }, [])





  const getUserDetails = async () => {
    const response = localStorage.getItem("adminToken");
    if (!response) return;
  
    const userParse = JSON.parse(response);
    setUserToken(userParse);
    getBusinesses(userParse);
    getAllUsers(userParse);
    getAllAdverts(userParse)
  };

  const getAllCategories = async () => {
    await axios.get(config.api + `business-category`)
    .then((response) => {
        // console.log(response)
        setCategoriesData(response?.data?.data)
    })
  }
      

    const getBusinesses = async(token) => {
      if (!token) return; 
      try {
        await axios.get(`${config.api}admin/business` , {
          headers: {
              "Authorization": "Bearer " +  token ,
              "content-type": "application/json"
          }
      })
      .then(response => {
        setBusinessData(response?.data?.data)
      })
      .catch((err) => {
        console.log(err)
      })
      }catch (error) {
        console.log(error)
      }
    }

    const getAllUsers = async(token) => {
      // console.log(token , "userToken")
      if (!token) return; 
      try {
        await axios.get(`${config.api}admin/users` , {
          headers: {
              "Authorization": "Bearer " +  token ,
              "content-type": "application/json"
          }
      })
      .then(response => {
        // console.log(response , "response")
        setAllUsers(response?.data?.data)
      })
      .catch((err) => {
        console.log(err)
      })
      }catch (error) {
        console.log(error)
      }
    }

    const getAllAdverts = async(token) => {
      // console.log(token , "userToken")
      if (!token) return; 
      try {
        await axios.get(`${config.api}admin/advertisements` , {
          headers: {
              "Authorization": "Bearer " +  token ,
              "content-type": "application/json"
          }
      })
      .then(response => {
        // console.log(response , "response")
        setAllAdverts(response?.data?.data)
      })
      .catch((err) => {
        console.log(err)
      })
      }catch (error) {
        console.log(error)
      }
    }


    const formatDate = (isoString) => {
      return new Date(isoString)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
    };


  return (
    <div className="Dashboard main-dashbaord-comp bg-DashboardGray w-full h-screen">
      <div className="inner-dashboard-section  pl-[270px] py-8 pr-8">
        <div className="top-single-dashboard-blocks-section grid grid-cols-4 gap-4">
          <div className="inner-single-dashboard-block bg-white rounded-lg p-5">
            <div className="single-block-top-inner-sec flex gap-10 items-start justify-between">
              <div className="left-side-top-single flex flex-col gap-2">
                  <p className='text-Black opacity-40 leading-tight'>Businesses</p>
                  <h4 className='text-3xl font-semibold text-Black'>00{businessData?.length}</h4>
              </div>
              <div className="right-side-top-single w-[54px] h-[54px] bg-Secondary bg-opacity-10 rounded-md flex items-center justify-center">
                <i className="bi bi-building text-Secondary text-[26px]"></i>
              </div>
            </div>
            <div className="bottom-last-updated mt-4">
              <p className='text-Black text-sm opacity-50'>Last Updated: <span className='text-Black font-medium'>06/03/2025</span></p>
            </div>
          </div>
          <div className="inner-single-dashboard-block bg-white rounded-lg p-5">
            <div className="single-block-top-inner-sec flex gap-10 items-start justify-between">
              <div className="left-side-top-single flex flex-col gap-2">
                  <p className='text-Black opacity-40 leading-tight'>Categories</p>
                  <h4 className='text-3xl font-semibold text-Black'>00{categoriesData?.length}</h4>
              </div>
              <div className="right-side-top-single w-[54px] h-[54px] bg-Primary bg-opacity-10 rounded-md flex items-center justify-center">
                <i className="bi bi-tags-fill text-Primary text-[26px]"></i>
              </div>
            </div>
            <div className="bottom-last-updated mt-4">
              <p className='text-Black text-sm opacity-50'>Last Updated: <span className='text-Black font-medium'>06/03/2025</span></p>
            </div>
          </div>
          <div className="inner-single-dashboard-block bg-white rounded-lg p-5">
            <div className="single-block-top-inner-sec flex gap-10 items-start justify-between">
              <div className="left-side-top-single flex flex-col gap-2">
                  <p className='text-Black opacity-40 leading-tight'>Users</p>
                  <h4 className='text-3xl font-semibold text-Black'>00{allUsers?.length}</h4>
              </div>
              <div className="right-side-top-single w-[54px] h-[54px] bg-Green bg-opacity-10 rounded-md flex items-center justify-center">
                <i className="bi bi-people-fill text-Green text-[26px]"></i>
              </div>
            </div>
            <div className="bottom-last-updated mt-4">
              <p className='text-Black text-sm opacity-50'>Last Updated: <span className='text-Black font-medium'>06/03/2025</span></p>
            </div>
          </div>
          <div className="inner-single-dashboard-block bg-white rounded-lg p-5">
            <div className="single-block-top-inner-sec flex gap-10 items-start justify-between">
              <div className="left-side-top-single flex flex-col gap-2">
                  <p className='text-Black opacity-40 leading-tight'>Advetisements</p>
                  <h4 className='text-3xl font-semibold text-Black'>00{allAdverts?.length}</h4>
              </div>
              <div className="right-side-top-single w-[54px] h-[54px] bg-pink-600 bg-opacity-10 rounded-md flex items-center justify-center">
                <i className="bi bi-cast text-pink-600 text-[26px]"></i>
              </div>
            </div>
            <div className="bottom-last-updated mt-4">
              <p className='text-Black text-sm opacity-50'>Last Updated: <span className='text-Black font-medium'>06/03/2025</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {};

Dashboard.defaultProps = {};

export default Dashboard;
