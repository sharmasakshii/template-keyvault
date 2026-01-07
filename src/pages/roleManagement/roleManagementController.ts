import { useEffect, useState } from "react";
import {

    getRoleList, deleteRole
} from "store/role/roleSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getOrder } from '../../utils';
import { useNavigate } from "react-router-dom";
import {
    getUserRole
} from "store/user/userSlice";


/**
 * A custom hook that contains all the states and functions for the RoleManagementController
 */
const RoleManagementController = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState<any>({
        label: 10,
        value: 10,
    });
    const [showRoleListView, setShowRoleListView] = useState(false);



    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<any>("");

    const [order, setOrder] = useState<string>("desc");
    const [colName, setColName] = useState<string>("id");
    const [showRoleOption, setShowRoleOption] = useState(null);
    const [showRoleDeleteModal, setShowRoleDeleteModal] = useState(false);
    const [multiSelectRoleForDelete, setMultiSelectRoleForDelete] = useState<any>([])
    const [roleDto, setRoleDto] = useState<any>(null)
    const [showAddRoleForm, setShowAddRoleForm] = useState(false);

    const {
        isRoleListLoading, roleList
    } = useAppSelector((state: any) => state.role);

    const {
        userRoleList, userProfile
    } = useAppSelector((state: any) => state.user);

    const { loginDetails } = useAppSelector((state: any) => state.auth);

    // Function to handle changing the sorting order and column name
    const handleChangeOrder = (chooseColName: string) => {
        setOrder(getOrder(order));
        setColName(chooseColName);
    };


    const handelShowRoleOption = (id: any) => {
        if (id !== showRoleOption) {
            setShowRoleOption(id);
        } else {
            setShowRoleOption(null);
        }
    };

    useEffect(() => {
        if (loginDetails?.data) {

            dispatch(
                getRoleList({
                    page_size: pageSize?.value,
                    page: currentPage,
                    col_name: colName,
                    order_by: order,
                    searchText: searchText,
                })
            );
        }
    }, [dispatch, currentPage, pageSize, colName, order, searchText, loginDetails]);

    useEffect(() => {
        if (roleList?.data?.pagination?.total_count > 0) {
            setShowRoleListView(true);
        }
    }, [dispatch, roleList]);

    useEffect(() => {
        dispatch(
            getUserRole()
        );
    }, [dispatch]);

    const handlePageChange = (e: any) => {
        setPageSize(e);
        setCurrentPage(1);
    };

    const handleSearchText = (e: any) => {
        setSearchText(e?.target?.value)
        setCurrentPage(1);
    }

    const handleDeleteRole = () => {
        const payloadData = {
            role_id: roleDto?.userInfo?.id,
        }
        const rolePayLoad = {
            page_size: pageSize?.value,
            page: 1,
            col_name: colName,
            order_by: order,
            searchText: searchText,
        }
        dispatch(
            deleteRole({
                data: payloadData,
                rolePayLoad,
            })
        );
        setCurrentPage(1)
        setMultiSelectRoleForDelete([])
        setShowRoleDeleteModal(false);
        setRoleDto(null)
    }


    const handleCloseAddRoleForm = () => setShowAddRoleForm(false);

    const handleShowAddRoleForm = () => {
        setShowAddRoleForm(true);
    }

    // Handle role profile form submission.
    const handlEditRole = (data: any, view: string) => {
        navigate(`/role-management/${view}/${data?.id}`)
    }
    // Return all the states and functions
    return {
        pageSize,
        handlePageChange,
        currentPage,
        setCurrentPage,
        isRoleListLoading,
        showRoleListView,
        handleSearchText,
        searchText,
        handleChangeOrder,
        colName,
        order,
        handelShowRoleOption,
        showRoleOption,
        showRoleDeleteModal,
        setShowRoleDeleteModal,
        handleDeleteRole,
        setShowRoleOption,
        roleDto,
        setRoleDto,
        multiSelectRoleForDelete,
        roleList,
        handlEditRole,
        handleShowAddRoleForm,
        showAddRoleForm,
        handleCloseAddRoleForm,
        userRoleList,
        setSearchText,
        userProfile
    };
};

// Exporting the custom hook for use in other components
export default RoleManagementController;
