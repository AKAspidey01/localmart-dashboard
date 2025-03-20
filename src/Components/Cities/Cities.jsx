import React , { useState , useEffect } from 'react';
import PropTypes from 'prop-types';
import './Cities.scss';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import EmptyLoader from '../../assets/images/animated-logos/emptyastro.json'
import { config } from '../../env-services';
import axios from 'axios';
import DeleteIcon from '../../assets/images/delete-icon.svg';
import toast from 'react-hot-toast';
import Modal from 'react-modal';


const Cities = () => {
  
  const navigate = useNavigate();

    const [allCities , setAllCities] = useState([]);
    const [modalIsOpen ,  setModalIsOpen] = useState(false);
    const [modalData , setModalData] = useState('');
    const [userToken , setUserToken] = useState('');
      const [searchTerm, setSearchTerm] = useState('');
    
    
     
    useEffect(() => {
      getAllCities()
      getUserDetails()
    }, [])


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
  

  
  const getAllCities = async () => {
    await axios.get(config.api + `admin/cities`)
    .then((response) => {
      console.log(response)
        setAllCities(response?.data?.data)
  })
}


const deleteCity = async (id) => {
  await axios.delete(`${config.api}admin/cities/${id}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  })
  .then((response) => {
    if(response?.data?.success == true) {
      // console.log(response)
      getAllCities();
      setModalIsOpen(false)
      toast.success('City Deleted Successfully');
    }
  }).catch((err) => {
    console.log(err);
    setModalIsOpen(false)
    toast.success('Error in Deleting City');
  })
}




const filteredCities = allCities.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="Cities">
      <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            contentLabel="City Delete Modal"
        >
          <div className="sure-delete-modal-success">
            <div className="inner-delete-display">
              <p className='text-xl font-medium text-Black'>Are you sure you want to delete this Category</p>
                <div className="single-category-item bg-LightBlue rounded-10p p-[15px] relative my-6">
                    <div className="inner-single-category-item flex items-center gap-5">
                        <div className="right-side-category-name">
                            <p className='text-Black font-medium'>{modalData?.name}</p>
                            <p className='text-Black opacity-60 text-sm mt-1'>{modalData?.stateId?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cancel-delete-buttons flex items-center justify-between">
                <button type="button" onClick={() => setModalIsOpen(false)} className='px-5 py-2 rounded-full text-xl bg-LightGrayBg '>Cancel</button>
                <button type="button" onClick={() => deleteCity(modalData._id)} className='px-5 py-2 rounded-full text-xl bg-opacity-20 text-red-600 bg-red-400'>Delete</button>
            </div>
          </div>
      </Modal>
      <div className="Businesses main-business-section bg-DashboardGray w-full h-full min-h-screen">
        <div className="inner-business-section pl-[270px] py-8 pr-8">
          <div className="top-business-heading flex items-center justify-between gap-x-10">
            <h2 className='text-3xl font-semibold'>Cities Overview</h2>
            <div className="right-business-add-button">
              <button type="button" className='bg-Primary rounded-lg flex items-center py-2 px-6 gap-x-2' onClick={() => navigate('/cities/add-cities')}>
                <i className="ri-add-fill text-white text-2xl"></i>
                <p className='text-xl font-medium  text-white'>Add Cities</p>
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
        <div className="bottom-business-table-section mt-6">
            <div className="inner-business-table-section grid grid-cols-4 gap-5">
              {allCities && filteredCities.length > 0 ? 
                filteredCities.map((items , index) => {
                  return (
                    <div className="single-category-item bg-white rounded-10p p-[15px] relative" key={index}>
                        <div className="inner-single-category-item flex items-center gap-5">
                            <div className="right-side-category-name">
                                <p className='text-Black font-medium capitalize'>{items?.name}</p>
                                <p className='text-Black opacity-40 text-sm mt-1'>{items?.stateId?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 absolute top-2 right-2">
                          <button type="button">
                            <i className="ri-edit-line text-Secondary text-lg"></i>
                          </button>
                          <button type="button" onClick={() => {setModalData(items) ; setModalIsOpen(true)}} className='rounded-full bg-white  '>
                            <img src={DeleteIcon} className='w-5 h-5' alt="" />
                          </button>
                        </div>
                    </div>
                  )
                }) : 
                <div className="col-span-4 bg-white rounded-xl py-5">
                  <div className="nodata-found-section flex justify-center flex-col items-center py-5">
                    <Lottie animationData={EmptyLoader} style={{ width: 300}}/>
                    <div className="no-data-found-text-btn mt-5">
                      <p className='text-center'>No Data Found</p>
                      <button type="button" onClick={() => navigate('/cities/add-cities')} className="text-Secondary font-semibold text-xl mt-5">Add Category</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Cities.propTypes = {};

Cities.defaultProps = {};

export default Cities;
