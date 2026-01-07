import { useEffect, useState } from 'react'
import { loginPost, otpPost, resendOtpPost } from "../../store/auth/authDataSlice";
import { useFormik } from 'formik';
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
const CryptoJS = require("crypto-js");

// Predefined models 
interface AuthData {
    email: string;
    password: string;
}

interface OtpData {
    email: string;
    otp: string;
}

/**
 * 
 * @returns all controllers for login page.
 */

const LoginFormController = () => {

    // Defined all stats and constants
    const [show, setShow] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [otpNumber, setOtpNumber] = useState("");
    const [otpErrorShow, setOtpErrorShow] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [email, setEmail] = useState("");


    // Import data from auth selector
    const { isAuthLoginLoading, isOtpVerifyLoading, isSuccess, isOtp } = useAppSelector((state:any) => state.auth);
    // Function for closing modal
    
    const handleClose = () => {
        setOtpErrorShow(false)
        setShow(false);
        setOtpNumber("")
        setTimer(60);
        setIsTimerActive(false);
    }

    // If login success, redirects to dashboard else show errors
    useEffect(() => {
        if (isSuccess && isOtp) {
            setOtpNumber("")
            setShow(true);
        } else if (!isSuccess && !isOtp) {
            setShow(false);
            localStorage.clear();
        } else if (isSuccess && !isOtp) {
            setShow(false);

        }
    }, [isSuccess, isOtp]);



    // On submit otp button click, dispatches verify-otp api
    const handleSubmitOtp = async () => {
        if (otpNumber?.length > 0) {
            const payload: OtpData = {
                email: formik?.values?.email, otp: otpNumber
            }
            await dispatch(otpPost(payload)).unwrap();
            setTimer(60)
            setIsTimerActive(false);
        } else {
            setOtpErrorShow(true)
        }
    }

    // used in formic to call login api
    const handleSubmit = (event: any) => {
        let cipherPassword = CryptoJS.AES.encrypt(JSON.stringify(event.password), process.env.REACT_APP_EN_KEY).toString();
        const userPayload = {
            email: event.email,
            password: cipherPassword,
        };
        setEmail(event.email);
        dispatch(loginPost(userPayload));
    };

    // intialData for formic
    let _Fields: AuthData = { email: "", password: "" };

    // schema for varification of email and password
    const schema = yup.object().shape({
        email: yup
            .string()
            .email("Please enter a valid Email")
            .required("Email should not be empty"),
        password: yup
            .string()
            .required("Password should not be empty"),
    });

    // formic to control login form
    const formik = useFormik({
        initialValues: _Fields,
        validationSchema: schema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        if (isTimerActive && timer > 0) {
            const countdown = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            return () => clearInterval(countdown);
        } else if (timer === 0) {
            setTimer(60)
            setIsTimerActive(false);
        }
    }, [isTimerActive, timer]);

    const handleResendOTP = () => {
        // Logic to trigger OTP resend
        const userPayload = {
            email: email,
        };
        dispatch(resendOtpPost(userPayload)).unwrap().then(()=>{
            setTimer(60);
            setIsTimerActive(true);
        }).catch(()=>{
            handleClose()
        });
       
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



    // All the state and function return to LoginView
    return {
        formik,
        show,
        showPassword,
        otpNumber,
        otpErrorShow,
        handleClose,
        setOtpNumber,
        handleSubmitOtp,
        isAuthLoginLoading,
        isOtpVerifyLoading,
        handleResendOTP,
        togglePasswordVisibility,
        isTimerActive,
        timer
    }

}

export default LoginFormController
