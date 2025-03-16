import React, { useState, useEffect } from "react";
import BusinessOwner from "../../assets/images/business-owner-pic.jpg";
import GmailIcon from "../../assets/images/gmail-icon.svg";
import VegIcon from "../../assets/images/veg-icon.svg";
import NonVegIcon from "../../assets/images/non-veg-icon.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import { useLocation, NavLink } from "react-router-dom";

const BusinessDetails = () => {
  const location = useLocation();

  const receivedData = location.state?.items || "";

  console.log("receivedData", receivedData);

  const amenities = [
    {
      icon: "ri-wifi-line",
      title: "Free Wifi",
    },
    {
      icon: "ri-snowflake-line",
      title: "Air Conditioning",
    },
    {
      icon: "ri-parking-box-line",
      title: "Free Parking",
    },
  ];

  const businessPhotos = [
    {
      image: receivedData?.mediaFiles[0]?.fileUrl,
    },
    {
      image: receivedData?.mediaFiles[1]?.fileUrl,
    },
    {
      image: receivedData?.mediaFiles[0]?.fileUrl,
    },
    {
      image: receivedData?.mediaFiles[1]?.fileUrl,
    },
    {
      image: receivedData?.mediaFiles[0]?.fileUrl,
    },
    {
      image: receivedData?.mediaFiles[1]?.fileUrl,
    },
    {
      image: receivedData?.mediaFiles[0]?.fileUrl,
    },
    {
      image: receivedData?.mediaFiles[1]?.fileUrl,
    },
  ];

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
    {
      title: "Butter Chicken",
      veg: false,
      pirce: "₹450.00",
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

  const long = receivedData?.location?.coordinates[0];
  const lat = receivedData?.location?.coordinates[1];

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${lat},${long}`;
    window.open(url, "_blank");
  };

  return (
    <div className="main-business-detail bg-DashboardGray ">
        {/* <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            contentLabel="Example Modal"
        >
          <div className="sure-delete-modal-success">
            <div className="inner-delete-display">
              <p className='text-xl font-medium text-Black'>Are you sure you want to delete this Category</p>
                <div className="single-category-item bg-LightBlue rounded-10p p-[15px] relative my-6">
                    <div className="inner-single-category-item flex items-center gap-5">
                        <div className="left-side-image-category">
                            <img src={modalData?.icon} className='object-contain max-w-[40px] max-h-[40px] min-w-[35px]' alt="" />
                        </div>
                        <div className="right-side-category-name">
                            <p className='text-Black font-medium'>{modalData?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cancel-delete-buttons flex items-center justify-between">
                <button type="button" onClick={() => setModalIsOpen(false)} className='px-5 py-2 rounded-full text-xl bg-LightGrayBg '>Cancel</button>
                <button type="button" onClick={() => deleteCategory(modalData._id)} className='px-5 py-2 rounded-full text-xl bg-opacity-20 text-red-600 bg-red-400'>Delete</button>
            </div>
          </div>
      </Modal> */}
      <div className="top-searched-detail-rating-favorite-sec sticky top-0 z-[9999] bg-white pl-[270px] py-4 pr-8  flex flex-wrap gap-y-6 items-center justify-between gap-x-5">
        <div className="left-title-rating-search ">
          <h4 className="text-2xl font-medium text-Black">
            {receivedData?.name}
          </h4>
          <div className="location-rating-seperate-search flex items-center gap-x-5 mt-3 flex-wrap gap-y-3">
            <button
              type="button"
              className="business-recommended-section flex items-center gap-10p opacity-60"
            >
              <i className="ri-map-pin-line text-Black"></i>
              <p className="text-sm text-LightText">
                {receivedData?.stateId?.name} - {receivedData?.cityId?.name}
              </p>
            </button>
            <div className="seperator-div h-5 w-[1px] bg-Black"></div>
            <div className="rating-review-search-text flex items-center gap-x-2">
              <i className="ri-star-fill text-StarGold"></i>
              <p>1407+ Ratings</p>
            </div>
          </div>
        </div>
        <div className="right-side-accept-reject-button-section">
            <div className="two-reviewing-buttons flex items-center gap-4">
                <button type="button" className="bg-green-500 text-xl font-semibold rounded-lg py-2 px-8 text-white">Publish</button>
                <button type="button" className="bg-red-100 text-xl rounded-lg py-2 px-8 text-red-600">Reject</button>
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
                  {businessPhotos.map((items, index) => {
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
                    );
                  })}
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
                          Beautiful stylish and spacious 2-Bedroom, with 1 king
                          and 1 queen size bed, and 1 free parking spot plus
                          visitor parking. Located in one of the best areas of
                          Downtown Toronto, just a few minutes walk from the CN
                          tower, Rogers Stadium, Scotiabank Arena and the
                          lakeshore. The apartment is surrounded by trendy
                          restaurants, shops and venues. Close to public transit
                          and main street{" "}
                        </p>
                      </div>
                      <div className="amenities-section-searched">
                        <h4 className="text-20 font-medium text-Black mb-3">
                          Amenities
                        </h4>
                        <div className="amenities-mapped-section flex items-center gap-x-30p flex-wrap gap-y-4">
                          {receivedData?.amenities &&
                          receivedData?.amenities.length
                            ? receivedData?.amenities.map((items, index) => {
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
                      </div>
                      <div className="food-items-section-searched">
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
                      <div className="rating-section-searched">
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
                          {foodItems.map((items, index) => {
                            return (
                              <div
                                className="single-rating-profile flex items-center gap-x-2"
                                key={index}
                              >
                                <div className="left-image-rating-pro">
                                  <img
                                    src={BusinessOwner}
                                    className="max-w-[50px] max-h-[50px] rounded-full"
                                    alt=""
                                  />
                                </div>
                                <div className="right-text-rating-profile">
                                  <h4 className="font-medium text-Black">
                                    SM. Srinivas Kiran
                                  </h4>
                                  <div className="five-stars-section flex items-center gap-x-1">
                                    <i className="ri-star-fill text-StarGold"></i>
                                    <i className="ri-star-fill text-StarGold"></i>
                                    <i className="ri-star-fill text-StarGold"></i>
                                    <i className="ri-star-fill text-StarGold"></i>
                                    <i className="ri-star-fill text-StarGold"></i>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
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
                            {receivedData?.mobileNumber}
                          </p>
                        </button>
                      </div>
                      <div className="address-info-section py-5 border-b border-BorderColor border-opacity-50">
                        <h4 className="text-lg font-medium text-Black mb-2">
                          Address
                        </h4>
                        <p className="text-Black opacity-40">
                          {receivedData?.completeAddress}
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
                              {receivedData?.workingHours}
                            </span>
                          </p>
                        </div>
                        <button
                          type="button"
                          className="share-place-btn flex items-center gap-x-3 text-left"
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
    </div>
  );
};

export default BusinessDetails;
