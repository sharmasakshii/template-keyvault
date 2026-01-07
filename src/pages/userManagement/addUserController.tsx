import { useEffect, useState } from "react";
import { addUser } from "store/user/userSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { ecryptDataFunction, isCompanyEnable } from '../../utils';
import { useFormik } from "formik";
import * as yup from "yup";
import { regionShow, getDivisionList } from "../../store/commonData/commonSlice";
import { useNavigate } from "react-router-dom";
import { companySlug } from "constant";

/**
 * A custom hook that contains all the states and functions for the AddUserController
 */
const AddUserController = (props: any) => {
    const dispatch = useAppDispatch();
    const { regions, divisions } = useAppSelector((state: any) => state.commonData);
    const { loginDetails } = useAppSelector((state: any) => state.auth)
    const { pageSize, colName, order, handleClose, setCurrentPage, setSearchText, isRole, isAddUser, selectedRoleDto } = props
    const navigate = useNavigate()
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const isPepsiClient = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);
    useEffect(() => {
        if (isPepsiClient) {
            dispatch(getDivisionList())
        } else {
            dispatch(regionShow({ division_id: "" }));;
        }
    }, [dispatch, isPepsiClient]);

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
        password: yup
            .string()
            .required("Password should not be empty")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),

        roleId: yup
            .object()
            .test("roleId", "", function (value, context) {
                let { from }: any = context;
                if (!from?.[0]?.value?.value) {
                    return this.createError({
                        message: `Role should not be empty`,
                        path: "roleId",
                    });
                } else {
                    return true;
                }
            })
            .required("Role should not be empty"),
    });

    // Initialize form fields for user profile.
    let _FieldsUser = {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        roleId: "",
        regionId: { label: "All Regions", value: "" },
        password: "",
        divisionId: { label: "All Divisions", value: "" },
    };
    // Handle user profile form submission.
    const handleSubmitUserForm = async (event: any) => {
        const dataPayload: any = {
            firstName: event?.first_name,
            lastName: event?.last_name,
            phone: event?.phone,
            email: event?.email,
            roleId: isAddUser ? selectedRoleDto?.id : event?.roleId?.value,
            password: ecryptDataFunction(event?.password),
            divisionId: event?.divisionId?.value !== "" ? event?.divisionId?.value : 0
        }
        if (event?.regionId?.value) {
            dataPayload['regionId'] = event.regionId.value
        }
 
        handleClose()
        await dispatch(addUser({
            data: dataPayload,
            userPayLoad: {
                page_size: pageSize ? pageSize?.value : 10,
                page: 1,
                col_name: colName,
                order_by: order,
                searchText: "",
            },
            isRole,
            isAddUser,
            navigate
        }));
        formikUser.resetForm();
        if (!isAddUser) {
            setCurrentPage(1)
            setSearchText("")
        }
    };
    const formikUser: any = useFormik({
        initialValues: _FieldsUser,
        validationSchema: schemaUser,
        onSubmit: handleSubmitUserForm,
    });
    const handleCloseModal = () => {
        handleClose()
        formikUser.resetForm();

    }
    useEffect(() => {
        if (selectedRoleDto && formikUser && isInitialLoad) {
            formikUser.setFieldValue("roleId", { value: selectedRoleDto?.id, label: selectedRoleDto.name });
            setIsInitialLoad(false)
        }
    }, [selectedRoleDto, formikUser, setIsInitialLoad, isInitialLoad])



    // Return all the states and functions
    return {
        formikUser,
        regions,
        divisions,
        isPepsiClient,
        handleCloseModal
    };
};

// Exporting the custom hook for use in other components
export default AddUserController;
