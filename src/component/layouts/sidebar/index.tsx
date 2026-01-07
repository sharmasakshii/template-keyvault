import { Accordion } from 'react-bootstrap';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from "react-router-dom";
import ImageComponent from "../../images"
import { checkRolePermission, getBaseUrl, isCompanyEnable, typeCheck, isPermissionChecked, isApplicationTypeChecked, getActiveClass, getAdminUrl } from 'utils';
import SidebarController from './sidebarController';
import { companySlug, scopeSlug, routeKey } from "constant"
import { openSidebar } from 'store/commonData/commonSlice';
import ChatListView from 'pages/aiAgent/ChatList/ChatListView';
import ButtonComponent from 'component/forms/button';
import ConfirmBox from 'component/DailogBox/ConfirmBox';
import { resetLanePlanning } from 'store/scopeThree/track/lane/laneDetailsSlice';

const getApplicationTypeTitle = (applicationTypeStatus: any) => applicationTypeStatus ? "Switch to Dashboard"
    : "Switch to Admin"

const getSidebarOpenClass = (isSidebarOpen: any) => isSidebarOpen ? {
    mainsidebar: "",
    closeBar: ""
} : {
    mainsidebar: "closeSidebar",
    closeBar: "d-none"
}

const getActiveLiClass = (location: any, path: any) => location.pathname.includes(path) ? "active py-0" : " py-0";

