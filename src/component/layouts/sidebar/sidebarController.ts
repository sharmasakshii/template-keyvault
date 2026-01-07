import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { logoutPost , applicationType, resetOnboarding} from 'store/auth/authDataSlice';
import { useAuth } from 'auth/ProtectedRoute';
import { useState } from 'react';
/**
 * 
 * @returns All the states and functions for DashboardView
 */

const SidebarController = () => {
    // Define constant 
    const [showResertOnBoardModal, setShowResertOnBoardModal] = useState<{isOpen:boolean, id: number | null}>({isOpen:false, id: null})
    const location = useLocation();
    const dispatch = useAppDispatch()
    const {isSidebarOpen} = useAppSelector((state: any) => state.commonData)
    const { loginDetails, scopeType, userProfile, applicationTypeStatus } = useAppSelector((state: any) => state.auth);

    const navigate = useNavigate()

    // Logout function
    const handleLogout = () => {
        dispatch(logoutPost() as any);
        navigate("/")
    }
    const dataCheck = useAuth();

    const handleToggleApplication = (e: any) => {
        dispatch(applicationType(e))
    }

    const resertOnBoardModal = () => {
        dispatch(resetOnboarding({scope_id: showResertOnBoardModal?.id})).then(() => {
            setShowResertOnBoardModal({isOpen:false, id:null})
        })
    }
    //  All the states and functions returned
    return {
        dataCheck,
        handleLogout,
        applicationTypeStatus,
        location,
        loginDetails,
        isSidebarOpen,
        dispatch,
        scopeType,
        handleToggleApplication,
        userProfile,
        showResertOnBoardModal, setShowResertOnBoardModal,
        resertOnBoardModal
    };
};

export default SidebarController;