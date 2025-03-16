import React , { useState ,  useEffect } from 'react';
import './Login.scss';
import Logo from '../../../assets/images/logo-svg.svg'
import { adminLoginValidation } from '../../../utils/Validation';
import { Formik , Field , Form } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import EmailLogo from '../../../assets/images/email-icon.svg';
import axios from 'axios';
import { config } from '../../../env-services';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/AuthContext';
import Modal from 'react-modal';
import Loader from '../../../utils/Loader/Loader';


const Login = () => {

  const navigate = useNavigate();

    
  const { login } = useAuth();


  const [passwordHandle , setPasswordHandle] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [modalIsOpen ,  setModalIsOpen] = useState(false);

  const adminLoginValues = {
    email: '',
    password: '',
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

  const handleAdminLogin = async(values) => {
    const obj = {
      email: values.email,
      password: values.password
    }
    setModalIsOpen(true)
    try {
      await axios.post(`${config.api}auth/admin/authenticate` , obj)
      .then((response) => {
        console.log(response , 'userreg-res');
        if(response?.data?.data?.token) {
          setModalIsOpen(false)
            toast.success('Logged in Successfully');
            // console.log(response , 'userreg-res');
            const token = response?.data?.data?.token
            localStorage.setItem("adminToken", JSON.stringify(token));
            login(token)
            navigate('/')
        }else {
          setModalIsOpen(false)
          toast.error('Invalid Credentials');
        }
      })
      .catch((err) => {
        setModalIsOpen(false)
        toast.error(err?.message);
        toast.error(err?.response?.data?.message);
        console.log(err , 'error')
      });
    } catch (error) {
      setModalIsOpen(false)
      console.log(error)
    }
  }


  const handleCaptchaChange = (value) => {
    if (value) {
      console.log(value)
        setCaptchaVerified(true);
    } else {
        setCaptchaVerified(false);
    }
  };



  return (
    <div className="Login login-main-section flex items-center justify-center">
      <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
      >
          <Loader/>
      </Modal>
      <div className="inner-login-form-section w-[40%] bg-white rounded-3xl p-8 shadow-xl">
          <div className="top-logo-section text-center gap-y-4 mb-8 flex  justify-between">
            <img src={Logo} alt="" className='max-w-40 ' />
            <h2 className='text-2xl font-semibold text-left'>Admin Login</h2>
          </div>
          <div className="inner-login-main-form">
            <div className="user-login-in-form-section">
                <Formik
                    validationSchema={adminLoginValidation}
                    initialValues={adminLoginValues}
                    onSubmit={(values) => handleAdminLogin(values)}
                >
                    {({  errors, touched , handleSubmit}) => (
                    <Form>
                        <div className="form-inputsec relative">
                            <Field type="email" name="email" placeholder='Enter Email Address*'
                                className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 py-4 pl-16 pr-5 rounded-xl bg-white w-full text-Black  ${errors.email && touched.email ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                            />                                
                            <div className="email-input-icon pr-4 absolute left-4 top-1/2 w-[50px] ">
                                <img src={EmailLogo} className='max-w-[22px] mx-auto' alt="" />
                            </div>
                        </div>
                        <div className="password-forgot-password-section my-5">
                          <div className="form-inputsec relative">
                              <Field type={passwordHandle ? 'text' : 'password'} name="password" placeholder='Enter Password*'
                                  className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 py-4 pl-16 pr-5 rounded-xl bg-white w-full text-Black  ${errors.password && touched.password ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                              />                                
                              <div className="email-input-icon w-[50px] text-center pr-4 absolute left-4 top-1/2">
                                <i class="ri-lock-password-line text-2xl opacity-70 text-Black"></i>
                              </div>
                              <button type="button" className="email-input-icon password-login-icon owa absolute right-4 top-1/2" onClick={() => setPasswordHandle(!passwordHandle)}>
                                <i className={`${passwordHandle ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl text-LightText`}></i>
                              </button>
                          </div>
                          <div className="forgot-password-button mt-3">
                            <button type="button" className='text-sm text-Secondary text-medium'>Forgot Passowrd ?</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 mt-5 gap-x-5">
                          <div className="recaptcha-section col-span-7">
                            <ReCAPTCHA
                                sitekey="6LeQ-7cqAAAAANpdsCQ1MFxudbS4-gS7sBVw8vIT"
                                onChange={handleCaptchaChange}
                            />
                          </div>
                          <div className="bottom-form-submitter col-span-5  overflow-hidden relative group ">
                            <button type='submit' disabled={!captchaVerified} onClick={handleSubmit} className='w-full py-3 px-4 rounded-xl text-white font-semibold text-lg h-full bg-Primary disabled:bg-opacity-35 '>Login</button>
                          </div>
                        </div>
                    </Form>
                    )}
                </Formik>
            </div>
          </div>
      </div>
    </div>
  );
}

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
