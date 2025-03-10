import * as yup from 'yup';
import { ref } from "yup";


export const adminLoginValidation = yup.object().shape({
    email: yup.string().email('Please Enter Valid Email').required('Email Address Required'),
    password: yup.string().required('Please Enter Password'),
})


export const addUserValidation = yup.object().shape({
    email: yup.string().email('Please Enter Valid Email').required('Email Address Required'),
    firstName: yup.string().required('Please Enter First Name'),
    lastName: yup.string().required('Please Enter Last Name'),
    password: yup.string().required('Please Enter Password'),
    mobileNumber: yup.number().required('Please Enter Your Mobile Number').min(10 , "Minimum 10 Digits"),
})


export const businessFormAddValidation = yup.object().shape({
    userId:  yup.string().required('Please Select User ID'),
    userName: yup.string().required('Please Enter User Name'),
    businessName: yup.string().required('Please Enter Business Name'),
    businessTitle: yup.string().notRequired(),
    mobileNumber: yup.number().required('Please Enter Your Mobile Number').min(10 , "Minimum 10 Digits"),
    email: yup.string().email('Please Enter Valid Email').required('Email Address Required'),
    socialMedia: yup.string().notRequired(),
    completeAddress: yup.string().required('Please Enter Complete Address'),
    landmark: yup.string().notRequired(),    
    pincode: yup.string().required('Please Enter Pincode'),
    yearlyTurnOver: yup.string().required('Please Enter  yearly turn over'),
    noOfEmployees: yup.number().required('Please Enter Number of Employees').min(1 , "Minimum 1 Digit"),
    yearOfEstablishment: yup.number().required('Please Enter Year of Establishment').min(1 , "Minimum 1 Digit"),
    websiteAddress: yup.string().notRequired(), 
    GSTNumber: yup.string().notRequired(),
    itemName:  yup.string().notRequired(),
    itemType:  yup.string().notRequired(),
    itemPrice: yup.string().notRequired(),
    workingHours:   yup.string().required('Please select this field'),    
    servicesOffer:  yup.string().required('Please select this field'),
    businessCategory: yup.string().required('Please select this field'),
    businessState: yup.string().required('Please select this field'),
    businessCity: yup.string().required('Please select this field'),
    
})




export const addAdvertValidation = yup.object().shape({
    email: yup.string().email('Please Enter Valid Email').required('Email Address Required'),
    firstName: yup.string().required('Please Enter First Name'),
    lastName: yup.string().required('Please Enter Last Name'),
    mobileNumber: yup.number().required('Please Enter Your Mobile Number').min(10 , "Minimum 10 Digits"),
    alternateMobile: yup.number().required('Please Enter Your Mobile Number').min(10 , "Minimum 10 Digits"),
    advertTitle: yup.string().required('Please Enter Advertisement Title'),
    advertLink: yup.string().url().required('Please Enter Advertisement Link (URL)'),
    subject: yup.string().required('Please Enter Subject'),
    message: yup.string().required('Please Enter Message'),
})