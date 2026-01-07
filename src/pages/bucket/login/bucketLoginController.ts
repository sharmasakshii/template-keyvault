import { useAuth } from "auth/ProtectedRoute";
import { useAppDispatch } from "store/redux.hooks";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { bucketLogin } from "store/auth/authDataSlice";


export const BucketLoginController = () => {
    const dispatch = useAppDispatch();
    const dataCheck = useAuth();
    const navigate = useNavigate();

    const schema = yup.object().shape({
        email: yup
            .string()
            .email("Please enter the valid username")
            .required("Username should not be empty"),
        password: yup
            .string()
            .min(3, "Please enter the min 3 letter")
            .required("Password should not be empty"),
    });
    let _Fields = { email: "", password: "" };

    const handleSubmit = async (event: any) => {
        dispatch(bucketLogin({
            email: event.email,
            password: event.password,
            navigate: navigate
        }));
    };
 

    const formik = useFormik({
        initialValues: _Fields,
        validationSchema: schema,
        onSubmit: handleSubmit,
    });




    return {

        formik,
        dispatch,
        dataCheck,
        navigate,
        handleSubmit
    }

}