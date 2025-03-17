import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Dashboard.scss';
import SideBar from '../Navigation/SideBar/SideBar';
import { config } from '../../env-services';
import axios from 'axios';
import Lottie from 'lottie-react';
import EmptyLoader from '../../assets/images/animated-logos/emptyastro.json';
import EditIcon from '../../assets/images/edit-icon.svg';
import DeleteIcon from '../../assets/images/delete-icon.svg';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {


  const navigate = useNavigate()

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
    <div className="Dashboard main-dashbaord-comp bg-DashboardGray w-full h-full min-h-screen">
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
        <div className="bottom-business-table-section w-full mt-6">
          <div className="inner-business-table-section bg-white rounded-xl overflow-hidden">
            <div className="top-business-table-section-header flex items-center justify-between px-6 py-4">
              <h4 className=' text-xl font-medium'>Businesses</h4>
              {/* <button type="button" className='text-Secondary font-semibold text-lg' onClick={() => navigate('/business')}>View all</button> */}
            </div>
            <table cellPadding={15} className='w-full'>
              <thead>
                <tr className='bg-LightGrayBg'>
                  <th className='text-left font-normal opacity-50'>Name</th>
                  <th className='text-left font-normal opacity-50'>Number</th>
                  <th className='text-left font-normal opacity-50'>UserName</th>
                  <th className='text-left font-normal opacity-50'>Category</th>
                  <th className='text-left font-normal opacity-50'>City</th>
                  {/* <th className='text-left font-normal opacity-50'>Actions</th> */}
                </tr>
              </thead>
                 <tbody>
                  {businessData && businessData.length > 0 ?  
                    businessData.map((items , index) => {
                      return (
                        <tr className='hover:bg-Secondary hover:bg-opacity-5' key={index}>
                          <td>
                            <div className="business-name-sec flex items-center gap-x-4">
                              <div className="left-bus-image ">
                                <img src={items?.mediaFiles[0]?.fileUrl} className='w-10 h-10 rounded-full' alt="" />
                              </div>
                              <div className="right-business-name">
                                <p className='text-sm'>{items?.name} </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="business-number-sec">
                              <p className='text-sm'>{items?.mobileNumber}4</p>
                            </div>
                          </td>
                          <td>
                            <div className="business-username-sec">
                              <p className='text-sm'>{items?.userName}</p>
                            </div>
                          </td>
                          <td>
                            <div className="business-username-sec">
                              <p className='text-sm capitalize'>{items?.categoryId?.name}</p>
                            </div>
                          </td>
                          <td>
                            <div className="business-username-sec">
                              <p className='text-sm'>{items?.cityId?.name}</p>
                            </div>
                          </td>
                          {/* <td>
                            <div className="edit-delete-buttons flex items-center gap-x-5">
                              <div className="edit-btn">
                                <button type="button" className=''><img src={EditIcon} className='w-5 h-5' alt="" /></button>
                              </div>
                              <div className="delete-btn">
                                <button type="button" className=''><img src={DeleteIcon} className='w-5 h-5' alt="" /></button>
                              </div>
                            </div>
                          </td> */}
                        </tr>
                      )
                    }) : 
                      <tr>
                        <td colSpan={6}>
                          <div className="nodata-found-section flex justify-center flex-col items-center py-5">
                            <Lottie animationData={EmptyLoader} style={{ width: 300}}/>
                            <div className="no-data-found-text-btn mt-5">
                              <p className='text-center'>No Data Found</p>
                              <button type="button" onClick={() => navigate('/business/add-business')} className="text-Secondary font-semibold text-xl mt-5">Add Business</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    } 
                 </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {};

Dashboard.defaultProps = {};

export default Dashboard;
