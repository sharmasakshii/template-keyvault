import { scopeSlug, routeKey } from 'constant';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotificationListing } from 'store/commonData/commonSlice';
import { getBaseUrl, isApplicationTypeChecked } from "utils";
import { toast } from "react-toastify";

/**
 * 
 * @returns All the states and functions for DashboardView
 */

const HeaderController = () => {
    // Define constant 
    const dispatch = useAppDispatch()
    const [scope, setScope] = useState(scopeSlug?.scope3)
    const navigate = useNavigate()
    const { isSidebarOpen, pageTitle, isLoadingNotification, notificationDetail } = useAppSelector((state: any) => state.commonData)
    const [notification, setNotification] = useState<boolean>(false)
    const { loginDetails, userProfile, scopeType, applicationTypeStatus } = useAppSelector((state: any) => state.auth);

    const handleClose = () => {
        setNotification((prev: boolean) => !prev);
    };

    useEffect(() => {
        dispatch(getNotificationListing())
    }, [dispatch])
    useEffect(() => {
        if (notification) {
            dispatch(getNotificationListing())
        }
    }, [dispatch, notification])

    useEffect(() => {
        setScope(scopeType)
    }, [scopeType])

    const moveToNextPage = async (scope: any) => {
        if (!isApplicationTypeChecked(loginDetails?.data?.permissionsData || [], routeKey.AdministratorAccess) && scope === scopeSlug?.scope1 && !userProfile?.data?.scope_1) {
            toast.error("Scope 1 onboarding is not yet complete. You’ll be able to access Scope 1 once the admin finalizes the onboarding process.")
        } else {
            setScope(scope)
            navigate(getBaseUrl(loginDetails?.data, scope, userProfile?.data));
        }
    }

    //  All the states and functions returned
    return {
        userProfile,
        notification,
        pageTitle,
        loginDetails,
        applicationTypeStatus,
        isLoadingNotification,
        notificationDetail,
        handleClose,
        dispatch,
        isSidebarOpen,
        scope,
        scopeSlug,
        moveToNextPage
    };
};

export default HeaderController;