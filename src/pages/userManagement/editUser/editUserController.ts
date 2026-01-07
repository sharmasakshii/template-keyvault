import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useEffect, useState } from "react";
import { regionShow, getDivisionList } from "store/commonData/commonSlice";
import { deleteUser, getUserDetailById, getUserRole, updateUser, updateUserStatus } from "store/user/userSlice";
import { toast } from "react-toastify";
import { companySlug, valueConstant } from "constant";
import { getDivisionOptions, getRegionOptions, isCompanyEnable } from "utils";
const CryptoJS = require("crypto-js");

export const userBackLink = (roleId: any) => roleId ? `role-management/view/${roleId}` : "user-management"

export const getStatus = (status: any) => {
    return status === valueConstant?.STATUS_ACTIVE ? valueConstant?.STATUS_DEACTIVATE : valueConstant?.STATUS_ACTIVE
}

export const getStatusDetail = (status: any) => status !== 1 ? 'Activate' : 'Deactivate'

export const EditUserController = () => {

    const { user_id, roleId } = useParams()
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState<boolean>(false)
    const { regions, divisions } = useAppSelector((state: any) => state.commonData);
    const { loginDetails } = useAppSelector((state: any) => state.auth)
    const { singleUserDetail, userRoleList, isUserListByIdLoading } = useAppSelector((state) => state.user)
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [userAction, setUserAction] = useState("");
    const isPepsiClient = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);
    useEffect(() => {
        if (isPepsiClient) {
            dispatch(getDivisionList())
        } else {
            dispatch(regionShow({ division_id: "" }));
        }
        dispatch(getUserRole());

    }, [dispatch, isPepsiClient]);

    useEffect(() => {
        dispatch(getUserDetailById({ user_id: user_id }));
        setIsInitialLoad(true)
    }, [dispatch, user_id]);


    const statusList = [
        { label: "Activate", value: valueConstant?.STATUS_ACTIVE },
        { label: "Deactivate", value: valueConstant?.STATUS_DEACTIVATE }
    ]

    const regionList = getRegionOptions(regions?.data?.regions)
    let divisionOptions = getDivisionOptions(divisions?.data, 0)
    // Define a validation schema for user profile form.
    const schemaUser = yup.object().shape(
        {
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
            password: yup
                .string()
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
                ),
            phone: yup
                .string()
                .min(10, "Contact number should be 10 digits")
                .max(10, "Contact number should be 10 digits")
        });
    // Initialize form fields for user profile.
    let _FieldsUser = {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        regionId: { label: "All Regions", value: "" },
        password: "",
        role_id: { label: "Select Role", value: "" },
        status: { label: "Select Status", value: "" },
        divisionId: { label: "All Divisions", value: "" },
    };

    const handleSubmitUserForm = async (event: any) => {
        if (formikUser?.values?.password) {
            setUserAction("passwordChange")
            setShowModal(true)
            return true
        }
        handleUpdateUser()
    };

    const formikUser = useFormik({
        initialValues: _FieldsUser,
        validationSchema: schemaUser,
        onSubmit: handleSubmitUserForm,
    });

    const handleUpdateUser = () => {
        const payload: any = {
            user_id: user_id,
            first_name: formikUser?.values?.first_name,
            last_name: formikUser?.values?.last_name,
            phone_number: formikUser?.values?.phone,
            email: formikUser?.values?.email,
            role_id: formikUser?.values?.role_id?.value,
            regionId: formikUser?.values?.regionId?.value,
            divisionId: formikUser?.values?.divisionId?.value ?? 0,
        }

        if (formikUser?.values?.password) {
            payload["password"] = CryptoJS.AES.encrypt(JSON.stringify(formikUser?.values?.password), process.env.REACT_APP_EN_KEY).toString()
        }

        dispatch(updateUser({
            data: payload,
            navigate: navigate
        }))
    }

    useEffect(() => {
        if (singleUserDetail?.data?.userDetail) {
            if (isInitialLoad) {
                formikUser.setFieldValue("status", { value: singleUserDetail?.data?.userDetail?.status, label: "" })
                formikUser.setFieldValue("role_id", { value: singleUserDetail?.data?.userDetail?.role, label: "" })
                formikUser.setFieldValue("first_name", singleUserDetail?.data?.userDetail?.first_name);
                formikUser.setFieldValue("last_name", singleUserDetail?.data?.userDetail?.last_name);
                formikUser.setFieldValue("phone", singleUserDetail?.data?.userDetail?.phone_number || '');
                formikUser.setFieldValue("email", singleUserDetail?.data?.userDetail?.email);
                formikUser.setFieldValue("divisionId", { value: singleUserDetail?.data?.userDetail?.division_id, label: "" });
                formikUser.setFieldValue("regionId", { value: singleUserDetail?.data?.userDetail?.region_id, label: "" });
                setIsInitialLoad(false)

            }
        }
    }, [singleUserDetail, formikUser, isInitialLoad, divisionOptions, setIsInitialLoad, regionList])


    const handleClose = () => {
        formikUser.setFieldValue("password", "");
        setShowModal(false)
        setUserAction("")
    }

    const handleUpdateUserWithPwd = () => {
        switch (userAction) {
            case "passwordChange":
                handleUpdateUser()
                break
            case "status":
                dispatch(updateUserStatus({ data: { user_id: [user_id], status: getStatus(singleUserDetail?.data?.userDetail.status) }, userPayLoad: { isDetail: true, userId: user_id } }))
                break
            case "delete":
                dispatch(deleteUser({ data: { user_id: [user_id] }, userPayLoad: { navigate, isDetail: true, userId: user_id } }))
                break
        }
        setUserAction("")
        setShowModal(false)
    }

    const backLinkUrl = () => {
        return userBackLink(roleId)
    }

    let messages: { [key: string]: string } = {
        "status": `Do you want to ${getStatusDetail(singleUserDetail?.data?.userDetail?.status)} the user?`,
        "passwordChange": "Do you want to update the password",
        "delete": "Do you want to delete the user"
    }

    const handleChangeStatus = (status: { value: number, label: string }) => {
        if (singleUserDetail?.data?.userDetail?.status === status?.value) {
            return toast.error(`You can't ${status?.label.toLowerCase()} the user because user status is already ${status?.label.toLowerCase()}`)
        }
        setShowModal(true)
        setUserAction("status")
    }

    return {
        formikUser,
        showModal,
        handleClose,
        handleUpdateUserWithPwd,
        singleUserDetail,
        navigate,
        userRoleList,
        backLinkUrl,
        statusList,
        setShowModal,
        isUserListByIdLoading,
        messages,
        handleChangeStatus,
        setUserAction,
        userAction,
        regionList,
        divisionOptions,
        isPepsiClient
    }
}