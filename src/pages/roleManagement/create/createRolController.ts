import { useEffect, useState } from "react";
import {
    getAllModules, addRole
} from "store/role/roleSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { RoleListInterface } from "interface/role"
import { addIsChecked, updateIsCheckedById, updateIsCheckedParentById, getCheckedIds, updateIsCheckedParentByIdT, updateIsCheckedBySlug } from "utils"
import { routeKey } from "constant";


/**
 * A custom hook that contains all the states and functions for the CreateRolController
 */
const CreateRolController = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [isNavigate, setIsNavigate] = useState(false)
    const [showAddRoleForm, setShowAddRoleForm] = useState(false);
    const userRoleList: RoleListInterface[] = []
    const [moduleListDto, setModuleListDto] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);


    const {
        moduleList,
        createRoleDto,
        isCreateRoleDtoLoading,
        isRoleListLoading,
        isModuleList
    } = useAppSelector((state: any) => state.role);

    useEffect(() => {
        dispatch(
            getAllModules()
        );
    }, [dispatch]);

    useEffect(() => {
        if (createRoleDto?.data) {
            setShowAddRoleForm(true)
        }
    }, [createRoleDto]);

    if (createRoleDto?.data) {
        userRoleList.push({ name: createRoleDto?.data?.name, id: createRoleDto?.data?.id })
    }


    useEffect(() => {
        if (moduleList?.data) {
            setModuleListDto(addIsChecked(moduleList?.data))
        }
    }, [moduleList]);

    const handleChangePremission = (
        event: any,
        id: number,
        parentId: number,
        slug?: string
    ) => {
        const isChecked = event?.target?.checked;
        const updatedById = updateIsCheckedById(moduleListDto, id, id, isChecked);

        let updatedDto;

        if (!isChecked) {
            updatedDto = updateIsCheckedParentById(updatedById, parentId, false);
        } else if (slug) {
            const updatedWithParent = updateIsCheckedParentByIdT(updatedById);
            updatedDto = updateIsCheckedBySlug(updatedWithParent, [
                routeKey.ApplicationAccess,
                routeKey.Scope1,
            ]);
        } else {
            updatedDto = updateIsCheckedParentByIdT(updatedById);
        }

        setModuleListDto(updatedDto);
        setShowErrorMessage(false);
    };


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
            await dispatch(addRole({
                userPaylod: {
                    "name": event?.name,
                    "description": event?.description,
                    "moduleIds": getCheckedIds(moduleListDto)
                }, isNavigate: !isNavigate, navigate
            }));
            setIsNavigate(false)

        } else {
            setShowErrorMessage(true)
        }

    };


    const handleSubmitRoleUserForm = async () => {
        setIsNavigate(true)
        formikRole.handleSubmit()
    };


    // Initialize form fields for user profile.
    let _FieldsRole = {
        name: "",
        description: "",
    };

    const formikRole: any = useFormik({
        initialValues: _FieldsRole,
        validationSchema: schemaRole,
        onSubmit: handleSubmitRoleForm,
    });

    const handleCloseAddRoleForm = () => {
        setShowAddRoleForm(false);
        navigate("/role-management")
    }


    // Return all the states and functions
    return {
        moduleListDto,
        formikRole,
        handleSubmitRoleUserForm,
        showAddRoleForm,
        handleCloseAddRoleForm,
        userRoleList: { data: userRoleList },
        createRoleDto,
        isCreateRoleDtoLoading,
        handleChangePremission,
        isRoleListLoading,
        showErrorMessage,
        isModuleList
    };
};

// Exporting the custom hook for use in other components
export default CreateRolController;


