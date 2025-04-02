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
import toast from 'react-hot-toast';
import Modal from 'react-modal';

const Users = () => {

  const navigate = useNavigate()

  const [userToken , setUserToken] = useState('');
  const [allUsers , setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editProf , setEditProf] = useState(false)
  const [modalIsOpen ,  setModalIsOpen] = useState(false);
  const [loader , setLoader] = useState(false);
  const [modalData , setModalData] = useState('')

  
          




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


    const customStyles = {
      content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      borderRadius: 18,
      paddingLeft: 20
      },
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


    const deleteUser = async (id) => {
      setLoader(true)
      await axios.delete(`${config.api}admin/users/${id}`,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          if(response?.data?.success == true) {
            setModalIsOpen(false)
            setLoader(false)
            getAllUsers(userToken)
            toast.success('User Deleted Successfully');
          }
        }).catch((err) => {
          console.log(err);
          setModalIsOpen(false);
          setLoader(false)
          toast.error('Error in Deleting User');
        })
    }


    const filteredUsers = allUsers.filter(item =>
      [item?.name, item?.firstName, item?.lastName , item?.email , item?.mobileNumber]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    );



  return (
    <div className="Users bg-DashboardGray w-full h-full min-h-screen">
      <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
      >
          <div className="sure-delete-modal-success">
              <div className="inner-delete-display">
                  <p className='text-xl font-medium text-Black'>Are you sure you want to delete the user</p>
                  <div className="single-category-item bg-LightBlue rounded-10p p-[15px] relative my-6">
                      <div className="inner-single-category-item flex items-center gap-5 relative">
                          <div className="right-side-category-name">
                              <p className='text-Black font-medium text-xl'>{modalData?.firstName + ' ' + modalData?.lastName}</p>
                              <p className='opacity-50 text-Black'>{modalData?.mobileNumber}</p>
                              <p className='opacity-50 text-Black'>{modalData?.email}</p>
                          </div>
                          <div className="right-sdie-role-displayer-delete absolute right-0 top-0">
                              <div className="inner-role-badge flex items-center gap-3 px-4 py-1 rounded-full bg-white ">
                              <i className="ri-checkbox-blank-circle-fill text-xs text-green-500"></i>
                              <p className='text-xl'>{modalData?.role?.name}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="cancel-delete-buttons flex items-center justify-between">
                  <button type="button" onClick={() => setModalIsOpen(false)} className='px-5 py-2 rounded-full text-xl bg-LightGrayBg '>Cancel</button>
                  <button type="button" onClick={() => deleteUser(modalData._id)} className='px-5 py-2 rounded-full text-xl bg-opacity-20 text-red-600 bg-red-400' disabled={loader}>{loader ? 'Wait...' : 'Delete'}</button>
              </div>
          </div>
      </Modal>
      <div className="inner-business-section pl-[270px] py-8 pr-8">
       <div className="inner-user-list-section">
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
                  <input type="text" placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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
                    {allUsers && filteredUsers.length > 0 ?  
                      filteredUsers.map((items , index) => {
                        return (
                          <tr className='hover:bg-Secondary hover:bg-opacity-5' key={index}>
                            <td>
                              <button className="business-name-sec flex items-center gap-x-4" onClick={() => navigate('/users/user-details' , { state: { items } })} >
                                <div className="left-bus-image ">
                                  <img src={items?.profilePicture ? items?.profilePicture : BusinessImage } className='w-10 h-10 rounded-full' alt="" />
                                </div>
                                <div className="right-business-name">
                                  <p className='text-sm'>{items?.firstName + " " + items?.lastName} </p>
                                </div>
                              </button>
                            </td>
                            <td>
                              <div className="business-number-sec">
                                <p className='text-sm'>{items?.mobileNumber}</p>
                              </div>
                            </td>
                            <td>
                              <div className="business-username-sec">
                                <p className='text-sm'>{items?.email}</p>
                              </div>
                            </td>
                            <td>
                              <div className="business-username-sec">
                                <p className=' capitalize'>{items?.role?.name}</p>
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
                                  <button type="button" className='' onClick={() => navigate('/users/user-details' , { state: { items } })}><img src={EditIcon} className='w-5 h-5' alt="" /></button>
                                </div>
                                <div className="delete-btn">
                                  <button type="button" className=''  onClick={() => {setModalData(items) , setModalIsOpen(true)}}><img src={DeleteIcon} className='w-5 h-5' alt="" /></button>
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
    </div>
  );
}

Users.propTypes = {};

Users.defaultProps = {};

export default Users;
