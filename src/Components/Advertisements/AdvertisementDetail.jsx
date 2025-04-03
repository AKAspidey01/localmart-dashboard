import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProfileDummyImg from '../../assets/images/business-owner-pic.jpg';
import Modal from 'react-modal';
import axios from 'axios';
import { config } from '../../env-services';
import toast from 'react-hot-toast';
import DummyImage from '../../assets/images/empty-image-bg.jpg'
import { useAuth } from '../../utils/AuthContext';
import Loader from '../../utils/Loader/Loader';


const AdvertisementDetail = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const userData =  location.state?.items || '';
    const {id} = useParams();
    const {authToken} = useAuth()

    
    const [editProf , setEditProf] = useState(false)
    const [modalIsOpen ,  setModalIsOpen] = useState(false);
    const [loader , setLoader] = useState(false);
    const [userToken , setUserToken] = useState('');
    const [singleAdvert , setSingleAdvert] = useState('');
    const [deleteAddModal , setDeleteAddModal] = useState(false)

      useEffect(() => {
        getUserDetails()
        getAdvertDetailsById()
      } , [])
    
        const getUserDetails = async () => {
          const response = localStorage.getItem("adminToken");
          if (!response) return;
        
          const userParse = JSON.parse(response);
          setUserToken(userParse);
        };
    

        

    const getAdvertDetailsById = async () => {
        setModalIsOpen(true);
        try {
            await axios
            .get(`${config.api}admin/advertisements/${id}`, {
                headers: {
                Authorization: "Bearer " + authToken,
                "content-type": "application/json",
                },
            })
            .then((response) => {
                console.log("response", response);
                setModalIsOpen(false);
                setSingleAdvert(response?.data?.data);
            })
            .catch((err) => {
                setModalIsOpen(false);
                console.log(err);
            });
        } catch (error) {
            setModalIsOpen(false);
            console.log(error);
        }
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
      title: 'Add Name',
      desc: singleAdvert?.advertisementTitle ? singleAdvert?.advertisementTitle : 'Not Provided',
      invalid: singleAdvert?.advertisementTitle ? false : true
    },

    {
      title: 'Submitted On',
      desc: singleAdvert?.createdAt ? formatDate(singleAdvert?.createdAt) : 'Not Provided',
      invalid: singleAdvert?.createdAt ? false : true
    },
    {
        title: 'First Name',
        desc: singleAdvert?.firstName ? singleAdvert?.firstName : 'Not Updated',
        invalid: singleAdvert?.firstName ? false : true
    },
    {
        title: 'Last Name',
        desc: singleAdvert?.lastName ? singleAdvert?.lastName : 'Not Updated',
        invalid: singleAdvert?.lastName ? false : true
    },
    {
      title: 'Mobile Number',
      desc: singleAdvert?.mobileNumber ? singleAdvert?.mobileNumber : 'Not Updated',
      invalid: singleAdvert?.mobileNumber ? false : true
    },
    {
        title: 'Alternate Number',
        desc: singleAdvert?.alternateMobileNumber ? singleAdvert?.alternateMobileNumber : 'Not Updated',
        invalid: singleAdvert?.alternateMobileNumber ? false : true
    },
    {
      title: 'Subject',
      desc: singleAdvert?.subject ? singleAdvert?.subject : 'Not Provided',
      invalid: singleAdvert?.subject ? false : true
    },
  ]




  

  const deteletAdvert = async (id) => {
    setLoader(true)
    await axios.delete(`${config.api}admin/advertisements/${id}`,{
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        if(response?.data?.success == true) {
          setModalIsOpen(false)
          setLoader(false)
          navigate('/advertisements')
          toast.success('Advertisement Deleted');
        }
      }).catch((err) => {
        console.log(err);
        setModalIsOpen(false);
        setLoader(false)
        toast.error('Error in Deleting Advertisement');
      })
  }


  return (
    <div className='userDetails-main-section bg-DashboardGray w-full h-full min-h-screen'>
        <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            contentLabel="Loader Modal"
        >
            <Loader />
        </Modal>
        <Modal
            isOpen={deleteAddModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="sure-delete-modal-success">
                <div className="inner-delete-display">
                    <p className='text-xl font-medium text-Black'>You sure you want to delete Advertisement</p>
                    <div className="single-category-item bg-LightBlue rounded-10p p-[15px] relative my-6">
                        <div className="inner-single-category-item flex items-center gap-5 relative">
                            <div className="right-side-category-name">
                                <img src={singleAdvert?.bannerPhoto ? singleAdvert.bannerPhoto : DummyImage} className='w-16 h-16 rounded-full object-cover' alt="" />
                            </div>
                            <div className="right-advert-deatils">
                                <h2 className='text-lg font-medium'>{singleAdvert?.advertisementTitle}</h2>
                                <p className='opacity-70'>{singleAdvert?.mobileNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cancel-delete-buttons flex items-center justify-between">
                    <button type="button" onClick={() => setDeleteAddModal(false)} className='px-5 py-2 rounded-full text-xl bg-LightGrayBg '>Cancel</button>
                    <button type="button" onClick={() => deteletAdvert(singleAdvert._id)} className='px-5 py-2 rounded-full text-xl bg-opacity-20 text-red-600 bg-red-400' disabled={loader}>{loader ? 'Wait...' : 'Delete'}</button>
                </div>
            </div>
        </Modal>
        <div className="inner-user-details-main-section inner-business-section pl-[270px] py-8 pr-8">
            <div className="top-bac-edit-dunctions flex items-center justify-between gap-10 ">
                <button type='button' className="goback-button-sec flex items-center gap-x-4" onClick={() => navigate(-1)}>
                    <div className="backarrow-sec w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <i className="ri-arrow-left-line text-xl"></i>
                    </div>
                    <h4 className='font-medium '>Back to Advertisements</h4>
                </button>
                <div className="right-side-buttons-edit-delete flex items-center gap-10  bg-white px-6 py-2 rounded-md">
                    <button type="button" className='text-Secondary text-lg' onClick={() => setEditProf(true)}><i class="ri-edit-line text-lg mr-1"></i> Edit</button>
                    <button type="button" className='text-red-500 text-lg' onClick={() => {setDeleteAddModal(true)}}><i class="ri-delete-bin-6-line text-lg mr-1"></i>Delete</button>
                </div>
            </div>
            <div className="profile-details-main-cards-section flex flex-col gap-y-6 mt-8 py-5  bg-white rounded-3xl">
                <div className="profile-card px-5 relative  bg-white ">
                    <div className="profile-image w-full">
                        <img src={singleAdvert?.bannerPhoto ? singleAdvert.bannerPhoto : DummyImage} className='w-full rounded-2xl h-[300px] object-cover' alt="" />
                    </div>                    
                </div>
                <div className="profile-information-details-bottom-part ">
                    <div className="left-sdie-profile-info-heading px-5 py-4 bg-LightBlue">
                        <h4 className='text-lg font-medium text-Black'>Advertisement Details</h4>
                    </div>
                    <div className="top-deskview-combined-details-section-profile px-5 py-4">
                        <div className="combined-details-screen-profile flex flex-wrap items-center gap-x-28 gap-y-10  mt-3">
                            {firstNameDetails.map((items , index)=> {
                            return (
                                <div className="single-detail-profile-sec" key={index}>
                                    <p className='text-LightBlack opacity-50'>{items.title}</p>
                                    <h6 className={`${items?.invalid ? 'text-red-400' : 'text-Black'}`}>{items.desc}</h6>
                                </div>
                            )
                            })}
                            <div className="single-detail-profile-sec">
                                    <p className='text-LightBlack opacity-50'>Advertisement Link</p>
                                    <a href={singleAdvert?.advertisementLink} target='_blank' className={`${singleAdvert?.advertisementLink ? 'text-Secondary' : 'text-red-400'}`}>{singleAdvert?.advertisementLink}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdvertisementDetail