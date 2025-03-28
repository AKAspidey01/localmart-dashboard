import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileDummyImg from '../../assets/images/business-owner-pic.jpg';
import UpdateUser from './UpdateUser';
import Modal from 'react-modal';
import axios from 'axios';
import { config } from '../../env-services';
import toast from 'react-hot-toast';

const UserDetails = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const userData =  location.state?.items || '';

    
    const [editProf , setEditProf] = useState(false)
    const [modalIsOpen ,  setModalIsOpen] = useState(false);
    const [loader , setLoader] = useState(false);
    const [userToken , setUserToken] = useState('');

      useEffect(() => {
        getUserDetails()
      } , [])
    
        const getUserDetails = async () => {
          const response = localStorage.getItem("adminToken");
          if (!response) return;
        
          const userParse = JSON.parse(response);
          setUserToken(userParse);
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



    const formatDate = (isoString) => {
        return new Date(isoString)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");
    };
    
    
  const firstNameDetails = [
    {
      title: 'First Name',
      desc: userData?.firstName ? userData?.firstName : 'Not Provided',
      invalid: userData?.firstName ? false : true
    },
    {
      title: 'Last Name',
      desc: userData?.lastName ? userData?.lastName : 'Not Provided',
      invalid: userData?.lastName ? false : true
    },
    {
      title: 'Date Of Birth',
      desc: userData?.dateOfBirth ? formatDate(userData?.dateOfBirth) : 'Not Provided',
      invalid: userData?.dateOfBirth ? false : true
    },
    {
      title: 'Role',
      desc: userData?.role ? userData?.role?.name : 'Not Updated',
      invalid: userData?.role ? false : true
    }
  ]



  const emailDetails = [
    {
      title: 'Email Address',
      desc: userData?.email ? userData?.email : 'Not Provided',
      invalid: userData?.email ? false : true
    },
    {
      title: 'Phone Number',
      desc: userData?.mobileNumber ? userData?.mobileNumber : 'Not Provided',
      invalid: userData?.mobileNumber ? false : true
    },
    {
      title: 'User Since',
      desc: formatDate(userData?.createdAt),
    }
  ]


  const localityDetails = [
    {
      title: 'Country',
      desc: userData?.country ? userData?.country : 'Not Provided',
      invalid: userData?.country ? false : true
    },
    {
      title: 'State',
      desc: userData?.state ? userData?.state : 'Not Provided',
      invalid: userData?.state ? false : true
    },
    {
      title: 'City',
      desc: userData?.city ? userData?.city : 'Not Provided',
      invalid: userData?.city ? false : true
    },
    {
      title: 'Pincode',
      desc: userData?.pincode ? userData?.pincode : 'Not Provided',
      invalid: userData?.pincode ? false : true
    }
  ]

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
          navigate('/users')
          toast.success('User Deleted Successfully');
        }
      }).catch((err) => {
        console.log(err);
        setModalIsOpen(false);
        setLoader(false)
        toast.error('Error in Deleting User');
      })
  }



  return (
    <div className='userDetails-main-section bg-DashboardGray w-full h-full min-h-screen'>
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
                                <p className='text-Black font-medium text-xl'>{userData?.firstName + ' ' + userData?.lastName}</p>
                                <p className='opacity-50 text-Black'>{userData?.mobileNumber}</p>
                                <p className='opacity-50 text-Black'>{userData?.email}</p>
                            </div>
                            <div className="right-sdie-role-displayer-delete absolute right-0 top-0">
                                <div className="inner-role-badge flex items-center gap-3 px-4 py-1 rounded-full bg-white ">
                                <i className="ri-checkbox-blank-circle-fill text-xs text-green-500"></i>
                                <p className='text-xl'>{userData?.role?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cancel-delete-buttons flex items-center justify-between">
                    <button type="button" onClick={() => setModalIsOpen(false)} className='px-5 py-2 rounded-full text-xl bg-LightGrayBg '>Cancel</button>
                    <button type="button" onClick={() => deleteUser(userData._id)} className='px-5 py-2 rounded-full text-xl bg-opacity-20 text-red-600 bg-red-400' disabled={loader}>{loader ? 'Wait...' : 'Delete'}</button>
                </div>
            </div>
        </Modal>
        <div className="inner-user-details-main-section inner-business-section pl-[270px] py-8 pr-8">
            {editProf ? 
            <UpdateUser userDetails={userData} setEditProf={setEditProf} /> : 
            <div className="profile-details-main-cards-section flex flex-col gap-y-6 mt-4 py-5  bg-white rounded-3xl">
                <div className="profile-card flex items-center gap-x-10 justify-between pl-5 pr-8 relative  bg-white ">
                    <div className="left-image-name-section-profile flex items-center gap-6">
                        <div className="profile-image">
                            <img src={userData?.profilePicture ? userData.profilePicture : ProfileDummyImg} className='rounded-full w-16 h-16 min-w-16 min-h-16' alt="" />
                        </div>
                        <div className="profile-details-prof">
                            <h6 className='text-Black font-medium'>{userData?.firstName} {userData?.lastName} </h6>
                            <p className='text-LightText'>{userData?.email}</p>
                        </div>
                    </div>
                    <div className="right-side-buttons-edit-delete flex items-center gap-10 absolute right-10 top-0">
                        <button type="button" className='text-Secondary text-lg' onClick={() => setEditProf(true)}><i class="ri-edit-line text-lg mr-1"></i> Edit</button>
                        <button type="button" className='text-red-500 text-lg' onClick={() => {setModalIsOpen(true)}}><i class="ri-delete-bin-6-line text-lg mr-1"></i>Delete</button>
                    </div>
                </div>
                <div className="profile-information-details-bottom-part ">
                    <div className="left-sdie-profile-info-heading px-5 py-4 bg-LightBlue">
                        <h4 className='text-lg font-medium text-Black'>Personal Information</h4>
                    </div>
                    <div className="top-deskview-combined-details-section-profile px-5 py-4">
                        <div className="combined-details-screen-profile flex items-center gap-32  mt-3">
                            {firstNameDetails.map((items , index)=> {
                            return (
                                <div className="single-detail-profile-sec" key={index}>
                                    <p className='text-LightBlack opacity-50'>{items.title}</p>
                                    <h6 className={`${items?.invalid ? 'text-red-400' : 'text-Black'}`}>{items.desc}</h6>
                                </div>
                            )
                            })}
                        </div>
                        <div className="combined-details-screen-profile flex items-center gap-32  my-16">
                            {emailDetails.map((items , index)=> {
                            return (
                                <div className="single-detail-profile-sec" key={index}>
                                    <p className='text-LightBlack opacity-50'>{items.title}</p>
                                    <h6 className={`${items?.invalid ? 'text-red-400' : 'text-Black'}`}>{items.desc}</h6>
                                </div>
                            )
                            })}
                        </div>
                        <div className="combined-details-screen-profile flex items-center gap-32">
                            {localityDetails.map((items , index)=> {
                            return (
                                <div className="single-detail-profile-sec" key={index}>
                                    <p className='text-LightBlack opacity-50'>{items.title}</p>
                                    <h6 className={`${items?.invalid ? 'text-red-400' : 'text-Black'}`}>{items.desc}</h6>
                                </div>
                            )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    </div>
  )
}

export default UserDetails