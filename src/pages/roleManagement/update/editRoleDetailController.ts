import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getRoleDetailById, updateRole
} from "store/role/roleSlice";

import { useAppDispatch, useAppSelector } from "store/redux.hooks";

import { useFormik } from "formik";
import * as yup from "yup";
import { updateIsCheckedById, getCheckedIds, updateIsCheckedParentById, updateIsCheckedParentByIdT, updateIsCheckedBySlug } from "utils"
import { routeKey } from "constant";


/**
 * A custom hook that contains all the states and functions for the EditRoleDetailController
 */
const EditRoleDetailController = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const params = useParams();
    const [moduleListDto, setModuleListDto] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [showErrorMessage, setShowErrorMessage] = useState(false);


    const {
        roleDetail,
        isRoleDetailByIdLoading,
        isRoleListLoading
    } = useAppSelector((state: any) => state.role);


    useEffect(() => {
        dispatch(
            getRoleDetailById({
                "role_id": params?.roleId
            })
        );
    }, [dispatch, params]);

    // Define a validation schema for user profile form.
    const schemaRole = yup.object().shape({
        name: yup
            .string()
            .max(20, "Name should not exceed 20 characters")
            .required("Name should not be empty"),
        description: yup
            .string()
            .required("Description should not be empty")
            .max(250, "Description should not exceed 250 characters")
    });

    const handleSubmitRoleForm = async (event: any) => {

        if (getCheckedIds(moduleListDto).length > 0) {
            await dispatch(updateRole({
                userPaylod: {
                    "role_id": params?.roleId,
                    "name": event?.name,
                    "description": event?.description,
                    "moduleIds": getCheckedIds(moduleListDto)
                },
                navigate
            }));

        } else {
            setShowErrorMessage(true)
        }


    };

    // Initialize form fields for user profile.
    let _FieldsRole = {
        name: "",
        description: "",
    };

    const formikRole = useFormik({
        initialValues: _FieldsRole,
        validationSchema: schemaRole,
        onSubmit: handleSubmitRoleForm,
    });

    useEffect(() => {
        if (roleDetail?.data?.roleData) {
            if (isInitialLoad) {
                formikRole.setFieldValue("name", roleDetail?.data?.roleData?.name);
                formikRole.setFieldValue("description", roleDetail?.data?.roleData?.description);
                setModuleListDto(roleDetail?.data?.permissionsData)
                setIsInitialLoad(false)

            }
        }
    }, [roleDetail, formikRole, isInitialLoad, setIsInitialLoad])

    const handleChangePremission = (
        event: any,
        id: number,
        parentId: number,
        slug?: string
    ) => {
        const isChecked = event?.target?.checked;

        if (!isChecked) {
            const updatedDto = updateIsCheckedParentById(
                updateIsCheckedById(moduleListDto, id, id, isChecked),
                parentId,
                false
            );
            setModuleListDto(updatedDto);
        } else if (slug) {
            const updatedDto = updateIsCheckedBySlug(
                updateIsCheckedParentByIdT(
                    updateIsCheckedById(moduleListDto, id, id, isChecked)
                ),
                [routeKey.ApplicationAccess, routeKey.Scope1]
            );
            setModuleListDto(updatedDto);
        } else {
            const updatedDto = updateIsCheckedParentByIdT(
                updateIsCheckedById(moduleListDto, id, id, isChecked)
            );
            setModuleListDto(updatedDto);
        }

        setShowErrorMessage(false);
    };

    // Return all the states and functions
    return {
        roleDetail,
        isRoleDetailByIdLoading,
        params,
        formikRole,
        moduleListDto,
        handleChangePremission,
        showErrorMessage,
        isRoleListLoading,
        navigate
    };
};

// Exporting the custom hook for use in other components
export default EditRoleDetailController;


