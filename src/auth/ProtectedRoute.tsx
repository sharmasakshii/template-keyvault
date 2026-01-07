import { Navigate, Outlet, useLocation } from "react-router-dom";
import HeaderLayout from "../component/layouts/header";
import SidebarLayout from "../component/layouts/sidebar";
import { checkRolePermission, getLocalStorage, getBaseUrl, isApplicationTypeChecked, decryptDataFunction, normalizedList, isCompanyEnable } from "utils";
import { Suspense, useEffect, useRef } from "react";
import { BucketFileUpload } from "pages/bucket/fileUpload/BucketFileUpload";
import { useAppSelector, useAppDispatch } from "store/redux.hooks";
import { addUrl } from "../store/commonData/commonSlice";
import { applicationType, logoutPost, updateScopeType } from "store/auth/authDataSlice";
import Spinner from 'component/spinner';
import { scopeSlug, routeKey, companySlug } from "constant"
import SearchBar from "pages/aiAgent/SearchComponentView";

// Returns Is user is logged in or not
export const useAuth = () => {
  const userdata: any = getLocalStorage("persist:root");


  const updatedState = userdata && decryptDataFunction(JSON.parse(userdata?.loginDetails))?.data;
  return updatedState?.token
    ? { loggedIn: true, userdata: updatedState }
    : { loggedIn: false, userdata: updatedState };
};

export const bucketUseAuth = () => {
  const userdata: any = getLocalStorage("persist:root");
  const updatedState = userdata && decryptDataFunction(JSON.parse(userdata?.bucketLoginDetails))?.data;

  return userdata?.token
    ? { loggedIn: true, userdata: updatedState }
    : { loggedIn: false, userdata: updatedState };
};
// Checks AuthRouters and redirects them to dashboar
export const AuthRouteCheck = ({ children, scopeType, userProfile }: any) => {
  const { loginDetails } = useAppSelector((state: any) => state.auth);



  if (!loginDetails?.data?.token) {
    return children;
  } else if (loginDetails?.data?.login_count === 1) {
    return <Navigate to="/scope3/settings" />;
  }
  else {
    return <Navigate to={getBaseUrl(loginDetails?.data, scopeType, userProfile?.data)} />;
  }
};

export const AuthBucketLoginRouteCheck = ({ children }: any) => {
  const isAuthBucket = bucketUseAuth();

  if (!isAuthBucket?.loggedIn) {
    return children;
  } else {
    return <Navigate to={"/bucket-add"} />;
  }
};

export const OnBoardingRouteCheck = ({ children, userDetails, userProfile, urlKey }: any) => {
  if (userProfile?.data?.[urlKey]) {
    return <Navigate to="/" />
  } else if (!isApplicationTypeChecked(normalizedList(userDetails?.data?.permissionsData), routeKey.AdministratorAccess) && !userProfile?.is_onboarded) {
    return <Navigate to={"/page-not-found"} />;
  } else {
    return children;
  }
};

// Checks Routes except AuthRouters and redirects them to respective route or Login page
export const ProtectedRouteCheck = ({ isShowHeader }: any) => {
  const { loginDetails } = useAppSelector((state: any) => state.auth);

  if (!loginDetails?.data?.token) {
    return <Navigate to="/" />;
  }

  return <section className="insight_top_wrapper">
    <div className="mainDashboard ">
      <div className="DashboardWrapper w-100">
        {isShowHeader && <HeaderLayout />}
        <Suspense fallback={<Spinner spinnerClass='justify-content-center' />}>
          <div className="container-fluid g-0">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </div>
  </section>
};

export const ProtectedRouteBucket = () => {
  let isAuthBucket = bucketUseAuth();
  const isAuth = useAuth();

  if (!isAuth) {
    return <Navigate to="/bucket-login" />;
  } else if (checkRolePermission(isAuthBucket?.userdata, "blobUser")) {
    return <BucketFileUpload />;
  } else {
    // Return null or some default component in case no condition is met
    return <Navigate to={"/"} />;
  }
};

