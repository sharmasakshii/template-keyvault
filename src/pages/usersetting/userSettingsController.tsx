// Import necessary libraries and modules.
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import {
  changePasswordApi,
  updateProfileApi,
  uploadProfilePic
} from "../../store/user/userSlice";
import { updateAuthStore, getUserDetails } from "store/auth/authDataSlice";
const CryptoJS = require("crypto-js");

// Define a functional component named UserSettingsController.
const UserSettingsController = () => {
  // Initialize Redux dispatch and authentication status.

  const [isLoadingProfilePic, setIsLoadingProfilePic] = useState(false)

  const dispatch = useAppDispatch();

  // Get the user profile from the Redux store.
  const { userProfile, isLoading, loginDetails } = useAppSelector((state: any) => state.auth);

  // Define a validation schema for the password change form.
  const schema = yup.object().shape({
    oldPassword: yup.string().required("Current password should not be empty"),
    password: yup
      .string()
      .required("Password should not be empty")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    currentPassword: yup
      .string()
      .required("Confirm Password should not be empty")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  // Initialize form fields for password change.
  let _Fields = {
    oldPassword: "",
    password: "",
    currentPassword: "",
  };

  // Handle form submission for changing the password.
  const handleSubmitForm = (event: any) => {
    let oldCipherPassword = CryptoJS.AES.encrypt(JSON.stringify(event.oldPassword), process.env.REACT_APP_EN_KEY).toString();
    let newCipherPassword = CryptoJS.AES.encrypt(JSON.stringify(event.password), process.env.REACT_APP_EN_KEY).toString();
    const userPayload = {
      old_password: oldCipherPassword,
      new_password: newCipherPassword,
    };
    dispatch(changePasswordApi(userPayload));
  };

  // Use Formik for password change form handling.
  const formik = useFormik({
    initialValues: _Fields,
    validationSchema: schema,
    onSubmit: handleSubmitForm,
  });

  // Define a validation schema for user profile form.
  const schemaUser = yup.object().shape({
    first_name: yup
      .string()
      .max(20, "First name should not exceed 20 characters")
      .matches(/^[A-Za-z\s]+$/, 'First name should only contain letters and spaces')
      .required("First name should not be empty"),
    last_name: yup
      .string()
      .max(20, "Last name should not exceed 20 characters")
      .matches(/^[A-Za-z\s]+$/, 'Last name should only contain letters and spaces')
      .required("Last name should not be empty"),
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email should not be empty"),
    phone: yup
      .string()
      .min(10, "Contact number should be 10 digits")
      .max(10, "Contact number should be 10 digits"),
    title: yup
      .string()
      .max(150, "Profile title should not exceed 150 characters")
      .required("Profile title should not be empty"),
  });

  // Initialize form fields for user profile.
  let _FieldsUser = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    title: "",
  };

  // Handle user profile form submission.
  const handleSubmitUserForm = async (event: any) => {
    const userPayload = {
      first_name: event.first_name,
      last_name: event.last_name,
      phone_number: event.phone,
      email: event?.email,
      title: event?.title,
    };
    await dispatch(updateProfileApi(userPayload));
    dispatch(getUserDetails());
  };


  const formikUser = useFormik({
    initialValues: _FieldsUser,
    validationSchema: schemaUser,
    onSubmit: handleSubmitUserForm,
  });

  useEffect(()=>{
    dispatch(getUserDetails())
  },[dispatch])
  // Populate form fields with user profile data when available.
  useEffect(() => {
    if (userProfile?.data) {
      formikUser.setFieldValue("first_name", userProfile?.data?.profile?.first_name || "");
      formikUser.setFieldValue("last_name", userProfile?.data?.profile?.last_name || "");
      formikUser.setFieldValue("phone", userProfile?.data?.profile?.phone_number || "");
      formikUser.setFieldValue("email", userProfile?.data?.email || "");
      formikUser.setFieldValue("title", userProfile?.data?.profile?.title || "");
    }
  }, [userProfile]);


  // Populate form fields with user profile data when available.
  useEffect(() => {
    if (loginDetails?.data?.login_count === 1) {
      dispatch(updateAuthStore({ ...loginDetails, data: { ...loginDetails.data, login_count: 2 } }))
    }
  }, [dispatch, loginDetails]);

  // Define a reference for the file input element (not currently in use).
  const hiddenFileInput = useRef<any>(null);

  const handleClick = () => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  // Function to handle file input change (not currently in use).
  const handleChange = async (event: any) => {
    setIsLoadingProfilePic(true)

    const imageFile = event.target.files[0];

    // Check if a file is selected
    if (!imageFile) {
      toast.error("Please select a file.");
      hiddenFileInput.current.value = ""
      return false;
    }

    // Check if the file type is valid
    if (!imageFile?.name?.match(/\.(jpg|jpeg|png)$/)) {
      toast.error("Please select a valid image file.");
      hiddenFileInput.current.value = ""
      setIsLoadingProfilePic(false);
      return false;
    }

    // Check if the file size is within the allowed limit (5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (imageFile.size > maxSizeInBytes) {
      toast.error("File size exceeds the limit of 5 MB.");
      hiddenFileInput.current.value = ""
      setIsLoadingProfilePic(false);
      return false;
    }
    await dispatch(uploadProfilePic(imageFile))
    await dispatch(getUserDetails());
    hiddenFileInput.current.value = ""
    setIsLoadingProfilePic(false)
    // Dispatch an action to upload the profile picture (not currently in use).
  };

  // Return all the states and functions for use in the component.
  return {
    userProfile,
    hiddenFileInput,
    handleChange,
    formik,
    formikUser,
    isLoading,
    handleClick,
    isLoadingProfilePic
  };
};

export default UserSettingsController;
