import React, { useState, useEffect, useRef } from "react";
import BusinessOwner from "../../assets/images/business-owner-pic.jpg";
import GmailIcon from "../../assets/images/gmail-icon.svg";
import VegIcon from "../../assets/images/veg-icon.svg";
import NonVegIcon from "../../assets/images/non-veg-icon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./Businesses.scss";
import { Formik, Form, Field } from "formik";
import { businessFormAddValidation } from "../../utils/Validation";
import Select from "react-select";
import FileUploadIcon from "../../assets/images/file-upload-icon.svg";
import makeAnimated from "react-select/animated";
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
import EmptyImage from "../../assets/images/empty-image-bg.jpg";

// Sharing-images
import FacebookShare from "../../assets/images/facebook-share.svg";
import InstagramShare from "../../assets/images/instagram-share.svg";
import WhatsappShare from "../../assets/images/whatsapp-share.svg";
import TelegramShare from "../../assets/images/telegram-share.svg";

const animatedComponents = makeAnimated();

const GOOGLE_MAPS_API_KEY = "AIzaSyCfHCytpE0Oq4tvXmCWaOl05iyH_OfLGuM";

const BusinessDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const receivedData = location.state?.items || "";

  const [businessDoc, setBusinessDoc] = useState();
  const [multiAmentites, setMultiAmenities] = useState();
  const [businessPhotos, setBusinessPhotos] = useState([]);
  const [foodItemsArray, setFoodItemsArray] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 17.0005, lng: 81.804 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const [busCates, setBusCates] = useState([]);
  const [busAmenities, setBusAmenities] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);

  const [userToken, setUserToken] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [socialMediaInput, setSocialMediaInput] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [singleBusiness, setSingleBusiness] = useState({});
  const [deletModal, setDeleteModal] = useState(false);
  const [deletModalData, setDeleteModalData] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(false);

  useEffect(() => {
    getAllCategories();
    getAllAmenities();
    getStates();
    getUserDetails();
  }, []);

  useEffect(() => {
    getCities(singleBusiness?.state?._id);
    getPincodes(singleBusiness?.pincode?._id);
  }, []);

  const foodItems = [
    {
      title: "Mixed Vegetable Biryani",
      veg: true,
      pirce: "₹200.00",
    },
    {
      title: "Chicken Biryani",
      veg: false,
      pirce: "350.00",
    },
    {
      title: "Schezwan Fried Rice",
      veg: false,
      pirce: "₹460.00",
    },
    {
      title: "Paneer Biryani",
      veg: true,
      pirce: "₹200.00",
    },
  ];

  const long = singleBusiness?.location?.coordinates[0];
  const lat = singleBusiness?.location?.coordinates[1];

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${lat},${long}`;
    window.open(url, "_blank");
  };

  // -----------------------------------------------

  const getUserDetails = async () => {
    const response = localStorage.getItem("adminToken");
    if (!response) return;

    const userParse = JSON.parse(response);
    setUserToken(userParse);
    getAllUsers(userParse);
    getBusinessData(userParse);
  };

  const getBusinessData = async (token) => {
    setModalIsOpen(true);
    try {
      await axios
        .get(`${config.api}admin/business/${receivedData?._id}`, {
          headers: {
            Authorization: "Bearer " + token,
            "content-type": "application/json",
          },
        })
        .then((response) => {
          console.log("response", response);
          setModalIsOpen(false);
          setSingleBusiness(response?.data?.data);
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

  const customStyles2 = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      borderRadius: 18,
      paddingLeft: 20,
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

      setMapCenter({ lat, lng });
      setSelectedLocation({ lat, lng });
      // console.log(`Selected Location: Latitude: ${lat}, Longitude: ${lng}`);
    }
  };

  const businessAddValues = {
    userName: receivedData?.userName || "",
    businessName: receivedData?.name || "",
    businessState: receivedData?.stateId?._id || "",
    businessCity: receivedData?.cityId?._id || "",
    businessTitle: receivedData?.title || "",
    businessCategory: receivedData?.categoryId?._id || "",
    mobileNumber: receivedData?.mobileNumber || "",
    workingHours: receivedData?.workingHours || "",
    servicesOffer: receivedData?.servicesOffer || "",
    email: receivedData?.email || "",
    socialMedia: "",
    completeAddress: receivedData?.completeAddress || "",
    landmark: receivedData?.landmark || "",
    pincode: receivedData?.pincodeId?._id || "",
    yearlyTurnOver: receivedData?.yearlyTurnOver || "",
    noOfEmployees: receivedData?.noOfEmployees || "",
    yearOfEstablishment: receivedData?.yearOfEstablishment || "",
    websiteAddress: receivedData?.websiteAddress || "",
    GSTNumber: receivedData?.GSTNumber || "",
    itemName: "",
    itemType: "",
    itemPrice: "",
    userId: receivedData?.userId?._id || "",
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

  function numbersOnly(e) {
    var key = e.key;
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      e.preventDefault();
    } else {
      // console.log("You pressed a key: " + key);
    }
  }

  const handleAddingBusiness = async (data) => {
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("name", data.businessName);
    formData.append("title", data.businessTitle);
    formData.append("mobileNumber", data.mobileNumber);
    formData.append("email", data.email);
    socialMediaLinks.forEach((items) => {
      formData.append("socialMediaLink", items);
    });
    formData.append("categoryId", data.businessCategory);
    formData.append("yearlyTurnOver", data.yearlyTurnOver);
    formData.append("noOfEmployees", data.noOfEmployees);
    formData.append("yearOfEstablishment", data.yearOfEstablishment);
    formData.append("websiteAddress", data.websiteAddress);
    formData.append("GSTNumber", data.GSTNumber);
    multiAmentites.forEach((amenities) => {
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

    // console.log("formData", formData);
    setModalIsOpen(true);
    try {
      await axios
        .post(`${config.api}admin/business`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          // console.log(response);
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
      //  console.log("Response:", response.data);
    } catch (error) {
      setModalIsOpen(false);
    }
  };

  const emptyImageLoop = [
    {
      image: EmptyImage,
    },
    {
      image: EmptyImage,
    },
    {
      image: EmptyImage,
    },
    {
      image: EmptyImage,
    },
  ];

  const businessDetailsAll = [
    {
      name: "User Name",
      value: singleBusiness?.userName
        ? singleBusiness?.userName
        : "Not Provided",
      invalid: singleBusiness?.userName ? false : true,
    },
    {
      name: "Mobile Number",
      value: singleBusiness?.mobileNumber
        ? singleBusiness?.mobileNumber
        : "Not Provided",
      invalid: singleBusiness?.mobileNumber ? false : true,
    },
    {
      name: "Business Name",
      value: singleBusiness?.name ? singleBusiness?.name : "Not Provided",
      invalid: singleBusiness?.name ? false : true,
    },
    {
      name: "Business Category",
      value: singleBusiness?.category?.name
        ? singleBusiness?.category?.name
        : "Not Provided",
      invalid: singleBusiness?.category?.name ? false : true,
    },
    {
      name: "Yearly Turnover",
      value: singleBusiness?.yearlyTurnOver
        ? singleBusiness?.yearlyTurnOver
        : "Not Provided",
      invalid: singleBusiness?.yearlyTurnOver ? false : true,
    },
    {
      name: "Employees Size",
      value: singleBusiness?.noOfEmployees
        ? singleBusiness?.noOfEmployees
        : "Not Provided",
      invalid: singleBusiness?.noOfEmployees ? false : true,
    },
    {
      name: "Year Of Establishment",
      value: singleBusiness?.yearOfEstablishment
        ? singleBusiness?.yearOfEstablishment
        : "Not Provided",
      invalid: singleBusiness?.yearOfEstablishment ? false : true,
    },
    {
      name: "Gst Number",
      value: singleBusiness?.GSTNumber
        ? singleBusiness?.GSTNumber
        : "Not Provided",
      invalid: singleBusiness?.GSTNumber ? false : true,
    },
    {
      name: "Submitted By",
      value: singleBusiness?.userId?.email
        ? singleBusiness?.userId?.email
        : "Not Provided",
      invalid: singleBusiness?.userId?.email ? false : true,
    },
    {
      name: "Area or Locality",
      value: singleBusiness?.area ? singleBusiness?.area : "Not Provided",
      invalid: singleBusiness?.area ? false : true,
    },
    {
      name: "State",
      value: singleBusiness?.state?.name
        ? singleBusiness?.state?.name
        : "Not Provided",
      invalid: singleBusiness?.state?.name ? false : true,
    },
    {
      name: "Pincode",
      value: singleBusiness?.pincode?.code
        ? singleBusiness?.pincode?.code
        : "Not Provided",
      invalid: singleBusiness?.pincode?.code ? false : true,
    },
  ];

  const handleUpdateBusinessStatus = async (key) => {
    const formData = new FormData();
    formData.append("status", key);

    console.log(formData);
    setModalIsOpen(true);

    try {
      await axios
        .put(`${config.api}admin/business/${receivedData?._id}`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response?.data?.success == true) {
            setModalIsOpen(false);
            toast.success("Business Status Updated");
            navigate("/business");
          } else {
            setModalIsOpen(false);
            toast.error("Error in Updating Status");
          }
        })
        .catch((err) => {
          setModalIsOpen(false);
          toast.error(err?.message);
          toast.error(err?.response?.data?.message);
          // console.log(err , 'error')
        });
    } catch (error) {
      setModalIsOpen(false);
      console.log(error);
    }
  };

  const deleteBusiness = async (busId) => {
    setDeleteLoader(true);
    try {
      await axios
        .delete(`${config.api}admin/business/${busId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response?.data?.success == true) {
            setDeleteLoader(false);
            toast.success("Business Deleted Successfully");
            navigate("/business");
          } else {
            setDeleteLoader(false);
            toast.error("Error in Deleting Business");
          }
        })
        .catch((err) => {
          setDeleteLoader(false);
          toast.error(err?.message);
          toast.error(err?.response?.data?.message);
          // console.log(err , 'error')
        });
    } catch (error) {
      setDeleteLoader(false);
      console.log(error);
    }
  };

  // console.log(singleBusiness , "single")

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  const productLink = `https://www.localmart.app/search/complete-details/${receivedData?._id}`;
  const handleCopyToClipboard = () => {
    setShareModalOpen(false);
    navigator.clipboard.writeText(productLink).then(() => {
      toast.success("Link copied!");
    });
  };

  const shareLink = (platform) => {
    const url = `https://www.localmart.app/search/complete-details/${receivedData?._id}`;
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}`;
        break;
      case "instagram":
        shareUrl = `https://www.instagram.com/?url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      default:
        alert("Invalid platform");
        return;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <>
    {editMode?
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
              onClick={() => setEditMode(false)}
            >
              <div className="backarrow-sec w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <i className="ri-arrow-left-line text-xl"></i>
              </div>
              <h4 className="font-medium ">Back</h4>
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
                                        onChange={(option) => {  setFieldValue('businessCity', option ? option.value : '') , getPincodes(option.value)}}
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
                                        <p className='text-BusinessFormLabel'>Business Category (Optional)</p>
                                        </div>
                                        <div className="poitions-relative relative z-[9999999]">
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
                                    <div className="form-inputsec relative col-span-6">
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
                                          value={ multiAmentites}
                                          onChange={(option) => setMultiAmenities(option)}
                                        />                               
                                    </div>
                                    <div className="form-inputsec relative col-span-6">
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
    </div> :
    <div className="main-business-detail bg-DashboardGray ">
      <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
      >
        <Loader />
      </Modal>
      <Modal
          isOpen={shareModalOpen}
          style={customStyles2}
          contentLabel="Example Modal"
      >
        <div className="share-modal-inner">
          <div className="top-share-modal-closer flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-Black">Share this place</h2>
            <button type="button" onClick={() => setShareModalOpen(false)}><i className="bi bi-x-lg text-2xl"></i></button>
          </div>
          <div className="inner-content-share">
            <div className="share-copy-link-bar flex items-center justify-between gap-4 bg-LightGrayBg rounded-xl px-5 py-3">
              <div className="left-copy-link-bar">
                  <h2 className="text-Secondary text-xl font-semibold mb-2">Copy Link</h2>
                  <p className="text-sm opacity-50 font-light">https://www.localmart.app/search/complete-details/{receivedData?._id}</p>
              </div>
              <div className="right-copy-link-button">
                <button type="button" onClick={handleCopyToClipboard} className="w-10 h-10 rounded-full  bg-white flex items-center justify-center"><i className="ri-link text-2xl text-Secondary"></i></button>
              </div>
            </div>
            <div className="bottom-social-options flex items-center justify-center gap-10 mt-8">
              <div className="single-social-option">
                <button type="button" className="w-10 h-10" onClick={() => shareLink('facebook')}>
                  <img src={FacebookShare} className="w-full h-full" alt="" />
                </button>
              </div>
              <div className="single-social-option">
                <button type="button" className="w-10 h-10" onClick={() => shareLink('whatsapp')}>
                  <img src={WhatsappShare} className="w-full h-full" alt="" />
                </button>
              </div>
              <div className="single-social-option">
                <button type="button" className="w-10 h-10" onClick={() => shareLink('telegram')}>
                  <img src={TelegramShare} className="w-full h-full" alt="" />
                </button>
              </div>
              <div className="single-social-option">
                <button type="button" className="w-10 h-10" onClick={() => shareLink('instagram')}>
                  <img src={InstagramShare} className="w-full h-full" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
          isOpen={deletModal}
          style={customStyles2}
          contentLabel="Delete Modal"
      >
        <div className="sure-delete-modal-success">
          <div className="inner-delete-display">
            <p className='text-xl font-medium text-Black'>Are you sure you want to delete this Business</p>
              <div className="single-category-item bg-LightBlue rounded-10p p-[15px] relative my-6">
                  <div className="inner-single-category-item flex items-center gap-5">
                      <div className="left-side-image-category">
                          <img src={singleBusiness?.mediaFiles && singleBusiness?.mediaFiles.length > 0 ? singleBusiness?.mediaFiles[0]?.fileUrl : EmptyImage} className='h-12 w-12 rounded-full object-cover' alt="" />
                      </div>
                      <div className="right-side-category-name">
                          <p className='text-Black font-medium'>{singleBusiness?.name}</p>
                          <p className="text-sm">{singleBusiness?.businessCode}</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="cancel-delete-buttons flex items-center justify-between">
              <button type="button" onClick={() => setDeleteModal(false)} className='px-5 py-2 rounded-full text-xl bg-LightGrayBg '>Cancel</button>
              <button type="button" disabled={deleteLoader} onClick={() => deleteBusiness(singleBusiness?._id)} className='px-5 py-2 rounded-full text-xl bg-opacity-20 text-red-600 bg-red-400'>{deleteLoader ? 'Wait...' : 'Delete'}</button>
          </div>
        </div>
      </Modal>
      <div className="top-searched-detail-rating-favorite-sec sticky top-0 z-[9999] bg-white pl-[270px] py-4 pr-8  flex flex-wrap gap-y-6 items-center justify-between gap-x-5">
        <div className="left-title-rating-search ">
          <h4 className="text-2xl font-medium text-Black">
            {singleBusiness?.name} | {singleBusiness?.businessCode}
          </h4>
          <div className="location-rating-seperate-search flex items-center gap-x-5 mt-3 flex-wrap gap-y-3">
            <button
              type="button"
              className="business-recommended-section flex items-center gap-10p opacity-60"
            >
              <i className="ri-map-pin-line text-Black"></i>
              <p className="text-sm text-LightText">
                {singleBusiness?.city?.name} - {singleBusiness?.city?.name}
              </p>
            </button>
            <div className="seperator-div h-5 w-[1px] bg-Black"></div>
            <div className="rating-review-search-text flex items-center gap-x-2">
              <i className="ri-star-fill text-StarGold"></i>
              <p>{singleBusiness?.averageRating}  Ratings</p>
            </div>
          </div>
        </div>
        <div className="right-side-accept-reject-button-section">
            <div className="two-reviewing-buttons flex items-center gap-4">
                {/* <button type="button" className="bg-white border border-Secondary text-xl font-medium rounded-lg py-2 px-8 text-Secondary" onClick={() => setEditMode(true)}>Edit</button> */}
                <button type="button" className="bg-green-500 text-lg font-semibold rounded-lg py-2 px-6 border border-green-500 text-white" onClick={() => handleUpdateBusinessStatus('published')}>Publish</button>
                <button type="button" className="bg-red-100 text-lg rounded-lg py-2 px-6 text-red-600 border border-red-100"  onClick={() => handleUpdateBusinessStatus('rejected')}>Reject</button>
                <button type="button" className="text-lg rounded-lg py-2 px-6 text-red-600 border-red-600 border" onClick={() => setDeleteModal(true)} >Delete</button>
            </div>
        </div>
      </div>
      <div className="main-search-info-section pl-[270px] py-8 pr-8">
        <section className="search-info-page-section-2">
          <div className="inner-search-info-section-2">
            <div className="photos-section-searched my-5 ">
              <div className="searched-business-photos rounded-xl overflow-hidden relative">
                <Swiper
                  className="mySwiper"
                  grabCursor={true}
                  centeredSlides={true}
                  pagination={true}
                  slidesPerView={1}
                  speed={600}
                  loop={true}
                  initialSlide={2}
                  spaceBetween={20}
                  preventClicks={true}
                  navigation={{
                    clickable: true,
                    nextEl: ".right-side-business-photo-slide-btn",
                    prevEl: ".left-side-business-photo-slide-btn",
                  }}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay, Navigation, Pagination]}
                >
                  {singleBusiness?.mediaFiles && singleBusiness?.mediaFiles.length > 0 ?  singleBusiness?.mediaFiles.map((items, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="big-image-section-searched searched-image-sections h-[500px]">
                          <img
                            src={items?.fileUrl}
                            className="h-[500px] object-cover flex"
                            alt=""
                          />
                        </div>
                      </SwiperSlide>
                    )
                  }) : 
                  emptyImageLoop.map((items , index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="big-image-section-searched searched-image-sections h-[500px]">
                          <img
                            src={items.image}
                            className="h-[500px] object-cover flex"
                            alt=""
                          />
                        </div>
                      </SwiperSlide>
                    )
                  })
                  }
                </Swiper>
                <button
                  type="button"
                  className="left-side-business-photo-slide-btn similar-business-media-slide-btns w-10 h-10 bg-white shadow-2xl z-[999] rounded-full flex items-center justify-center absolute left-4 top-1/2"
                >
                  <i className="bi bi-chevron-left text-2xl"></i>
                </button>
                <button
                  type="button"
                  className="right-side-business-photo-slide-btn similar-business-media-slide-btns w-10 h-10 bg-white shadow-2xl z-[999] rounded-full flex items-center justify-center absolute right-4 top-1/2"
                >
                  <i className="bi bi-chevron-right text-2xl"></i>
                </button>
              </div>
            </div>
            <div className="about-business-section pb-12">
              <div className="inner-about-business-grid-section">
                <div className="grid grid-cols-12 gap-x-5 search-details-main-section-grid">
                  <div className="col-span-8 about-para-rating-items-section">
                    <div className="inner-about-rating-section flex flex-col gap-y-10">
                      <div className="top-about-para-section-searched">
                        <h4 className="text-20 font-medium text-Black mb-1">
                          About This Place
                        </h4>
                        <p className="text-Black opacity-70">
                          {singleBusiness?.about ? singleBusiness?.about : 'Not Porvided'}
                        </p>
                      </div>
                      <div className="profile-information-details-bottom-part px-6 py-5 bg-white rounded-2xl ">
                        <div className="left-sdie-profile-info-heading mb-4">
                            <h4 className='text-lg font-medium text-Black'>Detailed Information</h4>
                        </div>
                        <div className="top-deskview-combined-details-section-profile">
                            <div className="combined-details-screen-profile flex flex-wrap items-center gap-16  mt-3">
                                {businessDetailsAll.map((items , index)=> {
                                return (
                                    <div className="single-detail-profile-sec" key={index}>
                                        <p className='text-LightBlack opacity-50'>{items.name}</p>
                                        <h6 className={`${items?.invalid ? 'text-red-400' : 'text-Black'}`}>{items.value}</h6>
                                    </div>
                                )
                                })}
                            </div>
                            <div className="business-tags-section mt-10">
                              <h4 className='text-LightBlack opacity-50'>Business Tags</h4>
                              <div className="inner-tags-section flex items-center flex-wrap gap-5 mt-2">
                                  {singleBusiness?.tags?.length > 0 ? 
                                        singleBusiness?.tags?.map((items , index) => {
                                          return (
                                            <div className="single-detail-profile-sec flex items-center gap-3 bg-gray-200 bg-opacity-60 rounded-xl py-2 px-4"  key={index}>
                                              <i className="bi bi-tag-fill text-xl"></i>
                                                <p  className="text-Secondary capitalize">{items}</p>
                                            </div>
                                          )
                                        }) : <p className="text-red-400">Not Provided</p>
                                  }
                              </div>
                            </div>
                        </div>
                      </div>
                      <div className="profile-information-details-bottom-part px-6 py-5 bg-white rounded-2xl ">
                        <div className="left-sdie-profile-info-heading mb-4">
                            <h4 className='text-lg font-medium text-Black'>Links and Websites</h4>
                        </div>
                        <div className="top-deskview-combined-details-section-profile">
                            <div className="combined-details-screen-profile flex flex-col gap-10  mt-3">
                                <div className="single-detail-profile-sec" >
                                    <p className='text-LightBlack opacity-50'>Website Address</p>
                                    {singleBusiness?.websiteAddress ? <a href={singleBusiness?.websiteAddress} target="_blank" className="text-Secondary">{singleBusiness?.websiteAddress}</a> : <p className="text-red-400">Not Provided</p>}
                                </div>
                                
                                <div className="single-detail-profile-sec" >
                                    <p className='text-LightBlack opacity-50'>Social Media Link</p>
                                    {singleBusiness?.socialMediaLink && singleBusiness?.socialMediaLink?.length > 0 ? 
                                     singleBusiness?.socialMediaLink?.map((items , index) => {
                                      return (
                                        <div className="link-sepereator">
                                          <a href={items} target="_blank" className="text-Secondary">{items}</a>    
                                        </div>
                                      )
                                     }) : <p className="text-red-400">Not Provided</p>
                                    }                                    
                                </div>
                            </div>
                        </div>
                      </div>
                      {singleBusiness?.amenities &&
                          singleBusiness?.amenities.length > 0 ? 
                      <div className="amenities-section-searched">
                        <h4 className="text-20 font-medium text-Black mb-3">
                          Amenities
                        </h4>
                        <div className="amenities-mapped-section flex items-center gap-x-30p flex-wrap gap-y-4">
                          {singleBusiness?.amenities &&
                          singleBusiness?.amenities.length > 0
                            ? singleBusiness?.amenities.map((items, index) => {
                                return (
                                  <div
                                    className="single-amenities-searched"
                                    key={index}
                                  >
                                    <div className="inner-single-amenities flex items-center gap-x-3">
                                      <div className="left-amanitie-icon px-6 py-3  rounded-full flex items-center justify-center bg-AmenitiesLightGray">
                                        <p className="text-Black ">
                                          {items.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      </div> : null }
                      <div className="food-items-section-searched hidden">
                        <div className="food-items-slider">
                          <div className="food-items-section flex justify-between gap-10 items-center mb-3">
                            <div className="food-items-heading">
                              <h4 className="text-20 font-medium text-Black">
                                Food Items
                              </h4>
                            </div>
                          </div>
                          <div className="food-items-bottom-slider-section grid grid-cols-3 gap-4">
                            {foodItems.map((items, index) => {
                              return (
                                <div
                                  className="single-food-item-searched bg-white rounded-lg p-3"
                                  key={index}
                                >
                                  <div className="top-veg-nonveg-part flex items-center gap-x-2">
                                    <img
                                      src={items.veg ? VegIcon : NonVegIcon}
                                      className="w-[14px] h-[14px]"
                                      alt=""
                                    />
                                    <p className="text-Black">{items.title}</p>
                                  </div>
                                  <div className="bottom-price-section mt-3">
                                    <h4 className="text-Black font-medium">
                                      {items.pirce} /{" "}
                                      <span className="text-sm opacity-50">
                                        person
                                      </span>
                                    </h4>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {singleBusiness?.reviews && singleBusiness?.reviews?.length > 0 ? 
                      <div className="rating-section-searched ">
                        <div className="rating-searched-section flex justify-between gap-10 items-center mb-4">
                          <div className="rating-searched-heading">
                            <h4 className="text-20 font-medium text-Black">
                              Ratings
                            </h4>
                            <p className="text-sm text-Black opacity-50">
                              Total 305 People Rated this place
                            </p>
                          </div>
                        </div>
                        <div className="rating-searched-bottom-slider-section flex items-center flex-wrap gap-10">
                            {singleBusiness?.reviews && singleBusiness?.reviews?.length > 0 ?  singleBusiness?.reviews?.map((items , index) => {
                                return (
                                  <div className="single-rating-profile col-span-6 bg-white rounded-2xl p-5" key={index}>
                                  <div className="right-text-rating-profile mb-2">
                                    <div className="five-stars-section flex items-center gap-x-1">
                                      {[...Array(items.rating)].map((rates , rateIndex) => {
                                        return (
                                          <i className='ri-star-fill text-lg text-StarGold' key={rateIndex}></i>
                                        )
                                      })}
                                    </div>
                                    <h4 className='font-medium text-Black text-xl'>{items?.userName}</h4>
                                  </div>
                                  <p className="text-Black font-light opacity-60">{items?.comment ? items?.comment : 'Comments not added by user'}</p>
                                  <p className="text-sm font-medium mt-2 opacity-50">Posted on : {formatDate(items?.createdAt)}</p>
                              </div>
                                )
                            }) : null}
                        </div>
                      </div> : null }
                    </div>
                  </div>
                  <div className="col-span-4 business-contact-details-right">
                    <div className="inner-business-contact-details-right bg-white border border-BorderColor  border-opacity-30 rounded-2xl shadow-xl px-5 py-6 sticky top-32">
                      <div className="top-contact-number-section pb-[18px] border-b border-BorderColor border-opacity-50">
                        <div className="contatc-info-head mb-3">
                          <h2 className="text-20 font-medium text-Black">
                            Contact Information
                          </h2>
                        </div>
                        <button
                          type="button"
                          className="number-info-section flex items-center gap-x-3 text-left"
                        >
                          <i className="ri-phone-fill text-Secondary"></i>
                          <p className="font-medium text-Secondary">
                            {singleBusiness?.mobileNumber}
                          </p>
                        </button>
                      </div>
                      <div className="address-info-section py-5 border-b border-BorderColor border-opacity-50">
                        <h4 className="text-lg font-medium text-Black mb-2">
                          Address
                        </h4>
                        <p className="text-Black opacity-40">
                          {singleBusiness?.completeAddress}
                        </p>
                        <div className="directions-copy-address-btns flex items-center gap-x-5 justify-between mt-4">
                          <button
                            type="button"
                            onClick={openGoogleMaps}
                            className="direcions-btn flex items-center gap-x-3 text-left"
                          >
                            <i className="ri-corner-up-right-line text-lg text-Secondary"></i>
                            <p className="font-medium text-Secondary">
                              Get Directions
                            </p>
                          </button>
                          <button
                            type="button"
                            className="direcions-btn flex items-center gap-x-3 text-left"
                          >
                            <i className="ri-file-copy-line text-lg text-Secondary"></i>
                            <p className="font-medium text-Secondary">
                              Copy Address
                            </p>
                          </button>
                        </div>
                      </div>
                      <div className="opens-share-place-section flex flex-col gap-y-4 py-5 ">
                        <div className="opens-outer-sec flex items-center gap-x-3 text-left">
                          <i className="ri-timer-line text-lg text-Secondary"></i>
                          <p className="font-medium text-Black">
                            <span className="text-Green">
                              {singleBusiness?.workingHours}
                            </span>
                          </p>
                        </div>
                        <button
                          type="button"
                          className="share-place-btn flex items-center gap-x-3 text-left"
                          onClick={() => setShareModalOpen(true)}
                        >
                          <i className="ri-share-fill text-lg text-Secondary"></i>
                          <p className="font-medium text-Secondary">
                            Share this place
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div> }
    </>
  )
};

export default BusinessDetails;
