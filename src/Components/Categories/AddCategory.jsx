import React , {useState , useEffect , useRef}  from 'react'
import axios from 'axios';
import Modal from 'react-modal';
import { config } from '../../env-services';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../utils/Loader/Loader';
import toast from 'react-hot-toast';
import DummyCategory from "../../assets/images/dummycategory.png";
import Select from 'react-select';




const AddCategory = () => {



  const navigate = useNavigate()

  const [passwordHandle , setPasswordHandle] = useState(false);    
  const [modalIsOpen ,  setModalIsOpen] = useState(false);
  const [userToken , setUserToken] = useState('');
  const [preview, setPreview] = useState(); 
  const [categoryPic , setCategoryPic] = useState();
  const [categoryName , setCategoryName] = useState();
  const [categoriesData , setCategoriesData] = useState([]);
  const [categorySelect , setCategorySelect] = useState('');
  const [categoryType , setCategoryType] = useState()


  useEffect(() => {
      getUserDetails()
      getAllCategories()
  } , [])

    const getUserDetails = async () => {
      const response = localStorage.getItem("adminToken");
      if (!response) return;
    
      const userParse = JSON.parse(response);
      setUserToken(userParse);
    };

    
    const handleFileChange = (e) => {
      const file = e.target.files[0];

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"]; // Allow SVG
    
        if (!allowedTypes.includes(file.type)) {
          alert("Only JPG, PNG, and SVG images are allowed.");
          return;
        }
    
        if (file.type !== "image/svg+xml" && file.size > 2 * 1024 * 1024) {
          alert("File size must be 2MB or less.");
          return;
        }
    
        setCategoryPic(file);
    
        // Special handling for SVG
        if (file.type === "image/svg+xml") {
          const reader = new FileReader();
          reader.onload = (event) => {
            setPreview(event.target.result); // Set SVG content
          };
          reader.readAsDataURL(file);
        } else {
          setPreview(URL.createObjectURL(file));
        }
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
          paddingLeft: 40
        },
    };

    const categoryTypeOptions = [
      {
        label: 'Parent Category',
        value: 'parent'
      },
      {
        label: 'Sub Category',
        value: 'sub'
      },
    ]


    const getAllCategories = async () => {
        await axios.get(config.api + `business-category`)
        .then((response) => {
          if (response?.data?.data) {
            const formattedCities = response.data.data.map(item => ({
                value: item._id, 
                label: item.name ,
            }));
            setCategoriesData(formattedCities);
          }
        })
    }


    // console.log(categoriesData , "categories")

  const handleAddCategory = async(values) => {
    const formData = new FormData();
    formData.append("name" , categoryName);
    formData.append("slug" , categoryName);
    formData.append("parentCategoryId" , categorySelect)
    formData.append("file" , categoryPic)


    // console.log(formData , "lkjgklsdg")
    try {
      await axios.post(`${config.api}business-category` , formData)
      .then((response) => {
        if(response?.data?.success == true) {
            setModalIsOpen(false)
            toast.success('Category Created Successfully');
            console.log( 'user create values' , response);
            navigate('/categories')
        }else {
            setModalIsOpen(false)
            toast.error('Error Creating User');
        }
      })
      .catch((err) => {
        setModalIsOpen(false)
        toast.error(err?.message);
        toast.error(err?.response?.data?.message);
        // console.log(err , 'error')
      });
    } catch (error) {
      setModalIsOpen(false)
      console.log(error)
    }
  }

  


  return (
    <div className='AddCategory'>
      <div className='AddUser bg-DashboardGray w-full h-screen'>
        <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <Loader/>
        </Modal>
        <div className="add-user-inner-section  pl-[270px] py-8 pr-8">
            <button type='button' className="goback-button-sec flex items-center gap-x-4 mb-5" onClick={() => navigate(-1)}>
                <div className="backarrow-sec w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <i className="ri-arrow-left-line text-xl"></i>
                </div>
                <h4 className='font-medium '>Back to Categories</h4>
            </button>
            <div className="single-form-section-business business-basic-details  rounded-[15px] bg-white">
              <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                  <h4 className='text-lg font-medium text-Secondary'>Select a user to create a business</h4>
              </div>
              <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5 items-end">  
                <div className="category-add-name col-span-2">
                  <p className='font-medium text-lg mb-4'>Category Image</p>
                  <div className="top-onclickprofile-pic  relative h-32 w-32 ">
                    <input type="file" onChange={(e) => handleFileChange(e) }  name="" id="" className='opacity-0 h-full w-full relative z-10 cursor-pointer'/>
                    <img src={preview ? preview :  DummyCategory} className='rounded-full absolute top-0 left-0 w-full object-contain border border-Black border-opacity-50' alt="" />
                    <div className="button-upload-icon w-6 h-6 flex items-center justify-center bg-white shadow-lg rounded-full absolute bottom-0 right-5">
                      <i class="ri-upload-cloud-2-fill text-xl text-Primary"></i>
                    </div>
                  </div>
                </div>
                <div className="right-side-category-selection-parent-sub-parent col-span-10">
                    <div className="inner-category-selection grid grid-cols-12 gap-4">
                      <div className="form-inputsec relative col-span-6">
                          <div className="label-section mb-1">
                              <p className='text-BusinessFormLabel'>Select Category Type*</p>
                          </div>
                          <Select options={categoryTypeOptions} 
                              placeholder='Select Category Type'
                              name='categorytype'
                              styles={{
                                  control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderRadius: 10,
                                      paddingLeft: 8,
                                      paddingTop: 4,
                                      paddingBottom: 4,
                                      borderWidth: 1,
                                      outlineWidth: 0,
                                      // borderColor: errors.userId ? '#FF4E4E' : '#B3B3B3',
                                      fontSize: 16,
                                      minWidth: '100%',
                                      height: 50,
                                      // borderColor: state.isFocused ? 'grey' : 'red',
                                      boxShadow: state.isFocused ? 'none' : 'none',
                                      
                                  }),
                                  }}
                                  value={categoryType}
                                  onChange={(option) => setCategoryType(option)}
                          />                               
                      </div>
                      <div className="form-inputsec relative col-span-6">
                          <div className="label-section mb-1">
                              <p className='text-BusinessFormLabel'>Select Parent Category*</p>
                          </div>
                          <Select options={categoriesData} 
                              placeholder='Select Parent Category'
                              name='categoryParent'
                              isDisabled={categoryType?.value == 'parent'}
                              styles={{
                                  control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderRadius: 10,
                                      paddingLeft: 8,
                                      paddingTop: 4,
                                      paddingBottom: 4,
                                      borderWidth: 1,
                                      outlineWidth: 0,
                                      // borderColor: errors.userId ? '#FF4E4E' : '#B3B3B3',
                                      fontSize: 16,
                                      minWidth: '100%',
                                      height: 50,
                                      // borderColor: state.isFocused ? 'grey' : 'red',
                                      boxShadow: state.isFocused ? 'none' : 'none',
                                      
                                  }),
                                  }}
                                  value={categoriesData.find(option => option.value === categorySelect)}
                                  onChange={(option) => { setCategorySelect(option?.value)}}
                          />                               
                      </div>
                      <div className="user-adding-form-section col-span-12">
                        <input type="text" onKeyUp={(e) => setCategoryName(e.target.value)} placeholder="Enter Category Name" className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 pl-6 pr-5 py-3 rounded-lg bg-white w-full text-Black `} />
                      </div>
                    </div>
                </div>
                
                <div className="bottom-form-submitter col-span-12  overflow-hidden relative group ">
                    <button type='button' onClick={handleAddCategory} disabled={!categoryPic || !categoryName}  className='w-full py-5 px-4 rounded-xl text-white font-semibold text-xl h-full bg-Primary disabled:bg-opacity-35 '>Add Category</button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AddCategory