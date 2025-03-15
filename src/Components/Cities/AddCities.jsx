import React , {useState , useEffect , useRef}  from "react";
import Select from 'react-select';
import axios from 'axios';
import Modal from 'react-modal';
import { config } from '../../env-services';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../utils/Loader/Loader';
import toast from 'react-hot-toast';
import { addCitiesValidation } from "../../utils/Validation";
import { Formik, Field, Form } from "formik";



const AddCities = () => {

    const navigate = useNavigate()

    
    const [modalIsOpen ,  setModalIsOpen] = useState(false);
    const [allStates , setAllStates] = useState([])



    useEffect(() => {
        getStates()
    }, [])

    const addCityValues = {
        state: '',
        city: ''
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


      const getStates = async () => {
        await axios
          .get(config.api + "locations/countries/678da88c9c4467c6aa4eeb86/states")
          .then((response) => {
            if (response?.data?.data) {
              const formattedStates = response?.data?.data.map((item) => ({
                value: item._id,
                label: item.name,
              }));
    
              setAllStates(formattedStates);
            }
          });
      };


    const handleAddCity = async (values) => {
        // console.log(values)
        const formData = new FormData();
        formData.append("stateId" , values.state);
        formData.append("name" , values.city)
        
        console.log(formData);
        setModalIsOpen(true)

        try {
            await axios.post(`${config.api}admin/cities` , formData)
            .then((response) => {
              if(response?.data?.success == true) {
                  setModalIsOpen(false)
                  toast.success('City Created Successfully');
                  console.log( 'user create values' , response);
                  navigate('/cities')
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
    <div className="add-advertisement mani-add-business-section bg-DashboardGray w-full h-full min-h-screen">
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Loader />
      </Modal>
      <div className="inner-add-business-section  pl-[270px] py-8 pr-8">
        <button
          type="button"
          className="goback-button-sec flex items-center gap-x-4 mb-5"
          onClick={() => navigate(-1)}
        >
          <div className="backarrow-sec w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <i className="ri-arrow-left-line text-xl"></i>
          </div>
          <h4 className="font-medium ">Back to All Cities</h4>
        </button>
        <div className="inner-main-business-form-section">
          <div className="">
            <div className="bottom-form-section-business-add">
              <div className="inner-business-form-section">
                <div className="single-form-section-business">
                  <Formik
                    validationSchema={addCitiesValidation}
                    initialValues={addCityValues}
                    onSubmit={(values) => handleAddCity(values)}
                  >
                    {({ errors, touched, handleSubmit, setFieldValue, values }) => (
                      <Form>
                        <div className="main-business-former-sec flex flex-col gap-10">
                          <div className="single-form-section-business business-basic-details  rounded-[15px] bg-white">
                            <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                              <h4 className="text-lg font-medium text-Secondary">
                                Select State to add city
                              </h4>
                            </div>
                            <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5 items-end">
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className="text-BusinessFormLabel">
                                    State*
                                  </p>
                                </div>
                                <Select
                                  options={allStates}
                                  placeholder="Slect State"
                                  name="state"
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderRadius: 10,
                                      paddingLeft: 8,
                                      paddingTop: 4,
                                      paddingBottom: 4,
                                      borderWidth: 1,
                                      outlineWidth: 0,
                                      borderColor: errors.userId ? "#FF4E4E" : "#B3B3B3",
                                      fontSize: 16,
                                      minWidth: "100%",
                                      height: 50,
                                      // borderColor: state.isFocused ? 'grey' : 'red',
                                      boxShadow: state.isFocused  ? "none" : "none",
                                    }),
                                  }}
                                  value={allStates.find(
                                    (option) => option.value === values.state
                                  )}
                                  onChange={(option) => { setFieldValue( "state", option ? option.value : "" );}}
                                />
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className="text-BusinessFormLabel">
                                    City Name*
                                  </p>
                                </div>
                                <Field
                                  type="text" name="city" placeholder="Enter City Name*" className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${
                                    errors.city && touched.city
                                      ? "border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500"
                                      : "text-Black border-LoginFormBorder placeholder:text-Black"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="bottom-form-submitter col-span-5  overflow-hidden relative group ">
                            <button type="button" onClick={handleSubmit} className="w-full py-4 px-4 rounded-xl text-white font-semibold text-lg h-full bg-Primary disabled:bg-opacity-35 ">
                              Add City
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCities;
