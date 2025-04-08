import React, { useState , useEffect } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../utils/Loader/Loader';
import Modal from 'react-modal';
import FileUploadIcon from '../../assets/images/file-upload-icon.svg';
import axios from 'axios';
import { config } from '../../env-services';




const AddBusinessMedis = () => {


    const location = useLocation();
    const navigate = useNavigate();

      
    const receivedId = location.state?.busId || '';

    // console.log(receivedId , "response")


    const [businessPhotos , setBusinessPhotos] = useState([]);
    const [foodItemsArray , setFoodItemsArray] = useState([]);
    const [modalIsOpen ,  setModalIsOpen] = useState(false);
    const [businessPhotoDisplay , setBusinessDisplay] = useState([]);
    
    const [userToken ,  setUserToken] = useState();
    const [userData , setUserData] = useState("");

    

    useEffect(() => {
        getUserDetails()
      } , [])
    
    
      const getUserDetails = async () => {
        const response = localStorage.getItem("adminToken");
        if (!response) return;
      
        const userParse = JSON.parse(response);
        setUserToken(userParse);
      };
  


    const businessAddValues = {
        itemName: '',
        itemType: '',
        itemPrice: ''
    }

    
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
        paddingLeft: 40
        },
    };

    const foodItemTypes = [
        { value: 'Veg', label: 'Veg' },
        { value: 'Non-Veg', label: 'Non-Veg' },
    ]

    // console.log(businessPhotos)
  


  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 2 * 1024 * 1024) { 
        alert(`File ${file.name} exceeds 2MB and will not be uploaded.`);
        return false;
      }
      return file.type === 'image/jpeg' || file.type === 'image/png';
    });

    const base64Photos = await Promise.all(
      validFiles.map(file => fileToBase64(file))
    );
  
    setBusinessPhotos((prevPhotos) => [...prevPhotos, ...validFiles]);
    setBusinessDisplay((prevPhotos) => [...prevPhotos, ...base64Photos]);
  };



  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const addFoodItem = (values) => {
    const { itemName, itemType, itemPrice } = values;
    const newFoodItem = { itemName, itemType, itemPrice };
    setFoodItemsArray((prevFoodItemsArray) => [...prevFoodItemsArray, newFoodItem]);
  };

  const removeFoodItem = (index) => {
    setFoodItemsArray((prevFoodItemsArray) =>
      prevFoodItemsArray.filter((_, i) => i !== index) // Remove item at the given index
    );
  };


  const handleRemoveImage = (indexToRemove) => {
    setBusinessPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    
    );
    setBusinessDisplay((prevPhotos) => 
        prevPhotos.filter((_ , index) =>  index !== indexToRemove)
    );
  };


  const handleBusniessMediaUpload = async () => {

    if (businessPhotos.length < 2) {
      alert("Please upload a minimum of 2 photos.");
      return;
    }

    const formData = new FormData()

    formData.append("businessId" , receivedId);

    if (businessPhotos.length > 0) {
      businessPhotos.forEach((photo) => {
        formData.append("files", photo);
      });
    }
    setModalIsOpen(true)
    try {
      await axios.post(`${config.api}admin/business/upload-business-media`, formData , {
        headers: {
          Authorization: `Bearer ${userToken}`, 
        },
      })
      .then((response) => {
        // console.log(response)
        if(response?.data?.status == 'success') {
            toast.success('Business Created Successfully');
            setModalIsOpen(false)
            navigate('/business')
        }else {
            toast.error('Error in upload files');
            setModalIsOpen(false)
        }

      }).catch((err) => {
        console.log(err)
        toast.error(err?.response?.data?.message || "An error occurred during upload")
        setModalIsOpen(false)
      })
    } catch (error) {
      setModalIsOpen(false)
    }

  }


  return (
    <div className='AddBusiness w-full '>
        <div className='business-media-upload bg-LightBlue bg-opacity-80 BusinessFormAdding h-full min-h-screen'>
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <Loader/>
            </Modal>
            <div className="inner-business-media-upload  pl-[270px] py-8 pr-8">
                <div className="container">
                    <div className="top-business-form-heading mb-10">
                        <h2 className='font-medium text-Black text-2xl'>Add Business Photos</h2>
                    </div>
                    <div className="single-form-section-business business-basic-details overflow-hidden rounded-[15px] bg-white">
                        <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                            <h4 className='text-lg font-medium text-Secondary'>Business Pics and media</h4>
                        </div>
                        <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5">
                            <div className="form-inputsec relative col-span-12">
                                <div className={`top-images-sec-uploaded-business-doc flex flex-wrap items-center gap-3 ${businessPhotos.length == 0 ? 'mb-0' : 'mb-5'}`}>
                                    {businessPhotoDisplay.map((photo , index) => {
                                        return (
                                            <div className="single-image-business-photo rounded-lg overflow-hidden relative" key={index}>
                                            <img src={photo} className='object-cover w-32 h-32' alt="" />
                                            <button type="button" onClick={() => handleRemoveImage(index)} className='w-6 h-6 bg-white rounded-full flex items-center justify-center absolute top-2 right-2'><i className="ri-close-large-fill text-red-500"></i></button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="label-section mb-1">
                                    <p className='text-BusinessFormLabel'>Business Photos and media* (Upload Minimum 2 Photos)</p>
                                </div>
                                <div className="file-upload-outer-section-custom bg-ProfileScreensBg rounded-10p overflow-hidden relative h-[110px]">
                                    <input type="file" name="" id="" multiple onChange={(e) => handleFileChange(e)} className="h-full w-full opacity-0 relative z-10 cursor-pointer"/>
                                    <div className="inner-file-upload-butifier absolute top-1/2 left-1/2 w-full flex justify-center flex-col items-center px-5 gap-x-5">
                                        <img src={FileUploadIcon} className='w-10 h-10' alt="" />
                                        <p className='text-Black'>Click to Upload photos of your business</p>
                                    </div>
                                </div>                               
                            </div>
                        </div>
                    </div>
                    <div className="bottom-form-submitter col-span-5  overflow-hidden relative group mt-10 grid grid-cols-2 gap-5">
                        <button type="button" className='w-full py-5 px-4 rounded-xl text-Secondary font-semibold text-xl h-full bg-transparent disabled:bg-opacity-35 border-2 border-Secondary ' onClick={() => navigate('/business')}>Skip for now</button>
                        <button type='button' onClick={handleBusniessMediaUpload} disabled={businessPhotos.length === 0} className='w-full py-5 px-4 rounded-xl text-white font-semibold text-xl h-full bg-Primary border-2 border-Primary disabled:opacity-35 '>Submit Business Listing</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddBusinessMedis