import HeaderController from "./headerController";
import ImageComponent from "component/images";
import Logo from "component/logo";
import Heading from "../../heading";
import { handleProfileImage, isCompanyEnable } from "utils";
import DateShow from "component/DateShow";
import ButtonComponent from "component/forms/button";
import moment from "moment";
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from "reactstrap";
import { openSidebar } from "store/commonData/commonSlice";
import { companySlug } from 'constant';
const Header = () => {
  // iporting all states and functions from dashboard controller
  const {
    userProfile,
    notification,
    pageTitle,
    loginDetails,
    isLoadingNotification,
    notificationDetail,
    handleClose,
    dispatch,
    isSidebarOpen,
    scope,
    scopeSlug,
    moveToNextPage
  } = HeaderController();

  return (
    <header data-testid="header-layout" className="dashboard_Header">
      <nav className="navbar navbar-expand-lg navbar-light py-0">
        <div className="container-fluid px-0">
          <div
            className="navbar-collapse d-flex justify-content-between flex-wrap gap-2"
            id="navbarSupportedContent"
          >

            <div className="d-flex gap-2 mb-2 mb-sm-0 align-items-center menu">
              {/* logo */}
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <ButtonComponent data-testid="open-sidebar" onClick={() => dispatch(openSidebar(!isSidebarOpen))} imagePath="/images/hamburger.svg" btnClass={`${isSidebarOpen ? "d-none" : "close-btn-sidebar p-0 border-0"} pe-0`} />
                </div>
                <div className=" lower-logo">
                  {userProfile?.data?.Company?.logo && (
                    <Logo path={userProfile?.data?.Company?.logo} name={"Logo"} />
                  )}
                </div>
              </div>
              <div className="verticleLine"></div>
            </div>
            {/* heading */}
            <div className="mainTopTitles">
              <h1 className="mb-1 fw-semibold">
                {pageTitle}
              </h1>
              <div className="latest-update">
                <DateShow />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-end rightTabs">
              <div className='scope-div'>
                <div>
                  <Button data-testid="scope-1" disabled={!isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])} className={`fuel-inner d-flex cursor ${scopeSlug?.scope1 === scope ? "active" : ""}`} onClick={() => { moveToNextPage(scopeSlug?.scope1) }}>

                    <Input
                      type="checkbox"
                      name="fuelOptions"
                      readOnly
                      checked={scopeSlug?.scope1 === scope}
                    />{" "}
                    Scope 1

                    <ImageComponent path={`${scopeSlug?.scope1 === scope ? "/images/scope/scope-1-white.svg" : "/images/scope/scope-1.svg"}`} className="pe-0 ps-1 fuelIcon" />
                  </Button>
                </div>
                <div>
                  <Button data-testid="scope-2" disabled={!isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])} className={`fuel-inner d-flex cursor ${scopeSlug?.scope2 === scope ? "active" : ""}`} onClick={() => { moveToNextPage(scopeSlug?.scope2) }}>
                    <Input
                      type="checkbox"
                      name="fuelOptions"
                      readOnly
                      checked={scopeSlug?.scope2 === scope}
                    />{" "}
                    Scope 2

                    <ImageComponent path={`${scopeSlug?.scope2 === scope ? "/images/scope/scope-2-white.svg" : "/images/scope/scope-2.svg"}`} className="pe-0 ps-1 fuelIcon scope2" />
                  </Button>
                </div>
                <div>
                  <Button className={`fuel-inner d-flex cursor ${scopeSlug?.scope3 === scope ? "active" : " "}`} onClick={() => { moveToNextPage(scopeSlug?.scope3) }}>

                    <Input
                      type="checkbox"
                      name="fuelOptions"
                      readOnly
                      checked={scopeSlug?.scope3 === scope}
                    />{" "}
                    Scope 3

                    <ImageComponent testid="notification-icon" path={`${scopeSlug?.scope3 === scope ? "/images/scope/scope-3-white.svg" : "/images/scope/scope-3.svg"}`} className="pe-0 ps-1 fuelIcon" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="d-flex gap-1 profile align-items-center">
              <div>
                <ButtonDropdown data-testid="notification-dropdown" isOpen={notification} toggle={handleClose}>
                  <DropdownToggle caret>
                    <ImageComponent testid="notification-caret" path="/images/header/notificationicon.svg" alt="notification Icon" className="pe-0" />

                    <span className="position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </DropdownToggle>
                  <DropdownMenu className={"action-btnlist flex-column gap-2 mt-1"}>
                    <DropdownItem header className="font-18 px-1 py-0 fw-bold text-start">Notifications</DropdownItem>
                    <DropdownItem divider />
                    {isLoadingNotification && <div className="graph-loader d-flex justify-content-center align-items-center">
                      <div className="spinner-border spinner-ui">
                        <span className="visually-hidden"></span>
                      </div>
                    </div>}
                    {!isLoadingNotification && (notificationDetail?.data?.length > 0 ? (
                      notificationDetail?.data?.map((notify: any) =>
                        <DropdownItem key={notify?.id} className="lineBottom">
                          <Heading
                            level="5"
                            content={notify?.description}
                            className="font-14 mb-1 fw-medium pre-wrap"
                          />
                          <Heading
                            level="6"
                            className="font-12 fw-light text-start mb-0"
                          >
                            {moment(notify?.created_on).format(
                              "YYYY-MM-DD, h:mm A"
                            )}
                          </Heading>
                        </DropdownItem>
                      )) : (
                      <div>
                        <h6 className="font-18 text-center mb-0 noNotification">
                          No notification found
                        </h6>
                      </div>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </div>

              <div className="d-flex gap-1 align-items-center userDetail-login">
                <div className="headerimg">
                  <ImageComponent
                    imageName="profile-img-auto.png"
                    path={userProfile?.data?.profile?.image}
                    handleImageError={handleProfileImage}
                    alt="user profile"
                  />
                </div>
                <div className="userHead_details">
                  <div className="d-flex justify-content-between align-items-center mb-0">
                    <h3 className="font-xxl-16 font-12 mb-0 fw-semibold">
                      {userProfile?.data?.profile?.first_name}{" "}
                      {userProfile?.data?.profile?.last_name}
                    </h3>
                  </div>
                  <p className="mb-0 font-xxl-10 font-8">
                    {userProfile?.data?.profile?.title}
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
