import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scopeSlug, routeKey } from "constant"
import { getBaseUrl, isApplicationTypeChecked } from "utils";
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { updateScopeType } from "store/auth/authDataSlice"
import { toast } from "react-toastify";

/**
 * Controller component for the LanesView page.
 * Manages state and logic for the LanesView page.
 * @returns All controllers and state variables for the LanesView page.
 */
const ScopeSelectionController = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [scope, setScope] = useState(scopeSlug?.scope3)
    const { loginDetails, userProfile } = useAppSelector((state: any) => state.auth);


    const moveToNextPage = async () => {
        if (!isApplicationTypeChecked(loginDetails?.data?.permissionsData || [], routeKey.AdministratorAccess) && scope === scopeSlug?.scope1 && !userProfile?.data?.scope_1) {
            toast.error("Scope 1 onboarding is not yet complete. You’ll be able to access Scope 1 once the admin finalizes the onboarding process.")
        } else {
            await dispatch(updateScopeType(scope))
            navigate(getBaseUrl(loginDetails?.data, scope, userProfile?.data));
        }
    }
    // Return the state variables and functions for use in the component
    return {
        setScope,
        scope,
        moveToNextPage,
        scopeSlug,
        loginDetails
    };
};

export default ScopeSelectionController;