const Scope3ProtectedRoute = ({ urlKey, loginDetails, isOnBoard, company, scopePType, application = '', isShowHeader, userProfile }: any) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { pathname } = location;
  const previousPath = useRef<string | null>(null);
  const { regionalId, divisionId } = useAppSelector((state: any) => state.auth);
  const dataCheck = useAuth()
  let companyHasPermission = true;
  if (company) {
    companyHasPermission = company.includes(loginDetails?.data?.Company?.slug);
  }

  useEffect(() => {
    // Dispatch application type
    dispatch(applicationType(application));
    
    // Dispatch scope type
    dispatch(updateScopeType(scopePType));
  }, [application, scopePType, dispatch]);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      // Dispatch URL update
      dispatch(addUrl({ "url": pathname }));
    }
    previousPath.current = pathname;
  }, [pathname, dispatch]);

  if (isCompanyEnable(dataCheck?.userdata, [companySlug?.pep]) && checkRolePermission(loginDetails?.data, "divisionManager") && divisionId === "") {
    dispatch(logoutPost());
    return <Navigate to="/" />;
  }

  if (checkRolePermission(loginDetails?.data, "regionalManager") && regionalId === "") {
    dispatch(logoutPost());
    return <Navigate to="/" />;
  }

  if (!loginDetails?.data?.token) {
    return <Navigate to="/" />;
  }

  if (!companyHasPermission) {
    return <Navigate to="/" />;
  }

  if (scopePType !== scopeSlug.scope3 && application !== "chatbot") {
    if (!isOnBoard && !userProfile?.data?.[urlKey]) {
      return <Navigate to={`/${scopePType}/onboard`} />
    }
  }

  return (
    <ProtectedRouteWarper
      scopePType={scopePType}
      application={application}
      isShowHeader={isShowHeader}
      loginDetails={loginDetails}
    />
  );
};


const ProtectedRouteWarper = (props: any) => {
  const { scopePType, application, isShowHeader, loginDetails } = props
  const dataCheck = useAuth()
  switch (scopePType) {
    case "scope3":
      if (application === "chatbot") {
        return <section className="insight_top_wrapper">
          <div className="mainDashboard chatbotScreen position-relative">
            <SidebarLayout />
            <div className="chatbot-ai-screen">
              <Suspense fallback={<div className="spinner-outer"><Spinner spinnerClass='justify-content-center ' />
              </div>}>
                <div className="container-fluid">
                  <Outlet />
                </div>
              </Suspense>
            </div>
          </div>
        </section>
      } else {

        return <section className="insight_top_wrapper">
          <div className="mainDashboard position-relative">
            <SidebarLayout />
            <div className="DashboardWrapper">
              <HeaderLayout />
              <div className="dashboardScreen">
                <Suspense fallback={<div className="spinner-outer"><Spinner spinnerClass='justify-content-center ' />
                </div>}>
                  <div className="container-fluid">

                    {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo]) && loginDetails?.data?.chatbot_access && <SearchBar />}
                    <Outlet />
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      }
    case "scope2":
    case "scope1":
      return (
        <section className="insight_top_wrapper">
          {application === "dashboard" ? <div className="mainDashboard ">
            <div className="DashboardWrapper w-100">
              {isShowHeader && <HeaderLayout />}
              <Suspense fallback={<div className="spinner-outer"><Spinner spinnerClass='justify-content-center ' />
              </div>}>
                <div className="container-fluid g-0">
                  <Outlet />
                </div>
              </Suspense>
            </div>
          </div>
            : <div className="mainDashboard position-relative">
              <SidebarLayout />
              <div className="DashboardWrapper">
                <HeaderLayout />
                <div className="dashboardScreen">
                  <Suspense fallback={<div className="spinner-outer"><Spinner spinnerClass='justify-content-center' />
                  </div>}>
                    <div className="container-fluid">
                      <Outlet />
                    </div>
                  </Suspense>
                </div>
              </div>
            </div>
          }
        </section>
      )
    default: return null

  }
}

export default Scope3ProtectedRoute;