const SidebarLayout = () => {
    const {
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
        resertOnBoardModal,
    } = SidebarController()
    const permissionsDto = loginDetails?.data?.permissionsData || []



    return (
        <div data-testid="sidebar-layout" className={`mainsidebar ${getSidebarOpenClass(isSidebarOpen).mainsidebar}`}>
            <div className="sidebarLogo">
                <ImageComponent path="/images/login/greensightLogo.png" className="greensightLogo img-fluid" />
                <ImageComponent testid="close-sidebar" handleOnClick={() => dispatch(openSidebar(!isSidebarOpen))} path="/images/hamburgerClose.svg" className={`closedIcon img-fluid ${getSidebarOpenClass(isSidebarOpen).closeBar}`} />
            </div>
            <div className="sidebarnav-wrapper">
                <Accordion>
                    <Nav className="flex-column">
                        {!applicationTypeStatus && scopeType === scopeSlug?.scope3 && <>
                            <NavItem className="position-relative mb-2">
                                <NavLink to={getBaseUrl(loginDetails?.data, scopeType)} className={getActiveClass(["/regional-level", "/sustainable"], location, true)}>
                                    <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Dashboard">
                                        <ImageComponent path="/images/sidebar/dashboardicon.svg" />
                                        <h4 className="mb-0 navText">Dashboard</h4>
                                    </div>
                                </NavLink>
                            </NavItem>

                            {isPermissionChecked(permissionsDto, routeKey?.Segmentation)?.isChecked &&
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className={!location.pathname.includes("/regional-level") ? getActiveClass(["/regional", "/division", "/business-unit", "/region-overview", "/lanes", "/ev-dashboard", "/master-dashboard", "/ev-network", "/facility", "/carrier", "/by-carrier-type", "/RNG", "/optimus", "/alternative-fuel", "/fuel", "/vehicle", "/intermodal-report"], location, true) : ''}>
                                        <div >
                                            <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Track">
                                                <ImageComponent path="/images/sidebar/trackIcon.svg" />
                                                <h4 className="mb-0 navText">Track</h4>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body className='pe-0 ps-3'>
                                        <Nav className="">
                                            {!checkRolePermission(loginDetails?.data, "regionalManager") && <NavItem>
                                                <NavLink to="/scope3/regional" className={typeCheck((location.pathname !== "/regional-level" && location.pathname.includes("/region")), "active", "")}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Region">
                                                        <ImageComponent path="/images/sidebar/byregion.svg" />
                                                        <h4 className="mb-0 navText navTextChild">By Region</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>

                                            }

                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.bmb]) && <NavItem>
                                                <NavLink to="/scope3/by-carrier-type" className={getActiveClass(["/by-carrier-type"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Division">
                                                        <ImageComponent path="/images/sidebar/bydivision.svg" />
                                                        <h4 className="mb-0 navText navTextChild">By Carrier Type</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}

                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.lw]) && <NavItem>
                                                <NavLink to="/scope3/facility" className={getActiveClass(["/facility"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Facility">
                                                        <ImageComponent path="/images/sidebar/byfacility.svg" />
                                                        <h4 className="mb-0 navText navTextChild">By Facility</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}

                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo]) && <>
                                                <NavItem>
                                                    <NavLink to="/scope3/business-unit" className={getActiveClass(["/business-unit"], location, false)}>
                                                        <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Business Unit">
                                                            <ImageComponent path="/images/sidebar/byfacility.svg" />
                                                            <h4 className="mb-0 navText navTextChild">By Business Unit</h4>
                                                        </div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink to="/scope3/division" className={getActiveClass(["/division"], location, false)}>
                                                        <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Division">
                                                            <ImageComponent path="/images/sidebar/bydivision.svg" />
                                                            <h4 className="mb-0 navText navTextChild">By Division</h4>
                                                        </div>
                                                    </NavLink>
                                                </NavItem>
                                            </>
                                            }
                                            {!isCompanyEnable(dataCheck?.userdata, [companySlug?.adm, companySlug?.tql]) && <NavItem>
                                                <Accordion className="newaccordian">
                                                    <Accordion.Item eventKey="1">
                                                        <Accordion.Header className="pe-0">
                                                            <Nav>
                                                                <NavItem>
                                                                    <NavLink to="/scope3/carrier" className={getActiveClass(["/carrier"], location, false)}>
                                                                        <div className="d-flex align-items-center gap-2 p-0 navitemtxtWrapper " data-toggle="tooltip" data-placement="right" title="By Carrier">
                                                                            <ImageComponent path="/images/sidebar/bycarrier.svg" />
                                                                            <h4 className="mb-0 navText navTextChild">By Carrier</h4>
                                                                        </div>
                                                                    </NavLink>
                                                                </NavItem>
                                                            </Nav>
                                                        </Accordion.Header>
                                                        <Accordion.Body className="ps-3">
                                                            <Nav>
                                                                <NavItem>
                                                                    <NavLink to="/scope3/carrier-comparison" className="py-2 pb-0">
                                                                        <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper pb-1 pt-0" data-toggle="tooltip" data-placement="right" title="Carrier Comparision">
                                                                            <ImageComponent path="/images/sidebar/carrierComparision.svg" />
                                                                            <h4 className="mb-0 navText navTextChild">Carrier Comparison</h4>
                                                                        </div>
                                                                    </NavLink>
                                                                </NavItem>
                                                            </Nav>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            </NavItem>}

                                            <NavItem>
                                                <NavLink to="/scope3/lanes" className={getActiveLiClass(location, "/lanes")}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Lane">
                                                        <ImageComponent path="/images/sidebar/bylane.svg" />
                                                        <h4 className="mb-0 navText navTextChild">By Lane</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>

                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.adm]) && <NavItem>
                                                <NavLink to="/scope3/fuel" className={getActiveClass(["/fuel"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Fuel">
                                                        <ImageComponent path="/images/sidebar/byFuel.svg" />
                                                        <h4 className="mb-0 navText navTextChild">By Fuel</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}

                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.tql]) && <NavItem>
                                                <NavLink to="/scope3/trailer" className={getActiveClass(["/trailer"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Trailer">
                                                        <ImageComponent path="/images/sidebar/byTrail.svg" />
                                                        <h4 className="mb-0 navText navTextChild">By Trailer</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}

                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.adm]) && <NavItem>
                                                <NavLink to="/scope3/vehicle" className={getActiveClass(["/vehicle"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="By Vehicle">
                                                        <ImageComponent path="/images/sidebar/byVehicle.svg" />
                                                        <h4 className="mb-0 navText navTextChild">By Vehicle</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}

                                            {(isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo]) && isPermissionChecked(permissionsDto, routeKey?.EvDashboard)?.isChecked) &&
                                                <NavItem className="">
                                                    <NavLink to="/scope3/master-dashboard" className={typeCheck((location.pathname === "/master-dashboard" || location.pathname.includes("/ev-dashboard")), "active", "")}>
                                                        <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="EV Dashboard">
                                                            <ImageComponent path="/images/sidebar/ev-dashboard.svg" />
                                                            <h4 className="mb-0 navText navTextChild">EV Dashboard</h4>
                                                        </div>
                                                    </NavLink>
                                                </NavItem>}
                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep]) && (
                                                <>
                                                    <NavItem className="">
                                                        <NavLink to="/scope3/optimus" className={getActiveLiClass(location, "/optimus")}>
                                                            <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="EV Network">
                                                                <ImageComponent path="/images/sidebar/optimus.svg" />
                                                                <h4 className="mb-0 navText navTextChild">Optimus Network</h4>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem className="">
                                                        <NavLink to="/scope3/ev-network" className={getActiveLiClass(location, "/ev-network")}>
                                                            <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="EV Network">
                                                                <ImageComponent path="/images/sidebar/ev.svg" />
                                                                <h4 className="mb-0 navText navTextChild">EV Network</h4>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                </>
                                            )}
                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep,companySlug?.bmb, companySlug?.demo]) && <NavItem className="">
                                                <NavLink to="/scope3/alternative-fuel" className={getActiveLiClass(location, "/alternative")}>
                                                    <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Alternative Fuel">
                                                        <ImageComponent path="/images/sidebar/byFuel.svg" />
                                                        <h4 className="mb-0 navText navTextChild">Alternative Fuels</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}
                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo]) && <NavItem className="">
                                                <NavLink to="/scope3/emission-saving-report" className={getActiveLiClass(location, "/emission-saving-report")}>
                                                    <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Emissions Saving Report">
                                                        <ImageComponent path="/images/sidebar/byFuel.svg" />
                                                        <h4 className="mb-0 navText navTextChild">Emissions Saving Report</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}
                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.bmb]) && <NavItem className="">
                                                <NavLink to="/scope3/intermodal-report" className={getActiveLiClass(location, "/intermodal-report")}>
                                                    <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Emissions Saving Report">
                                                        <ImageComponent path="/images/sidebar/intermodalReport.svg" />
                                                        <h4 className="mb-0 navText navTextChild">Intermodal Report</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}
                                        </Nav>
                                    </Accordion.Body>
                                </Accordion.Item>}
                            {isPermissionChecked(permissionsDto, routeKey?.Benchmarks)?.isChecked &&
                                <NavItem className="position-relative mb-2">
                                    <NavLink to="/scope3/benchmarks" className={getActiveClass(["/benchmarks"], location, true)}>
                                        <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Benchmark">
                                            <ImageComponent path="/images/sidebar/benchmarksIcon.svg" />
                                            <h4 className="mb-0 navText">Benchmarks</h4>
                                        </div>
                                    </NavLink>
                                </NavItem>}
                            {isApplicationTypeChecked(permissionsDto, routeKey?.Recommendations) &&
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header className={getActiveClass(["/decarb", "/lane-planning", "/bid-", "/reports"], location, true)}>
                                        <div >
                                            <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Act">
                                                <ImageComponent path="/images/sidebar/act.svg" />
                                                <h4 className="mb-0 navText">Act</h4>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body className='ps-3'>
                                        <Nav className="d-flex flex-column">
                                            <NavItem>
                                                <NavLink to="/scope3/decarb" className={getActiveClass(["/decarb"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Decarb Levers">
                                                        <ImageComponent path="/images/sidebar/decarb.svg" />
                                                        <h4 className="mb-0 navText navTextChild">Decarb Levers</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink to="/scope3/lane-planning" onClick={() => {
                                                    dispatch(resetLanePlanning());

                                                }} className={getActiveClass(["/lane-planning"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Lane Planning">
                                                        <ImageComponent path="/images/sidebar/laneScenario.svg" />
                                                        <h4 className="mb-0 navText navTextChild">Lane Planning</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>
                                            {isPermissionChecked(permissionsDto, routeKey?.BidPlanning)?.isChecked && <NavItem>
                                                <NavLink to="/scope3/bid-planning" className={getActiveClass(["/bid-"], location, false)}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Lane Planning">
                                                        <ImageComponent path="/images/sidebar/bidPlanning.svg" />
                                                        <h4 className="mb-0 navText navTextChild">Bid Planning</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>}
                                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo, companySlug?.rb]) &&
                                                <NavItem>
                                                    <NavLink to="/scope3/reports" className={getActiveClass(["/report"], location, false)}>
                                                        <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Decarb Discovery">
                                                            <ImageComponent path="/images/sidebar/reports.svg" />
                                                            <h4 className="mb-0 navText navTextChild">Decarb Discovery</h4>
                                                        </div>
                                                    </NavLink>
                                                </NavItem>
                                            }
                                        </Nav>
                                    </Accordion.Body>
                                </Accordion.Item>
                            }

                            {isPermissionChecked(permissionsDto, routeKey?.Manage)?.isChecked &&

                                <Accordion.Item eventKey="3">
                                    <Accordion.Header className={(location.pathname.includes("/project") ? "activebar" : "")}>
                                        <div >
                                            <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Manage">

                                                <ImageComponent path="/images/sidebar/manageIcon.svg" />
                                                <h4 className="mb-0 navText">Manage</h4>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body className='ps-3'>
                                        <Nav className="d-flex flex-column">
                                            <NavItem>
                                                <NavLink to="/scope3/projects" className={location.pathname.includes("/project") ? "active" : ""}>
                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Projects">
                                                        <ImageComponent path="/images/sidebar/project.svg" />
                                                        <h4 className="mb-0 navText navTextChild">Projects</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Accordion.Body>
                                </Accordion.Item>
                            }
                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo]) && <NavItem className="position-relative mb-2">
                                <NavLink to="/scope3/fuel-location" className={getActiveClass(["/fuel-location"], location, true)}>
                                    <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Fuel Locations">
                                        <ImageComponent path="/images/sidebar/fuelStop.svg" />
                                        <h4 className="mb-0 navText">Fuel Locations</h4>
                                    </div>
                                </NavLink>
                            </NavItem>
                            }
                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo]) && loginDetails?.data?.chatbot_access && <NavItem className="position-relative mb-2">
                                <NavLink to="/scope3/ai-agent" className={getActiveClass(["/ai-agent"], location, true)}>
                                    <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="GreenSight GPT">
                                        <ImageComponent path="/images/sidebar/gpt-ai.svg" />
                                        <h4 className="mb-0 navText">GreenSight GPT</h4>
                                    </div>
                                </NavLink>
                            </NavItem>}

                            <NavItem className="position-relative mb-2">
                                <NavLink to="/scope3/settings" className={(navData) => (navData.isActive ? 'activebar active' : '')}>
                                    <div data-testid="userSettings" className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="User Settings">
                                        <ImageComponent path="/images/sidebar/iconWhite-6.svg" />
                                        <h4 className="mb-0 navText">User Settings</h4>
                                    </div>
                                </NavLink>
                            </NavItem>
                            <NavItem className="position-relative mb-2">
                                <NavLink to="/scope3/knowledge-hub" className={(navData) => (navData.isActive ? 'activebar active' : '')}>
                                    <div data-testid="knowledgeHub" className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Knowledge Hub">
                                        <ImageComponent path="/images/sidebar/knowledge.svg" />
                                        <h4 className="mb-0 navText">Knowledge Hub</h4>
                                    </div>
                                </NavLink>
                            </NavItem>

                        </>}


                        {applicationTypeStatus === "admin" && <>
                            <NavItem className="position-relative mb-2 opacity-50">
                                <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Comming Soon">
                                    <ImageComponent path="/images/sidebar/dashboardicon.svg" />
                                    <h4 className="mb-0 navText">Dashboard</h4>
                                </div>
                            </NavItem>
                            {isPermissionChecked(permissionsDto, routeKey?.UserManagement)?.isChecked &&

                                <Accordion.Item eventKey="5" className="position-relative mb-2">
                                    <Accordion.Header className={(location.pathname.includes("/user-management") ? "activebar barPosition" : "")}>
                                        <Nav>
                                            <NavItem>
                                                <NavLink to="/user-management" className={typeCheck(location.pathname.includes("/user"), "active", "")}>
                                                    <div className="d-flex align-items-center gap-2 p-0 navitemtxtWrapper " data-toggle="tooltip" data-placement="right" title="User Management">
                                                        <ImageComponent path="/images/sidebar/userManagement.svg" />
                                                        <h4 className="mb-0 navText pe-0">User Management</h4>
                                                    </div>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Accordion.Header>
                                    {isPermissionChecked(permissionsDto, routeKey?.RoleManagement)?.isChecked &&

                                        <Accordion.Body>
                                            <Nav className="d-flex flex-column ">
                                                <NavItem>
                                                    <NavLink to="/role-management" className={location.pathname.includes("/role-management") ? "activebar barPosition" : ""}>
                                                        <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Role Management">
                                                            <ImageComponent path="/images/sidebar/roleManagement.svg" />
                                                            <h4 className="mb-0 navText role-txt">Role Management</h4>
                                                        </div>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </Accordion.Body>}
                                </Accordion.Item>}
                            {isPermissionChecked(permissionsDto, routeKey?.DataManagement)?.isChecked &&

                                <NavItem className="position-relative mb-2">
                                    <NavLink to="/data-management" className={(navData) => (navData.isActive ? 'activebar' : '')}>
                                        <div data-testid="data-management" className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Data Management">
                                            <ImageComponent path="/images/sidebar/dataManagement.svg" />
                                            <h4 className="mb-0 navText pe-0">Data Management</h4>
                                        </div>
                                    </NavLink>
                                </NavItem>
                            }
                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.demo]) &&
                                <>
                                    <NavItem className="position-relative mb-2">
                                        <div className="togglwSwitch-btn pb-0 ps-0">
                                            <ButtonComponent
                                                onClick={() =>
                                                    setShowResertOnBoardModal({ isOpen: true, id: 1 })
                                                }
                                                btnClass="btn-deepgreen d-flex align-items-center gap-2 navitemtxtWrapper w-90"
                                            >
                                                <ImageComponent path="/images/header/switch-admin.svg" />
                                                <h4 className="mb-0 navText pe-0 text-start">Reset Scope1 Onboarding</h4>
                                            </ButtonComponent>
                                        </div>
                                    </NavItem>
                                    <NavItem className="position-relative mb-2">
                                        <div className="togglwSwitch-btn pb-0 ps-0">
                                            <ButtonComponent
                                                onClick={() =>
                                                    setShowResertOnBoardModal({ isOpen: true, id: 2 })
                                                }
                                                btnClass="btn-deepgreen d-flex align-items-center gap-2 navitemtxtWrapper w-90"
                                            >
                                                <ImageComponent path="/images/header/switch-admin.svg" />
                                                <h4 className="mb-0 navText pe-0 text-start">Reset Scope2 Onboarding</h4>
                                            </ButtonComponent>
                                        </div>
                                    </NavItem>

                                </>}
                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep, companySlug?.demo, companySlug?.rb]) &&
                                <NavItem className="position-relative mb-2">
                                    <NavLink data-testid="lane-setting" to="/lane-setting" className={(navData) => (navData.isActive ? 'activebar' : '')}>
                                        <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Lane Settings">
                                            <ImageComponent path="/images/sidebar/laneSetting.svg" />
                                            <h4 className="mb-0 navText pe-0">Lane Settings</h4>
                                        </div>
                                    </NavLink>
                                </NavItem>
                            }

                            <NavItem className="position-relative mb-2 opacity-50">
                                <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Comming Soon">
                                    <ImageComponent path="/images/sidebar/appManagement.svg" />
                                    <h4 className="mb-0 navText">Application Management</h4>
                                </div>
                            </NavItem>
                        </>}

                    </Nav>
                </Accordion>
                <Accordion defaultActiveKey={['4']} alwaysOpen>
                    <Nav className="flex-column">
                        {applicationTypeStatus !== "admin" && scopeType === scopeSlug?.scope1 && <>
                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.demo]) &&
                                <NavItem className="position-relative mb-2">
                                    <NavLink to="/scope1/fuel-report" className={(navData) => (navData.isActive ? 'activebar' : '')}>
                                        <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Fuels Report">
                                            <ImageComponent path="/images/sidebar/fuelReport.svg" />
                                            <h4 className="mb-0 navText">Fuels Report</h4>
                                        </div>
                                    </NavLink>
                                </NavItem>
                            }
                            {isCompanyEnable(dataCheck?.userdata, [companySlug?.pep]) && <> <Accordion.Item eventKey="4">
                                <Accordion.Header className={getActiveClass(["/fuel-report"], location, true)}>
                                    <div>
                                        <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="Manage">
                                            <ImageComponent path="/images/sidebar/fuelReport.svg" />
                                            <h4 className="mb-0 navText">Fuels Report</h4>
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body className='ps-3'>
                                    <Nav className="d-flex flex-column">
                                        <NavItem>
                                            <NavLink to="/scope1/fuel-report/PBNA" className={location.pathname.includes("/fuel-report/PBNA") ? "active" : ""}>
                                                <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="PBNA">
                                                    <ImageComponent path="/images/sidebar/byFuel.svg" />
                                                    <h4 className="mb-0 navText navTextChild">PBNA</h4>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <Accordion className="newaccordian">
                                                <Accordion.Item eventKey="6">
                                                    <Accordion.Header className={`pe-0 fuel-list ${getActiveClass(["/fuel-report/PFNA/Bulk", "/fuel-report/PFNA/Cng", "/fuel-report/PFNA/Rd"], location, true)}`}>
                                                        <Nav>
                                                            <NavItem>
                                                                <NavLink to="/scope1/fuel-report/PFNA" className={getActiveClass(["/Bulk", "/Cng", "/RD", "/B100"], location, false)}>
                                                                    <div className="d-flex align-items-center gap-2 p-0 navitemtxtWrapper " data-toggle="tooltip" data-placement="right" title="PFNA">
                                                                        <ImageComponent path="/images/sidebar/fuelStop.svg" />
                                                                        <h4 className="mb-0 navText navTextChild">PFNA</h4>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                        </Nav>
                                                    </Accordion.Header>
                                                    <Accordion.Body className="ps-3">
                                                        <Nav>
                                                            <NavItem>
                                                                <NavLink to="/scope1/fuel-report/PFNA/Bulk" className="py-2 pb-0">
                                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper pb-1 pt-0 mb-3" data-toggle="tooltip" data-placement="right" title="Bulk">
                                                                        <ImageComponent path="/images/sidebar/byFuel.svg" />
                                                                        <h4 className="mb-0 navText navTextChild">Bulk</h4>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink to="/scope1/fuel-report/PFNA/Cng" className="py-2 pb-0">
                                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper pb-1 pt-0 mb-3" data-toggle="tooltip" data-placement="right" title="CNG">
                                                                        <ImageComponent path="/images/sidebar/fuelStop.svg" />
                                                                        <h4 className="mb-0 navText navTextChild">CNG</h4>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink to="/scope1/fuel-report/PFNA/Rd" className="py-2 pb-0">
                                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper pb-1 pt-0 mb-3" data-toggle="tooltip" data-placement="right" title="Renewable Diesel">
                                                                        <ImageComponent path="/images/sidebar/rd.svg" />
                                                                        <h4 className="mb-0 navText navTextChild">Renewable Diesel</h4>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink to="/scope1/fuel-report/PFNA/B100" className="py-2 pb-0">
                                                                    <div className="d-flex align-items-center gap-2 childGap navitemtxtWrapper pb-1 pt-0 mb-3" data-toggle="tooltip" data-placement="right" title="B100">
                                                                        <ImageComponent path="/images/sidebar/b100-icon.svg" />
                                                                        <h4 className="mb-0 navText navTextChild">B100 Report</h4>
                                                                    </div>
                                                                </NavLink>
                                                            </NavItem>
                                                        </Nav>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </NavItem>
                                    </Nav>
                                </Accordion.Body>
                            </Accordion.Item></>}

                            <NavItem className="position-relative mb-2 opacity-50">
                                <div className="d-flex align-items-center gap-2 navitemtxtWrapper" data-toggle="tooltip" data-placement="right" title="User Settings">
                                    <ImageComponent path="/images/sidebar/iconWhite-6.svg" />
                                    <h4 className="mb-0 navText">User Settings</h4>
                                </div>
                            </NavItem>
                        </>}
                    </Nav>
                </Accordion>
            </div>
            <div className='ai-sidebar'>
                {applicationTypeStatus === "chatbot" && scopeType === scopeSlug?.scope3 && <ChatListView />}
            </div>
            <div className="scope-wrapper">
                <Nav className="flex-column">
                    {isApplicationTypeChecked(loginDetails?.data?.permissionsData ?? [], routeKey.AdministratorAccess) && applicationTypeStatus !== "chatbot" && (
                        <NavItem>
                            <NavLink to={`${applicationTypeStatus ? getBaseUrl(loginDetails?.data, scopeType, userProfile?.data) : getAdminUrl(loginDetails?.data?.permissionsData ?? [])}`}>
                                <button
                                    type="button"
                                    data-testid="application-btn"
                                    className="d-flex align-items-center gap-2 mb-3 navitemtxtWrapper border-0 bg-transparent text-start w-100"
                                    onClick={() => handleToggleApplication(applicationTypeStatus ? "" : "admin")} data-toggle="tooltip"
                                    data-placement="right"
                                    title={getApplicationTypeTitle(applicationTypeStatus)}>
                                    <ImageComponent path="/images/header/switch-admin.svg" />
                                    <h4 className="mb-0 navText">{getApplicationTypeTitle(applicationTypeStatus)}</h4>
                                </button>
                            </NavLink>
                        </NavItem>
                    )}
                    <NavItem className='logout'>
                        <NavLink to={'/'}>
                            <button type="button" data-testid="logout-btn" className="d-flex align-items-center gap-2 mb-3 navitemtxtWrapper border-0 bg-transparent text-start w-100" onClick={handleLogout} data-toggle="tooltip" data-placement="right" title="Logout">
                                <ImageComponent path="/images/sidebar/logouticon.svg" />
                                <h4 className="mb-0 navText">Logout</h4>
                            </button>
                        </NavLink>
                    </NavItem>

                </Nav>
                <ImageComponent path="/images/powered-by.svg" className="pe-0 ps-3" />
            </div>
            <ConfirmBox
                show={showResertOnBoardModal?.isOpen}
                primaryButtonClick={() => setShowResertOnBoardModal({ isOpen: false, id: null })}
                handleClose={() => setShowResertOnBoardModal({ isOpen: false, id: null })}
                secondaryButtonClick={() => resertOnBoardModal()}
                modalHeader={`Do you want to reset scope${showResertOnBoardModal?.id} onboarding?`}
                primaryButtonText={"No"}
                primaryButtonClass="gray-btn font-14 px-4 py-2"
                secondaryButtonText={"Yes"}
                secondaryButtonclass="btn-deepgreen font-14 px-4 py-2"
            />
        </div >
    )
}

export default SidebarLayout