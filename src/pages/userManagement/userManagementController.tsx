import { useEffect, useMemo, useState } from "react";
import {
    getUserList, updateUserStatus, deleteUser, getUserRole,
    getLoginActivity
} from "store/user/userSlice";

import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getOrder } from '../../utils';
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { filedownloadContainer } from "store/file/fileSlice";


/**
 * A custom hook that contains all the states and functions for the UserManagementController
 */
const UserManagementController = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState<any>({
        label: 10,
        value: 10,
    });
    const [showUserListView, setShowUserListView] = useState(false);

    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const { regions } = useAppSelector((state: any) => state.commonData);

    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<any>("");
    const [selectAllUser, setSelectAllUser] = useState<boolean>(false)
    const [order, setOrder] = useState<string>("desc");
    const [colName, setColName] = useState<string>("id");
    const [showUserOption, setShowUserOption] = useState(null);
    const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
    const [multiSelectUserForDelete, setMultiSelectUserForDelete] = useState<any>([])
    const [userDto, setUserDto] = useState<any>(null)
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [showResetAdvanceSearch, setShowResetAdvanceSearch] = useState(false);
    const [startMaxDate, setStartMaxDate] = useState<Date>()
    const [endMinDate, setEndMinDate] = useState<Date>()
    const [isStartDate, setIsStartDate] = useState<boolean>(false)
    const {
        isUserListLoading, userList, userRoleList, isLoadingActivityLog, loginActivityData
    } = useAppSelector((state: any) => state.user);

    const {fileDownloadLoading } = useAppSelector((state: any) => state.file);
    const { loginDetails } = useAppSelector((state: any) => state.auth);

    // Function to handle changing the sorting order and column name
    const handleChangeOrder = (chooseColName: string) => {
        setOrder(getOrder(order));
        setColName(chooseColName);
    };

    const handleUserGuideDownload = () => {
        dispatch(
            filedownloadContainer({
                data: {
                    downloadPath: "greensight_admin_user_guide.pdf",
                    fileName: "greensight_admin_user_guide.pdf",
                    folderPath: "/"
                }
            })
        );
    }

    const handelShowUserOption = (id: any) => {
        if (id !== showUserOption) {
            setShowUserOption(id);
        } else {
            setShowUserOption(null);
        }
    };

    useEffect(() => {
        dispatch(
            getUserRole()
        );
    }, [dispatch]);
    const handleShowAdvanceSearch = (e: any) => {
        if (!isStartDate) {
            setCurrentPage(1)
            setPageSize({ value: 10, label: 10 })
            setShowResetAdvanceSearch(true)
            setShowAdvanceSearch(false)
            dispatch(
                getUserList({
                    ...userListPayload,
                    page: 1,
                    page_size: 10,
                    is_filter: true
                })
            );
        }
        else {
            toast.error("Select start date also")
        }
    }

    const handleLoginActivity = (userId:number | string) =>{
        dispatch(getLoginActivity({userId: userId}))
    }

    let _FieldsSearch = {
        role_id: "",
        name: "",
        start_date: "",
        end_date: "",
        email: "",
        status: "",
    }
    const formikSearch: any = useFormik({
        initialValues: _FieldsSearch,
        onSubmit: handleShowAdvanceSearch,
    })
    const userListPayload = useMemo(() => ({
        page_size: pageSize?.value,
        page: currentPage,
        col_name: colName,
        order_by: order,
        searchText: searchText,
        "role_id": formikSearch?.values?.role_id?.value,
        "name": formikSearch?.values?.name,
        "start_date": formikSearch?.values?.start_date,
        "end_date": formikSearch?.values?.end_date,
        "email": formikSearch?.values?.email,
        "status": formikSearch?.values?.status?.value,
    }), [pageSize, currentPage, colName, order, searchText, formikSearch?.values]);

    useEffect(() => {
        if (loginDetails?.data) {
        dispatch(getUserList(userListPayload));
        setMultiSelectUserForDelete([])
        }
    }, [dispatch, currentPage, pageSize, colName, order, searchText, loginDetails, userListPayload]);

    useEffect(() => {
        if (userList?.data?.pagination?.total_count > 0) {
            setShowUserListView(true);
        }
    }, [dispatch, userList]);


    useEffect(() => {
        if (userList?.data?.list?.length === multiSelectUserForDelete?.length) {
            setSelectAllUser(true)
        }
        else {
            setSelectAllUser(false)
        }
    }, [userList, multiSelectUserForDelete])

    const handlePageChange = (e: any) => {
        setPageSize(e);
        setCurrentPage(1);
    };

    const handleSearchText = (e: any) => {
        setSearchText(e?.target?.value)
        setCurrentPage(1)
    }

    const handleSelectAll = (e: any) => {
        if (e.target.checked) {
            setSelectAllUser(true)
            setMultiSelectUserForDelete(userList?.data?.list?.map((iteam: any) => iteam?.id))
        } else {
            setSelectAllUser(false)
            setMultiSelectUserForDelete([])
        }
    }
    const handleDeleteUser = () => {
        if (isDeleted) {
            const payloadData = {
                user_id: userDto?.userInfo?.id ? [userDto?.userInfo?.id] : [...multiSelectUserForDelete],
            }
            dispatch(
                deleteUser({
                    data: payloadData,
                    userPayLoad: {
                        page_size: pageSize?.value,
                        page: 1,
                        col_name: colName,
                        order_by: order,
                        searchText: searchText,
                    }
                })
            );
            setCurrentPage(1)
            setMultiSelectUserForDelete([])
            setShowUserDeleteModal(false);
        }
        else {
            const payloadData = {
                user_id: userDto?.userInfo?.id ? [userDto?.userInfo?.id] : [...multiSelectUserForDelete],
                status: userDto?.status || 2
            }
            dispatch(
                updateUserStatus({
                    data: payloadData,
                    userPayLoad: {
                        page_size: pageSize?.value,
                        page: currentPage,
                        col_name: colName,
                        order_by: order,
                        searchText: searchText,
                    }
                })
            );
            setShowUserDeleteModal(false);
            setUserDto(null)
        }
    }
    const handleMultiSelectUser = (id: any, e: any) => {
        if (e.target.checked) {
            setMultiSelectUserForDelete([...multiSelectUserForDelete, id])
        }
        if (!e.target.checked) {
            setMultiSelectUserForDelete(multiSelectUserForDelete?.filter((res: any) => {
                return res !== id
            }))
        }
    }
    // Initialize form fileds for search user.
    const handleAdvanceSearchForm = () => setShowAdvanceSearch(!showAdvanceSearch);

    const options = [
        { value: 1, label: 'Active' },
        { value: 2, label: 'Deactive' },
        { value: 0, label: 'Inactive' }
    ];

    const handleDropdownChange = (selectedOption: any) => {
        formikSearch.setFieldValue("status", selectedOption);
    };

    const handleResetForm = async () => {
        formikSearch.resetForm();
        setCurrentPage(1)
        setPageSize({ value: 10, label: 10 })
        dispatch(
            getUserList({
                ...userListPayload,
                page_size: 10,
                page: 1,
                "role_id": "",
                "name": "",
                "start_date": "",
                "end_date": "",
                "email": "",
                "status": "",
                is_filter: false
            })
        );
        setShowResetAdvanceSearch(false);
    };

    const handleCloseAddUserForm = () => setShowAddUserForm(false);
    const handleShowAddUserForm = () => {
        setShowAddUserForm(true);
    }
    const handlEditUser = (data: any, view: string) => {
        navigate(`/user-management-${view}/${data?.id}`)
    }
    // Return all the states and functions
    return {
        pageSize,
        handlePageChange,
        currentPage,
        setCurrentPage,
        isUserListLoading,
        userList,
        showUserListView,
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
        handleMultiSelectUser,
        multiSelectUserForDelete,
        handleSelectAll,
        showAddUserForm,
        handleCloseAddUserForm,
        handleShowAddUserForm,
        userRoleList,
        regions,
        handlEditUser,
        selectAllUser,
        setIsDeleted,
        setSearchText,
        formikSearch,
        showAdvanceSearch,
        setShowAdvanceSearch,
        handleAdvanceSearchForm,
        handleShowAdvanceSearch,
        options,
        handleDropdownChange,
        handleResetForm,
        showResetAdvanceSearch,
        isDeleted,
        setMultiSelectUserForDelete,
        navigate,
        startMaxDate,
        setStartMaxDate,
        endMinDate,
        setEndMinDate,
        setIsStartDate,
        handleLoginActivity,
        isLoadingActivityLog, 
        loginActivityData,
        handleUserGuideDownload,
        fileDownloadLoading
    };
};

// Exporting the custom hook for use in other components
export default UserManagementController;

