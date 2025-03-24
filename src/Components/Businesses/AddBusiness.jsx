import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Businesses.scss";
import { Formik, Form, Field } from "formik";
import { businessFormAddValidation } from "../../utils/Validation";
import Select from "react-select";
import FileUploadIcon from "../../assets/images/file-upload-icon.svg";
import makeAnimated from "react-select/animated";
import VegIcon from "../../assets/images/veg-icon.svg";
import NonVegIcon from "../../assets/images/non-veg-icon.svg";
import MapIcon from "../../assets/images/maps-icon-input.svg";
import axios from "axios";
import Modal from "react-modal";

import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { config } from "../../env-services";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../utils/Loader/Loader";
import toast from "react-hot-toast";

const animatedComponents = makeAnimated();

const GOOGLE_MAPS_API_KEY = "AIzaSyCfHCytpE0Oq4tvXmCWaOl05iyH_OfLGuM";

const AddBusiness = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const receivedMail = location.state?.readEmail || "";
  const receivedToken = location.state?.token || "";

  const [businessDoc, setBusinessDoc] = useState();
  const [multiAmentites, setMultiAmenities] = useState();
  const [businessPhotos, setBusinessPhotos] = useState([]);
  const [foodItemsArray, setFoodItemsArray] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 17.0005, lng: 81.804 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [busCates, setBusCates] = useState([]);
  const [busAmenities, setBusAmenities] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);

  const [userToken, setUserToken] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [socialMediaInput, setSocialMediaInput] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [customTagInput , setCustomTagInput] = useState('');
  const [customTags , setCustomTags] = useState([]);
  const [localityArea , setLocalityArea] = useState('');
  const [localityCase2 , setLocalityCase2] = useState('')



  useEffect(() => {
    getAllCategories();
    getAllAmenities();
    getStates();
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const response = localStorage.getItem("adminToken");
    if (!response) return;

    const userParse = JSON.parse(response);
    setUserToken(userParse);
    getAllUsers(userParse);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      borderRadius: 18,
      paddingLeft: 40,
    },
  };

  const isValidURL = (url) => {
    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/[\w\d-./?%&=]*)?$/;
      return urlPattern.test(url);
  };

  const addSocialMediaLink = () => {
      if (!socialMediaInput.trim()) {
          alert("Please enter a URL");
          return;
      }

      if (!isValidURL(socialMediaInput)) {
          alert("Please enter a valid URL");
          return;
      }

      setSocialMediaLinks([...socialMediaLinks, socialMediaInput]);
      setSocialMediaInput(""); 
      setError(""); 
  };

  const removeSocialMediaLink = (index) => {
      setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
  };


  const getAllUsers = async (token) => {
    await axios
      .get(`${config.api}admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response , "All Users")
        if (response?.data?.data) {
          const alignedUsers = response?.data?.data.map((item) => ({
            value: item._id,
            label: item.email,
          }));
          setAllUsers(alignedUsers);
        }
      });
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(config.api + `business-category`);
      const categories = response?.data?.data.map((item) => ({
        value: item._id,
        label: item.name,
      }));

      setBusCates(categories);
      // console.log('Formatted Categories:', categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllAmenities = async () => {
    try {
      const response = await axios.get(config.api + `business-amenity`);
      const amenities = response?.data?.data.map((item) => ({
        value: item._id,
        label: item.name,
      }));

      setBusAmenities(amenities);
      // console.log('Formatted amenities:', amenities);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
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

          setStates(formattedStates);
        }
      });
  };

  const getCities = async (id) => {
    await axios
      .get(config.api + `locations/states/${id}/cities`)
      .then((response) => {
        if (response?.data?.data) {
          const formattedCities = response?.data?.data.map((item) => ({
            value: item._id,
            label: item.name,
          }));
          setCities(formattedCities);
        }
      });
  };

  const getPincodes = async (id) => {
    console.log(id);
    await axios
      .get(config.api + `locations/cities/${id}/pincodes`)
      .then((response) => {
        if (response?.data?.data) {
          const formattedCities = response.data.data.map((item) => ({
            value: item._id,
            label: item.code,
          }));
          setPincodes(formattedCities);
        }
      });
  };

  const inputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handlePlacesChange = () => {
    const places = inputRef.current.getPlaces();
    if (places.length > 0) {
      const location = places[0].geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      
      // Extract area/locality
    let sublocality = "";
    let locality = "";

    places[0].address_components.forEach((component) => {
      if (component.types.includes("sublocality_level_1")) {
        sublocality = component.long_name
      } else if (component.types.includes("locality")) {
        locality = component.long_name
      }
    });

    setLocalityArea(`${sublocality} , ${locality}`)

      setMapCenter({ lat, lng });
      setSelectedLocation({ lat, lng });
    }
  };

  // console.log(selectedLocation , "selectedLocation")

  const businessAddValues = {
    userName: "",
    businessName: "",
    businessState: "",
    businessCity: "",
    businessTitle: "",
    aboutBusiness: "",
    businessCategory: "",
    mobileNumber: "",
    workingHours: "",
    servicesOffer: "",
    email: "",
    socialMedia: "",
    completeAddress: "",
    landmark: "",
    pincode: "",
    yearlyTurnOver: "",
    noOfEmployees: "",
    yearOfEstablishment: "",
    websiteAddress: "",
    GSTNumber: "",
    itemName: "",
    itemType: "",
    itemPrice: "",
    userId: "",
  };

  const workingHours = [
    { value: "10:00 AM - 6:00 PM 8Hrs", label: "10:00 AM - 6:00 PM 8Hrs" },
    { value: "09:00 AM - 6:00 PM 9Hrs", label: "09:00 AM - 6:00 PM 9Hrs" },
    { value: "10:00 AM - 10:00 PM 12Hrs", label: "10:00 AM - 10:00 PM 12Hrs" },
  ];

  const servicesOffered = [
    { value: "B2B", label: "B2B (Business-to-Business)" },
    { value: "B2C", label: "B2C (Business-to-Consumer)" },
    { value: "Both", label: "Both" },
  ];

  const foodItemTypes = [
    { value: "Veg", label: "Veg" },
    { value: "Non-Veg", label: "Non-Veg" },
  ];

  const handleBusinessDocFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 4 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 4MB. Please upload a smaller file.");
        return;
      }
      setBusinessDoc(file);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 2MB and will not be uploaded.`);
        return false;
      }
      return file.type === "image/jpeg" || file.type === "image/png";
    });

    const base64Photos = await Promise.all(
      validFiles.map((file) => fileToBase64(file))
    );
    setBusinessPhotos((prevPhotos) => [...prevPhotos, ...base64Photos]);
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
    setFoodItemsArray((prevFoodItemsArray) => [
      ...prevFoodItemsArray,
      newFoodItem,
    ]);
  };

  const removeFoodItem = (index) => {
    setFoodItemsArray((prevFoodItemsArray) =>
      prevFoodItemsArray.filter((_, i) => i !== index)
    );
  };

  const handleRemoveImage = (indexToRemove) => {
    setBusinessPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const addCustomTags = () => {
    setCustomTags([...customTags, customTagInput]);
    setSocialMediaInput(""); 
  }

  const removeBusinessTags = (index) => {
    setCustomTags(customTags.filter((_, i) => i !== index));
  };

  function numbersOnly(e) {
    var key = e.key;
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      e.preventDefault();
    } else {
      console.log("You pressed a key: " + key);
    }
  }

  const handleAddingBusiness = async (data) => {
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("name", data.businessName);
    formData.append("title", data.businessTitle);
    formData.append("about" , data.aboutBusiness);
    formData.append("mobileNumber", data.mobileNumber);
    formData.append("area" , localityArea ? localityArea : localityCase2);
    formData.append("email", data.email);
    customTags.forEach((items) => {
      formData.append('tags' , items);
    })
    socialMediaLinks.forEach((items) => {
      formData.append('socialMediaLink' , items);
    })
    formData.append("categoryId", data.businessCategory);
    formData.append("yearlyTurnOver", data.yearlyTurnOver);
    formData.append("noOfEmployees", data.noOfEmployees);
    formData.append("yearOfEstablishment", data.yearOfEstablishment);
    formData.append("websiteAddress", data.websiteAddress);
    formData.append("GSTNumber", data.GSTNumber);
    multiAmentites.forEach((amenities) => {
      console.log(amenities);
      formData.append("amenities", amenities.value);
    });
    formData.append("servicesOffer", data.servicesOffer);
    formData.append("stateId", data.businessState);
    formData.append("cityId", data.businessCity);
    formData.append("pincodeId", data.pincode);
    formData.append("completeAddress", data.completeAddress);
    formData.append("landmark", data.landmark);
    formData.append("workingHours", data.workingHours);
    formData.append("file", businessDoc);
    formData.append("latitude", selectedLocation?.lat);
    formData.append("longitude", selectedLocation?.lng);
    formData.append("userId", data.userId);

    console.log("formData", formData);
    setModalIsOpen(true);
    try {
      await axios
        .post(`${config.api}admin/business`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response?.data?.status == "success") {
            toast.success("Business Created Successfully");
            setModalIsOpen(false);
            const busId = response?.data?.data?._id;
            navigate("/business/add-photos", { state: { busId } });
          } else {
            toast.error("Error in Creating business");
            setModalIsOpen(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setModalIsOpen(false);
        });
      console.log("Response:", response.data);
    } catch (error) {
      setModalIsOpen(false);
    }
  };

  return (
    <div className="AddBusinesses mani-add-business-section bg-DashboardGray w-full min-h-screen h-full">
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
          onClick={() => navigate("/business")}
        >
          <div className="backarrow-sec w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <i className="ri-arrow-left-line text-xl"></i>
          </div>
          <h4 className="font-medium ">Back to businesses</h4>
        </button>

        <div className="inner-main-business-form-section">
          <div className="">
            <div className="bottom-form-section-business-add">
              <div className="inner-business-form-section">
                <div className="single-form-section-business">
                  <Formik
                    validationSchema={businessFormAddValidation}
                    initialValues={businessAddValues}
                    onSubmit={(values) => handleAddingBusiness(values)}
                  >
                    {({errors, touched, handleSubmit, setFieldValue, values}) => (
                      <Form>
                        <div className="main-business-former-sec flex flex-col gap-10">
                          <div className="single-form-section-business business-basic-details  rounded-[15px] bg-white">
                            <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                              <h4 className="text-lg font-medium text-Secondary">
                                Select a user to create a business
                              </h4>
                            </div>
                            <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5 items-end">
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className="text-BusinessFormLabel">
                                    Select User*
                                  </p>
                                </div>
                                <Select
                                  options={allUsers}
                                  placeholder="Slect User"
                                  name="userId"
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
                                  value={allUsers.find(
                                    (option) => option.value === values.userId
                                  )}
                                  onChange={(option) => { setFieldValue( "userId", option ? option.value : "" );}}
                                />
                              </div>
                              <div className="right-create-business-for-new-user col-span-6">
                                <div className="inner-create-new-user">
                                  <div className="bottom-form-submitter overflow-hidden relative group ">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigate("/users/add-user")
                                      }
                                      className="w-full py-4 px-4 rounded-xl  font-semibold text-lg h-full bg-white border border-Secondary  text-Secondary disabled:bg-opacity-35 "
                                    >
                                      Create New User
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="single-form-section-business business-basic-details overflow-hidden rounded-[15px] bg-white">
                            <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                              <h4 className='text-lg font-medium text-Secondary'>Basic Details</h4>
                            </div>
                            <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5">
                              <div className="form-inputsec relative col-span-4">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>User Name (optional)</p>
                                </div>
                                <Field type="text" name="userName" placeholder='Enter User Name'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.userName && touched.userName ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-8">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Business Name*</p>
                                </div>
                                <Field type="text" name="businessName" placeholder='Enter Business Name*'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.businessName && touched.businessName ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-12">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Business Title (optional)</p>
                                </div>
                                <Field type="text" name="businessTitle" placeholder='Enter Business Title (optional)'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black border-LoginFormBorder placeholder:text-Black`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-12">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>About your business (Optional)</p>
                                </div>
                                <Field as="textarea" name="aboutBusiness" placeholder='Enter about your business'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 h-32 resize-none rounded-lg bg-white w-full text-Black  ${errors.aboutBusiness && touched.aboutBusiness ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                            </div>
                          </div>
                          <div className="single-form-section-business business-basic-details overflow-hidden rounded-[15px] bg-white">
                            <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                              <h4 className='text-lg font-medium text-Secondary'>Contact Information</h4>
                            </div>
                            <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5">
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Mobile Number (optional)</p>
                                </div>
                                <Field type="tel" name="mobileNumber" placeholder='Enter Mobile Number' maxLength={10} onKeyPress={(e) => numbersOnly(e)}
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.mobileNumber && touched.mobileNumber ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Email Address (optional)</p>
                                </div>
                                <Field type="email" name="email" placeholder='Enter Email Address'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.email && touched.email ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-12">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Social Media Links (optional)</p>
                                </div>
                                <div className="social-media-adding-section relative">
                                  <Field type="text" name="socialMedia" placeholder='Enter Social Media Link' onKeyUp={(e) => setSocialMediaInput(e.target.value)} 
                                      className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black ${errors.socialMedia  ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                  />
                                  <button type="button" onClick={addSocialMediaLink}  className='absolute social-media-adding-button top-1/2 right-1 py-2 px-8 rounded-lg bg-white text-Secondary'>Add Link</button>
                                </div>                                      
                              </div>
                              {socialMediaLinks.map((items , index) => {
                                return (
                                  <div className="social-meida-links-displayer col-span-12">
                                    <div className="left-side-link-icon flex items-center justify-between bg-LightGrayBg rounded-[5px] py-2 px-4">
                                        <div className="text-link-icon-outer flex items-center gap-4">
                                          <i className="ri-link text-lg text-Secondary"></i>
                                          <div className="right-text">
                                              <p className='text-Secondary font-medium'>{items}</p>
                                          </div>
                                        </div>
                                        <div className="remove-link-btn"><button type="button" onClick={() => removeSocialMediaLink(index)} className='w-6 h-6 rounded-full flex items-center justify-center bg-red-100'><i className="ri-close-large-line text-red-600"></i></button></div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <div className="single-form-section-business business-basic-details rounded-[15px] bg-white">
                            <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                              <h4 className='text-lg font-medium text-Secondary'>Address Information</h4>
                            </div>
                            <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5">
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Select Sate (Optional)</p>
                                </div>
                                <Select options={states} 
                                  placeholder='Choose State'
                                  name='businessState'
                                  styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: 10,
                                        paddingLeft: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderWidth: 1,
                                        outlineWidth: 0,
                                        // borderColor: errors.businessState ? '#FF4E4E' : '#B3B3B3',
                                        fontSize: 16,
                                        minWidth: '100%',
                                        height: 50,
                                        // borderColor: state.isFocused ? 'grey' : 'red',
                                        boxShadow: state.isFocused ? 'none' : 'none',
                                        
                                      }),
                                    }}
                                  value={states.find(option => option.value === values.businessState)} 
                                  onChange={(option) => {setFieldValue('businessState', option ? option.value : '') , getCities(option.value)}}
                                  
                                />                               
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Select City (Optional)</p>
                                </div>
                                <Select options={cities} 
                                  placeholder='Choose City'
                                  name='businessCity'
                                  styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: 10,
                                        paddingLeft: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderWidth: 1,
                                        outlineWidth: 0,
                                        // borderColor: errors.businessCity ? '#FF4E4E' : '#B3B3B3',
                                        fontSize: 16,
                                        minWidth: '100%',
                                        height: 50,
                                        // borderColor: state.isFocused ? 'grey' : 'red',
                                        boxShadow: state.isFocused ? 'none' : 'none',
                                        
                                      }),
                                    }}
                                  value={cities.find(option => option.value === values.businessCity)} 
                                  onChange={(option) => { console.log(option) , setFieldValue('businessCity', option ? option.value : '') , getPincodes(option.value)}}
                                />                               
                              </div>
                              <div className="form-inputsec relative col-span-12">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Complete Address (Optional)</p>
                                </div>
                                <Field as="textarea" name="completeAddress" placeholder='Enter Complete Address'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 h-32 resize-none rounded-lg bg-white w-full text-Black  ${errors.completeAddress && touched.completeAddress ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Landmark (optional)</p>
                                </div>
                                <Field type="text" name="landmark" placeholder='Enter Landmark '
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.landmark && touched.landmark ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Pincode (Optional)</p>
                                </div>
                                <Select options={pincodes} 
                                  placeholder='Choose Pincode'
                                  name='pincode'
                                  styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: 10,
                                        paddingLeft: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderWidth: 1,
                                        outlineWidth: 0,
                                        // borderColor: errors.businessCity ? '#FF4E4E' : '#B3B3B3',
                                        fontSize: 16,
                                        minWidth: '100%',
                                        height: 50,
                                        // borderColor: state.isFocused ? 'grey' : 'red',
                                        boxShadow: state.isFocused ? 'none' : 'none',
                                        
                                      }),
                                    }}
                                  value={pincodes.find(option => option.value === values.pincode)} 
                                  onChange={(option) => setFieldValue('pincode', option ? option.value : '')}
                                />                                    
                              </div>
                            </div>
                          </div>
                          <div className="single-form-section-business business-basic-details overflow-hidden rounded-[15px] bg-white">
                            <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                              <h4 className='text-lg font-medium text-Secondary'>Detailed Business Address</h4>
                            </div>
                            <div className="inner-fields-grid-outer-main p-6 ">
                              {isLoaded && 
                                <>
                                  <StandaloneSearchBox
                                    onLoad={(ref) => inputRef.current = ref}
                                    onPlacesChanged={handlePlacesChange}
                                  >
                                    <div className="google-search-map-input-sec relative">
                                      <div className="left-map-icon absolute left-6 top-1/2">
                                        <img src={MapIcon} className='w-6 h-6 object-contain' alt="" />
                                      </div>
                                      <input type="text" placeholder="Search for a place..." className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 pl-12 pr-5 py-3 rounded-lg bg-white w-full text-Black `} />
                                    </div>
                                  </StandaloneSearchBox>
                                  <div className="google-map-section-business-form rounded-xl overflow-hidden mt-5">
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '300px' }}
                                        center={mapCenter}
                                        zoom={14}
                                      >
                                        {selectedLocation && <Marker position={selectedLocation} />}
                                    </GoogleMap>
                                  </div>
                                  <div className="area-field-section-inner mt-5">
                                    <div className="top-label-section-area mb-1">
                                      <p>Area or Locality</p>
                                    </div>
                                    <input type="text" value={localityArea ? localityArea : localityCase2} disabled placeholder="Search for a place..." className={`outline-none border border-Black border-opacity-30 focus:border-Secondary focus:bg-LightBlue duration-300 pl-6 pr-5 py-3 rounded-lg bg-white w-full text-Black `} />
                                  </div>
                                </>
                              }
                            </div>
                          </div>
                          <div className="single-form-section-business business-basic-details rounded-[15px] bg-white">
                            <div className="basic-details-heading py-[15px] px-6 border-b border-black border-opacity-20">
                              <h4 className='text-lg font-medium text-Secondary'>Business Information</h4>
                            </div>
                            <div className="inner-fields-grid-outer-main p-6 grid grid-cols-12 gap-5">
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Yearly Turnover (Optional)</p>
                                </div>
                                <Field type="text" name="yearlyTurnOver" placeholder='Enter Yearly Turnover'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.yearlyTurnOver && touched.yearlyTurnOver ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Number of Employees (Optional)</p>
                                </div>
                                <Field type="number" name="noOfEmployees" placeholder='Enter Number of Employees'
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.noOfEmployees && touched.noOfEmployees ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Year of Establishment (Optional)</p>
                                </div>
                                <Field type="text" name="yearOfEstablishment" placeholder='Enter Year of Establishment '
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.yearOfEstablishment && touched.yearOfEstablishment ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Website Address(optional)</p>
                                </div>
                                <Field type="text" name="websiteAddress" placeholder='Enter Website URL '
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.websiteAddress && touched.websiteAddress ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>GST Number(optional)</p>
                                </div>
                                <Field type="text" name="GSTNumber" placeholder='Enter GST Number '
                                    className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black  ${errors.GSTNumber && touched.GSTNumber ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                />                                
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Business Registration Documents (optional)</p>
                                </div>
                                <div className="file-upload-outer-section-custom bg-ProfileScreensBg rounded-10p overflow-hidden relative h-50p">
                                    <input type="file" name="" id="" onChange={(e) => handleBusinessDocFile(e)} className={`h-full w-full opacity-0 relative z-10 cursor-pointer ${businessDoc ? 'hidden' : 'block'}`}/>
                                    {businessDoc ? 
                                      <div className="inner-file-upload-butifier absolute top-1/2 left-1/2 w-full flex items-center px-5 gap-x-5 justify-between">
                                        <p className='text-Black'>{businessDoc?.name}</p>
                                        <button type="button" onClick={() => setBusinessDoc('')} className='w-7 h-7 bg-white rounded-full flex items-center justify-center'><i className="ri-close-large-fill text-red-500"></i></button>
                                      </div> : 
                                      <div className="inner-file-upload-butifier absolute top-1/2 left-1/2 w-full flex items-center px-5 gap-x-5">
                                        <img src={FileUploadIcon} className='w-7 h-7' alt="" />
                                        <p className='text-Black'>Click to Upload Registration document</p>
                                      </div>
                                    }
                                </div>                             
                              </div>
                              <div className="form-inputsec relative col-span-12 z-[99999999]">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Amenities (Optional)</p>
                                </div>
                                <Select options={busAmenities} 
                                  placeholder='Select Amenities'
                                  isMulti
                                  components={animatedComponents}
                                  closeMenuOnSelect={false}
                                  styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: 10,
                                        paddingLeft: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderWidth: 1,
                                        outlineWidth: 0,
                                        borderColor: '#B3B3B3',
                                        fontSize: 16,
                                        minWidth: '100%',
                                        minHeight: 50,
                                        // borderColor: state.isFocused ? 'grey' : 'red',
                                        boxShadow: state.isFocused ? 'none' : 'none',
                                      }),
                                    }}
                                  value={multiAmentites ? multiAmentites : null}
                                  onChange={(option) => setMultiAmenities(option)}
                                />                               
                              </div>
                              <div className="form-inputsec relative col-span-6 z-[9999999]">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Working Hours (Optional)</p>
                                </div>
                                <Select options={workingHours} 
                                  placeholder='Select Working Hours'
                                  name='workingHours'
                                  styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: 10,
                                        paddingLeft: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderWidth: 1,
                                        outlineWidth: 0,
                                        // borderColor: errors.workingHours ? '#FF4E4E' : '#B3B3B3',
                                        fontSize: 16,
                                        minWidth: '100%',
                                        minHeight: 50,
                                        // borderColor: state.isFocused ? 'grey' : 'red',
                                        boxShadow: state.isFocused ? 'none' : 'none',
                                      }),
                                    }}
                                  value={workingHours.find(option => option.value === values.workingHours)} 
                                  onChange={(option) => setFieldValue('workingHours', option ? option.value : '')}
                                />                               
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Services Offered (Optional)</p>
                                </div>
                                <Select options={servicesOffered} 
                                  placeholder='Select Services Offered'
                                  styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: 10,
                                        paddingLeft: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderWidth: 1,
                                        outlineWidth: 0,
                                        // borderColor: errors.servicesOffer ? '#FF4E4E' : '#B3B3B3',
                                        fontSize: 16,
                                        minWidth: '100%',
                                        minHeight: 50,
                                        // borderColor: state.isFocused ? 'grey' : 'red',
                                        boxShadow: state.isFocused ? 'none' : 'none',
                                      }),
                                    }}
                                  value={servicesOffered.find(option => option.value === values.servicesOffer)} 
                                  onChange={(option) => setFieldValue('servicesOffer', option ? option.value : '')}
                                />                               
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Business Category (Optional)</p>
                                </div>
                                <div className="poitions-relative relative ">
                                <Select options={busCates} 
                                  placeholder='Select Business Category'
                                  name='businessCategory'
                                  styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: 10,
                                        paddingLeft: 8,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderWidth: 1,
                                        outlineWidth: 0,
                                        // borderColor: errors.businessCategory ? '#FF4E4E' : '#B3B3B3',
                                        fontSize: 16,
                                        minWidth: '100%',
                                        height: 50,
                                        // borderColor: state.isFocused ? 'grey' : 'red',
                                        boxShadow: state.isFocused ? 'none' : 'none',
                                        
                                      }),
                                    }}
                                  value={busCates.find(option => option.value === values.businessCategory)} 
                                  onChange={(option) => {setFieldValue('businessCategory', option ? option.value : '')}}
                                />    
                                </div>                             
                              </div>
                              <div className="form-inputsec relative col-span-6">
                                <div className="label-section mb-1">
                                  <p className='text-BusinessFormLabel'>Business Tags (optional)</p>
                                </div>
                                <div className="social-media-adding-section relative">
                                  <Field type="text" name="businessTags" placeholder='Enter relevant business tags' onKeyUp={(e) => setCustomTagInput(e.target.value)} 
                                      className={`outline-none border focus:border-Secondary focus:bg-LightBlue duration-300 px-5 py-3 rounded-lg bg-white w-full text-Black ${errors.socialMedia  ? 'border-red-500 border-opacity-100 bg-red-500 bg-opacity-10 placeholder:text-red-500 text-red-500' : 'text-Black border-LoginFormBorder placeholder:text-Black'}`} 
                                  />
                                  <button type="button" onClick={addCustomTags}  className='absolute social-media-adding-button top-1/2 right-1 py-2 px-8 rounded-lg bg-white text-Secondary border border-Black border-opacity-40'>Add</button>
                                </div>                                      
                              </div>
                              {customTags.length > 0 ? 
                              <div className="col-span-12">
                                <div className="business-tags-section-grid-sec grid grid-cols-12 gap-4">
                                  {customTags.map((items , index) => {
                                    return (
                                      <div className="social-meida-links-displayer col-span-3">
                                        <div className="left-side-link-icon flex items-center justify-between bg-LightGrayBg bg-opacity-70 rounded-[8px] py-2 px-4">
                                            <div className="right-text">
                                                <p className='text-Secondary font-medium'>{items}</p>
                                            </div>
                                            <div className="remove-link-btn"><button type="button" onClick={() => removeBusinessTags(index)} className='w-6 h-6 rounded-full flex items-center justify-center bg-red-100'><i className="ri-close-large-line text-red-600"></i></button></div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div> : null
                              }
                            </div>
                          </div>
                          <div className="bottom-form-submitter col-span-5  overflow-hidden relative group ">
                            <button
                              type="button"
                              onClick={handleSubmit}
                              className="w-full py-5 px-4 rounded-xl text-white font-semibold text-xl h-full bg-Primary disabled:bg-opacity-35 "
                            >
                              Submit Business Listing
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

AddBusiness.propTypes = {};

AddBusiness.defaultProps = {};

export default AddBusiness;
