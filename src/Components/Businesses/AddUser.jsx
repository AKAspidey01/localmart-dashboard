import React, { useState , useEffect , useRef } from 'react';
import './Businesses.scss';
import { Formik , Form , Field } from 'formik';
import { addUserValidation } from '../../utils/Validation';
import axios from 'axios';
import Modal from 'react-modal';
import { config } from '../../env-services';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../utils/Loader/Loader';
import toast from 'react-hot-toast';
import Select from "react-select";


const AddUser = () => {

    const navigate = useNavigate()

    const [passwordHandle , setPasswordHandle] = useState(false);    
    const [modalIsOpen ,  setModalIsOpen] = useState(false);
    const [userToken , setUserToken] = useState('');
    const [allRoles , setAllRoles] = useState([])


    useEffect(() => {
        getUserDetails();
        
    } , [])

    const getUserDetails = async () => {
        const response = localStorage.getItem("adminToken");
        if (!response) return;
    
        const userParse = JSON.parse(response);
        setUserToken(userParse);
        getAllRoles(userParse);
      };

      const getAllRoles = async (token) => {
        await axios.get(config.api + `admin/roles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response?.data?.data) {
                const alignedRoles = response?.data?.data.map((item) => ({
                  value: item._id,
                  label: item.name,
                }));
                setAllRoles(alignedRoles);
            }
      })
    }

    const userAddValues = {
        roleId: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobileNumber: ''
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

    // const handleAddUser = async () => {
    //     console.log(values)
    //     navigate('/business/add-business')
    // }

    const handleAddUser = async(values) => {
        console.log(values , "values")
        setModalIsOpen(true)
        try {
          await axios.post(`${config.api}admin/users` , values , {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
          })
          .then((response) => {
            if(response?.data?.success == true) {
                setModalIsOpen(false)
                toast.success('User Created Successfully');
                console.log( 'user create values' , response);
                navigate('/users')
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

    function numbersOnly(e) {
        var key = e.key;
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
          e.preventDefault();
        }
        else {
        //   console.log("You pressed a key: " + key);
        }
    }

  return (
    <div className='AddUser bg-DashboardGray w-full h-full min-h-screen '>
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
                <h4 className='font-medium '>Back</h4>
            </button>
            <div className="user-adding-form-section">
                <Formik
                    validationSchema={addUserValidation}
                    initialValues={userAddValues}
                    onSubmit={(values) => handleAddUser(values)}
                >
                    {({  errors, touched , handleSubmit , setFieldValue , values}) => (
                        <Form>
                            <div className="single-form-section-business business-basic-details rounded-[15px] bg-white">
                                <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                                    <h4 className='text-lg font-medium text-Secondary'>Add User</h4>
                                </div>
                                <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5">
                                    <div className="form-inputsec relative col-span-6">
                                        <div className="label-section mb-1">
                                            <p className='text-BusinessFormLabel'>Email*</p>
                                        </div>
                                        <Field type="email" name="email" placeholder='Enter Email Address'
                                            className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.email && touched.email ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                        />                                
                                    </div>
                                    <div className="form-inputsec relative col-span-6">
                                        <div className="label-section mb-1">
                                            <p className="text-BusinessFormLabel">
                                                Select User*
                                            </p>
                                        </div>
                                        <Select
                                            options={allRoles}
                                            placeholder="Slect Role"
                                            name="roleId"
                                            styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderRadius: 10,
                                                paddingLeft: 8,
                                                paddingTop: 4,
                                                paddingBottom: 4,
                                                borderWidth: 1,
                                                outlineWidth: 0,
                                                borderColor: errors.roleId ? "#FF4E4E" : "#B3B3B3",
                                                fontSize: 16,
                                                minWidth: "100%",
                                                height: 50,
                                                // borderColor: state.isFocused ? 'grey' : 'red',
                                                boxShadow: state.isFocused  ? "none" : "none",
                                            }),
                                            }}
                                            value={allRoles.find(
                                            (option) => option.value === values.userId
                                            )}
                                            onChange={(option) => { setFieldValue( "roleId", option ? option.value : "" );}}
                                        />
                                    </div>
                                    <div className="form-inputsec relative col-span-6">
                                        <div className="label-section mb-1">
                                            <p className='text-BusinessFormLabel'>First Name*</p>
                                        </div>
                                        <Field type="text" name="firstName" placeholder='Enter First Name'
                                            className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.firstName && touched.firstName ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                        />                                
                                    </div>
                                    <div className="form-inputsec relative col-span-6">
                                        <div className="label-section mb-1">
                                            <p className='text-BusinessFormLabel'>Last Name*</p>
                                        </div>
                                        <Field type="text" name="lastName" placeholder='Enter Last Name'
                                            className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.lastName && touched.lastName ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                        />                                
                                    </div>
                                    <div className="form-inputsec relative col-span-6">
                                        <div className="label-section mb-1">
                                            <p className='text-BusinessFormLabel'>Mobile Number*</p>
                                        </div>
                                        <Field type="tel" name="mobileNumber" placeholder='Enter Mobile Number' maxLength={10} onKeyPress={(e) => numbersOnly(e)}
                                            className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.mobileNumber && touched.mobileNumber ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                        />                                
                                    </div>
                                    <div className="form-inputsec  col-span-6">
                                        <div className="label-section mb-1">
                                            <p className='text-BusinessFormLabel'>Password*</p>
                                        </div>
                                        <div className="inner-form-input-section relative">
                                            <Field type={passwordHandle ? 'text' : 'password'} name="password" placeholder='Enter Password*'
                                                className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.password && touched.password ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                            />                                
                                            <button type="button" className="email-input-icon password-login-icon owa absolute right-4 top-1/2" onClick={() => setPasswordHandle(!passwordHandle)}>
                                                <i className={`${passwordHandle ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl text-LightText`}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom-form-submitter col-span-5  overflow-hidden relative group mt-6">
                                <button type='button' onClick={handleSubmit} className='w-full py-3 px-4 rounded-xl text-white font-semibold text-xl h-full bg-Primary disabled:bg-opacity-35 '>Add User</button>
                            </div>
                        </Form>
                    )} 
                </Formik>
            </div>
        </div>
    </div>
  )
}

export default AddUser