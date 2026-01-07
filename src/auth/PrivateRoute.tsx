import { Navigate } from "react-router-dom";
import { isPermissionChecked, isApplicationTypeChecked, normalizedList } from "utils"
const RoutePermissionCheck = ({ children, permissionDto, routeKey, checkedChild }: any) => {
    const isAuthenticated = checkedChild ?  isApplicationTypeChecked(normalizedList(permissionDto?.data?.permissionsData), routeKey) : isPermissionChecked(normalizedList(permissionDto?.data?.permissionsData), routeKey)?.isChecked; // Example, replace this with your authentication logic

    if (isAuthenticated) {
        return children;
    } else {
        // Redirect to login page if not authenticated
        return <Navigate to="/page-not-found" />;
    }
};

export default RoutePermissionCheck