import React , {useState , useEffect} from 'react';
import PropTypes from 'prop-types';
import './Users.scss';
import BusinessImage from '../../assets/images/business-image.png';
import DeleteIcon from '../../assets/images/delete-icon.svg';
import EditIcon from '../../assets/images/edit-icon.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../env-services';
import Lottie from 'lottie-react';
import EmptyLoader from '../../assets/images/animated-logos/emptyastro.json'

const Users = () => {

  const navigate = useNavigate()

  const [userToken , setUserToken] = useState('');
  const [allUsers , setAllUsers] = useState([]);


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
      getAllUsers(userParse)
    };


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
        // setAllAddress(response?.data?.data)
      })
      .catch((err) => {
        console.log(err)
      })
      }catch (error) {
        console.log(error)
      }
    }

  return (
    <div className="Users bg-DashboardGray w-full h-screen">
      <div className="inner-business-section pl-[270px] py-8 pr-8">
        <div className="top-business-heading flex items-center justify-between gap-x-10">
          <h2 className='text-3xl font-semibold'>Users</h2>
          <div className="right-business-add-button">
            <button type="button" className='bg-Primary rounded-lg flex items-center py-2 px-6 gap-x-2' onClick={() => navigate('/users/add-user')}>
              <i className="ri-add-fill text-white text-2xl"></i>
              <p className='text-xl font-medium  text-white'>Add User</p>
            </button>
          </div>
        </div>
        <div className="middle-search-section mt-10 mb-3  ">
           <div className="form-inputsec relative w-[30%] ml-auto">
                <input type="text" placeholder='Search'
                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 py-3 pl-12 pr-5 rounded-xl bg-white w-full text-Black `} 
                />                                
                <div className="email-input-icon pr-4 absolute left-4 top-1/2 w-[50px] ">
                  <i className="ri-search-line text-xl"></i>
                </div>
            </div>
        </div>
        <div className="bottom-business-table-section">
          <div className="inner-business-table-section bg-white rounded-xl overflow-hidden">
            <table cellPadding={15} >
              <thead>
                <tr>
                  <th className='text-left font-normal opacity-50'>Name</th>
                  <th className='text-left font-normal opacity-50'>Number</th>
                  <th className='text-left font-normal opacity-50'>Email</th>
                  <th className='text-left font-normal opacity-50'>Role</th>
                  <th className='text-left font-normal opacity-50'>City</th>
                  <th className='text-left font-normal opacity-50'>Actions</th>
                </tr>
              </thead>
                 <tbody>
                  {allUsers && allUsers.length > 0 ?  
                    allUsers.map((items , index) => {
                      return (
                        <tr className='hover:bg-Secondary hover:bg-opacity-5' key={index}>
                          <td>
                            <div className="business-name-sec flex items-center gap-x-4">
                              <div className="left-bus-image ">
                                <img src={items?.profilePicture ? items?.profilePicture : BusinessImage } className='w-10 h-10 rounded-full' alt="" />
                              </div>
                              <div className="right-business-name">
                                <p className='text-sm'>{items?.firstName + " " + items?.lastName} </p>
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
                              <p className='text-sm'>{items?.email}</p>
                            </div>
                          </td>
                          <td>
                            <div className="business-username-sec">
                              <p className=' capitalize'>{items?.role}</p>
                            </div>
                          </td>
                          <td>
                            <div className="business-username-sec">
                              <p className=''>{items?.cityId?.name}</p>
                            </div>
                          </td>
                          <td>
                            <div className="edit-delete-buttons flex items-center gap-x-5">
                              <div className="edit-btn">
                                <button type="button" className=''><img src={EditIcon} className='w-5 h-5' alt="" /></button>
                              </div>
                              <div className="delete-btn">
                                <button type="button" className=''><img src={DeleteIcon} className='w-5 h-5' alt="" /></button>
                              </div>
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
                              <button type="button" onClick={() => navigate('/users/add-user')} className="text-Secondary font-semibold text-xl mt-5">Add Business</button>
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

Users.propTypes = {};

Users.defaultProps = {};

export default Users;
