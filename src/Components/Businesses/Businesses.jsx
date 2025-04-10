import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Businesses.scss';
import SideBar from '../Navigation/SideBar/SideBar';
import BusinessImage from '../../assets/images/business-image.png';
import EditIcon from '../../assets/images/edit-icon.svg';
import DeleteIcon from '../../assets/images/delete-icon.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../env-services';
import Lottie from 'lottie-react';
import EmptyLoader from '../../assets/images/animated-logos/emptyastro.json'
import DummyBusinessImage from '../../assets/images/dummy-business-image.png'
import { useAuth } from '../../utils/AuthContext';



const Businesses = () => {

  const navigate = useNavigate();
  const { userRole } = useAuth();



  const [userToken , setUserToken] = useState('');
  const [businessData , setBusinessData] = useState([]);
  const [searchValue ,  setSearchValue] = useState('')
  const [totalBusinessData , setTotalBusinessData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      await getUserDetails();
    };
    fetchData();
  }, []);

      
    const getUserDetails = async () => {
      const response = localStorage.getItem("adminToken");
      if (!response) return;
    
      const userParse = JSON.parse(response);
      setUserToken(userParse);
      getBusinesses(userParse)
    };


    const getBusinesses = async(token) => {
      // console.log(token , "userToken")
      if (!token) return; 
      try {
        await axios.get(`${config.api}admin/business` , {
          headers: {
              "Authorization": "Bearer " +  token ,
              "content-type": "application/json"
          }
      })
      .then(response => {
        // console.log(response , "response")
        // console.log(response , "response")
        setBusinessData(response?.data?.data)
        // setAllAddress(response?.data?.data)
      })
      .catch((err) => {
        console.log(err)
      })
      }catch (error) {
        console.log(error)
      }
    }



    // const handlerSearch = (value) => {
    //   setSearchValue(value);
    //   if (!value) {
    //     setTotalBusinessData(businessData);  
    //   } else {
    //     const filteredData = businessData.filter((item) => 
    //       item.email.toLowerCase().includes(value.toLowerCase()) || 
    //       item.name.toLowerCase().includes(value.toLowerCase()) ||
    //       item.userName.toLowerCase().includes(value.toLowerCase()) ||
    //       item.cityId.name.toLowerCase().includes(value.toLowerCase()) ||
    //       item.stateId.name.toLowerCase().includes(value.toLowerCase()) ||
    //       item.mobileNumber.includes(value) // For number-based searches
    //     );
    //     console.log(filteredData)
    //     setTotalBusinessData(filteredData);
    //   }
    // };

    
    const fileredBusiness = businessData.filter(item =>
      [item.name, item.userName, item.mobileNumber , item?.businessCode]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    );


  return (
    <div className="Businesses main-business-section bg-DashboardGray w-full h-full min-h-screen">
      <div className="inner-business-section pl-[270px] py-8 pr-8">
        <div className="top-business-heading flex items-center justify-between gap-x-10">
          <h2 className='text-3xl font-semibold'>Businesses</h2>
          {userRole == 'admin' || userRole == 'technician' ? 
          <div className="right-business-add-button">
            <button type="button" className='bg-Primary rounded-lg flex items-center py-2 px-6 gap-x-2' onClick={() => navigate('/business/add-business')}>
              <i className="ri-add-fill text-white text-2xl"></i>
              <p className='text-xl font-medium  text-white'>Add Business</p>
            </button>
          </div> : null }
        </div>
        <div className="middle-search-section mt-10 mb-3  ">
           <div className="form-inputsec relative w-[30%] ml-auto">
                <input type="text" placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 py-3 pl-12 pr-5 rounded-xl bg-white w-full text-Black `} 
                />                                
                <div className="email-input-icon pr-4 absolute left-4 top-1/2 w-[50px] ">
                  <i className="ri-search-line text-xl"></i>
                </div>
            </div>
        </div>
        <div className="bottom-business-table-section overflow-hidden overflow-x-auto">
          <div className="inner-business-table-section bg-white rounded-xl overflow-hidden w-[1300px]">
            <table cellPadding={15} >
              <thead>
                <tr>
                  <th className='text-left font-normal opacity-50'>Name</th>
                  <th className='text-left font-normal opacity-50'>Number</th>
                  <th className='text-left font-normal opacity-50'>UserName</th>
                  <th className='text-left font-normal opacity-50'>Category</th>
                  <th className='text-left font-normal opacity-50'>City</th>
                  <th className='text-left font-normal opacity-50'>Status</th>
                </tr>
              </thead>
                 <tbody>
                  {businessData && fileredBusiness.length > 0 ?  
                    fileredBusiness.map((items , index) => {
                      return (
                        <tr className='hover:bg-Secondary hover:bg-opacity-5 cursor-pointer' key={index} onClick={() => {
                          if (userRole === 'admin' || userRole === 'reviewer') {
                            navigate(`/business/details`, { state: { items } });
                          }
                        }}>
                          <td>
                            <div className="business-name-sec flex items-center gap-x-4">
                              <div className="left-bus-image ">
                                <img src={items?.mediaFiles[0]?.fileUrl || DummyBusinessImage} className='w-10 h-10 rounded-full' alt="" />
                              </div>
                              <div className="right-business-name">
                                <p className='text-sm'>{items?.name} </p>
                                <p className='text-xs'>{items?.businessCode ? items?.businessCode : null}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="business-number-sec">
                            <p className={`text-sm ${items?.mobileNumber ? 'text-Black' : 'text-red-400'}`}>{items?.mobileNumber ? items?.mobileNumber : 'Not Provided'}</p>
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
                          <td>
                            <div className="edit-delete-buttons flex items-center gap-x-5">
                              {/* <div className="edit-btn">
                                <button type="button" className=''><img src={EditIcon} className='w-5 h-5' alt="" /></button>
                              </div>
                              <div className="delete-btn">
                                <button type="button" className=''><img src={DeleteIcon} className='w-5 h-5' alt="" /></button>
                              </div> */}
                              <p className={`text-sm font-medium ${items?.status == 'in_review' ? 'text-orange-500' : items?.status == 'published' ? 'text-green-500' : 'text-red-400'}`}>{items?.status == "in_review" ? 'In Review' : items?.status == 'published' ? 'Published' : 'Rejected'}</p>
                            </div>
                          </td>
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

Businesses.propTypes = {};

Businesses.defaultProps = {};

export default Businesses;
