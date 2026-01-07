import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getRoleDetailById
} from "store/role/roleSlice";
import { getOrder } from 'utils';

import {
    getUserList, updateUserStatus, deleteUser
} from "store/user/userSlice";

import { useAppDispatch, useAppSelector } from "store/redux.hooks";

/**
 * A custom hook that contains all the states and functions for the RoleDetailController
 */
const RoleDetailController = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const params = useParams();

    const [pageSize, setPageSize] = useState<any>({
        label: 10,
        value: 10,
    });

    const [isDeleted, setIsDeleted] = useState<boolean>(false)

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<any>("");
    const [order, setOrder] = useState<string>("desc");
    const [colName, setColName] = useState<string>("id");
    const [showUserOption, setShowUserOption] = useState(null);
    const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
    const [userDto, setUserDto] = useState<any>(null)
    const [multiSelectUserForDelete, setMultiSelectUserForDelete] = useState<any>([])

    
    // Function to handle changing the sorting order and column name
    const handleChangeOrder = (chooseColName: string) => {
        setOrder(getOrder(order));
        setColName(chooseColName);
    };
    const handelShowUserOption = (id: any) => {
        if (id !== showUserOption) {
            setShowUserOption(id);
        } else {
            setShowUserOption(null);
        }
    };

    useEffect(() => {
        if (params?.roleId) {
            dispatch(
                getUserList({
                    page_size: pageSize?.value,
                    page: currentPage,
                    col_name: colName,
                    order_by: order,
                    searchText: searchText,
                    is_filter: true,
                    role_id: params?.roleId?.toString()
                })
            );
        }
    }, [dispatch, currentPage, pageSize, colName, order, searchText, params]);


    const {
        roleDetail,
        isRoleDetailByIdLoading
    } = useAppSelector((state: any) => state.role);

    const {
        isUserListLoading, userList
    } = useAppSelector((state: any) => state.user);


    useEffect(() => {
        dispatch(
            getRoleDetailById({
                "role_id": params?.roleId
            })
        );
    }, [dispatch, params]);



    const handlePageChange = (e: any) => {
        setPageSize(e);
        setCurrentPage(1);
    };

    const handleSearchText = (e: any) => {
        setSearchText(e?.target?.value)
    }

    const handleDeleteUser = () => {
        const payloadData = {
            user_id: [userDto?.userInfo?.id],
            status: userDto?.status || 2
        }

        const userPayloadData = {
            page_size: pageSize?.value,
            page: currentPage,
            col_name: colName,
            order_by: order,
            searchText: searchText,
            is_filter: true,
            role_id: params?.roleId

        }

        if (isDeleted) {
            dispatch(
                deleteUser({
                    data: payloadData,
                    userPayLoad: userPayloadData
                })
            );
        }
        else {
            dispatch(
                updateUserStatus({
                    data: payloadData,
                    userPayLoad: userPayloadData
                })
            );
        }
        setShowUserDeleteModal(false);
        setUserDto(null)

    }

    const handlEditUser = (data: any, view: string) => {
        navigate(`/user-management-${view}/${data?.id}/${params?.roleId}`)
    }


    // Return all the states and functions
    return {
        roleDetail,
        isRoleDetailByIdLoading,
        pageSize,
        handlePageChange,
        currentPage,
        setCurrentPage,
        isUserListLoading,
        userList,
        handleSearchText,
        searchText,
        handleChangeOrder,
        colName,
        order,
        handelShowUserOption,
        showUserOption,
        showUserDeleteModal,
        setShowUserDeleteModal,
        handleDeleteUser,
        setShowUserOption,
        userDto,
        setUserDto,
        setIsDeleted,
        setSearchText,
        handlEditUser,
        params,
        isDeleted,
        setMultiSelectUserForDelete,
        multiSelectUserForDelete
    };
};

// Exporting the custom hook for use in other components
export default RoleDetailController;


