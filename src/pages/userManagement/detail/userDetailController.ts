import { useEffect, useState } from "react";
import {
    getUserDetailById, deleteUser, getFileUploadedDetail, updateUserStatus, getUserActivity
} from "store/user/userSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useParams, useNavigate } from "react-router-dom";
import { regionShow, getDivisionList } from "../../../store/commonData/commonSlice";
import { getFileStatusCode, isCompanyEnable } from "utils";
import { filedownloadContainer } from "store/file/fileSlice";
import { toast } from "react-toastify";
import { companySlug, valueConstant } from "constant";
import { getStatus, userBackLink } from "../editUser/editUserController"
/**
 * A custom hook that contains all the states and functions for the UserDetailController
 */

const UserDetailController = () => {

    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [isStatusUpdate, setIsStatusUpdate] = useState<boolean>(false)
    const [isFileDownloadingDetail, setIsFileDownloadingDetail] = useState({ id: null, isDownloading: false })

    const dispatch = useAppDispatch();


    const params = useParams();
    const navigate = useNavigate()

    const { regions, divisions } = useAppSelector((state: any) => state.commonData);
    const { singleUserDetail, userFilListDetail, isUserListByIdLoading, userFileListLoading } = useAppSelector((state: any) => state.user);
    const { fileDownloadLoading } = useAppSelector((state: any) => state.file)
    const { loginDetails } = useAppSelector((state: any) => state.auth)


    const handleDeleteUser = () => {
        const payloadData = {
            user_id: [params?.userId],
        };
        dispatch(
            deleteUser({
                data: payloadData,
                userPayLoad: {
                    navigate: navigate,
                    isDetail: true,
                    userId: params?.userId,
                },
            })
        );
        setIsDeleted(false);
    };

    const handleDownloadFile = async (file: any) => {
        setIsFileDownloadingDetail({ id: file.id, isDownloading: true })
        let backFolderPath = file?.base_path.split("/");
        backFolderPath?.pop();
        const resultString = backFolderPath?.join("/");
        const dataPayload = {
            file_management_id: file?.id,
            fileName: file?.name,
            folderPath: resultString,
            status: getFileStatusCode("Analyzed"),
            downloadPath: resultString ? resultString + "/" + file?.name : file?.name,
        };
        await dispatch(
            filedownloadContainer({
                data: dataPayload
            })
        );
        setIsFileDownloadingDetail({ id: null, isDownloading: false })
    };

    const handleUpdateUserStatus = () => {
        const newStatus = getStatus(singleUserDetail?.data?.userDetail.status);
        const payloadData = {
            user_id: [params?.userId],
            status: newStatus,
        };
        dispatch(
            updateUserStatus({
                data: payloadData,
                userPayLoad: {
                    isDetail: true,
                    userId: params?.userId,
                },
            })
        );

        setIsStatusUpdate(false)
        dispatch(getUserActivity({
            user_id: params?.userId,
            page_number: 1,
            page_size: 10
        },))
    };

    const statusList = [
        { label: "Activate", value: valueConstant?.STATUS_ACTIVE },
        { label: "Deactivate", value: valueConstant?.STATUS_DEACTIVATE }
    ]
    let  isPepsiClient = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);
    useEffect(() => {
        if (params?.userId) {
            if (isPepsiClient) {
                dispatch(getDivisionList())
            } else {
                dispatch(regionShow({ division_id: "" }));
            }
            dispatch(getUserDetailById({ user_id: params?.userId }))
            dispatch(getFileUploadedDetail({ user_id: params?.userId }))
        }
    }, [dispatch, params, isPepsiClient]);

    const backLinkUrl = () => {
        return userBackLink(params?.roleId)
    }

    const handleChangeStatus = (status: { value: number, label: string }) => {
        if (singleUserDetail?.data?.userDetail?.status === status?.value) {
            toast.error(`You can't ${status?.label.toLowerCase()} the user because user status is already ${status?.label.toLowerCase()}`)
        }
        else {
            setIsStatusUpdate(true)
        }
    }

    // Return all the states and functions
    return {
        isUserListByIdLoading,
        singleUserDetail,
        regions,
        statusList,
        setIsDeleted,
        userFilListDetail,
        setIsStatusUpdate,
        backLinkUrl,
        handleChangeStatus,
        isDeleted,
        isStatusUpdate,
        handleDownloadFile,
        handleDeleteUser,
        handleUpdateUserStatus,
        fileDownloadLoading,
        userFileListLoading,
        isFileDownloadingDetail,
        isPepsiClient,
        divisions
    };
}
// Exporting the custom hook for use in other components
export default UserDetailController;
