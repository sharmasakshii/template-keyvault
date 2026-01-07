import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getFiltersDate } from "../store/commonData/commonSlice";
import { checkRolePermission, isCompanyEnable } from "utils";
import Scope3ProtectedRoute, {
  AuthBucketLoginRouteCheck,
  AuthRouteCheck,
  ProtectedRouteBucket,
  OnBoardingRouteCheck,
  ProtectedRouteCheck,
} from "../auth/ProtectedRoute";
import RoutePermissionCheck from "../auth/PrivateRoute";
import { BucketFileUpload } from "pages/bucket/fileUpload/BucketFileUpload";
import BucketLoginView from "pages/bucket/login/BucketLogin";
import { companySlug, scopeSlug, routeKey } from "constant";
import Spinner from "component/spinner";
import { getUserDetails, getFuelStops } from "store/auth/authDataSlice";

const AiAgentSampleView = lazy(() => import("pages/aiAgent/AiAgentFullPage/AiAgentSampleView"));
const EmissionSavingReportView = lazy(() => import("pages/emissionSavingReport/EmissionSavingReportView"));
const PfnaFuelReportView = lazy(() => import("pages/scopeOne/pfnaFuelReport/PfnaFuelReportView"));
const AiAgentResponseView = lazy(() => import("pages/aiAgent/AiAgentFullPage/AiAgentResponseView"));
const BulkCngView = lazy(() => import("pages/scopeOne/bulkCng/BulkCngView"));
const FuelReportView = lazy(() => import("pages/scopeOne/fuelReport/FuelReportView"));
const EvDashboardView = lazy(() => import("pages/ev/evDashboard/EvDashboardView"));
const EvMasterView = lazy(() => import("pages/ev/ev-master/EvMasterView"));
const OnBoardView = lazy(() => import("pages/scopeOne/onBoard/OnBoardView"));
const ReportsView = lazy(() => import("pages/reports/ReportsView"));
const LaneSettingView = lazy(() => import("pages/laneSetting/LaneSettingView"));
const VehicleWrapperView = lazy(() => import("pages/vehicle/VehicleWrapper"));
const BidMatricsView = lazy(() => import("pages/bidsPlanning/BidMatricsView"));
const OutPutScreenView = lazy(() => import("pages/bidsPlanning/OutPutScreenView"));
const BidsPlanningView = lazy(() => import("pages/bidsPlanning/BidsPlanningView"));
const LaneSuggestionView = lazy(() => import("pages/lanePlanning/LanePlanningView"));
const LoginView = lazy(() => import("../pages/login/LoginView"));
const RegionalView = lazy(() => import("../pages/region/RegionalView"));
const CarrierTypeView = lazy(() => import("../pages/carrierType/CarrierTypeView"));
const CarrierTypeOverview = lazy(() => import("../pages/carrierTypeOverview/CarrierTypeOverview"));
const RegionOverview = lazy(() => import("../pages/regionOverview/RegionOverview"));
const FuelWrapperView = lazy(() => import("../pages/fuel/FuelWrapperView"));
const FuelOverviewView = lazy(() => import("../pages/fuelOverview/FuelOverviewView"));
const SustainView = lazy(() => import("../pages/sustainable/SustainView"));
const VendorView = lazy(() => import("../pages/carrier/VendorView"));
const RegionalLevelView = lazy(() => import("../pages/regionalLevel/RegionalLevelView"));
const AlternativeFuelView = lazy(() => import("../pages/alternativeFuel/AlternativeFuelView"));
const LaneView = lazy(() => import("../pages/lanes/LaneView"));
const UserManagementView = lazy(() => import("../pages/userManagement/UserManagementView"));
const RoleManagementView = lazy(() => import("../pages/roleManagement/RoleManagementView"));
const CreateRoleView = lazy(() => import("../pages/roleManagement/create/CreateRoleView"));
const EditRoleView = lazy(() => import("../pages/roleManagement/update/EditRoleView"));
const RoleDetailView = lazy(() => import("../pages/roleManagement/view/RoleDetailView"));
const UserDetailView = lazy(() => import("../pages/userManagement/detail/UserDetailView"))
const UserManagementListView = lazy(() => import("../pages/userManagement/UserListView"));
const EditUserView = lazy(() => import("../pages/userManagement/editUser/EditUserView"));
const FacilityView = lazy(() => import("../pages/facility/FacilityView"));
const FacilityOverviewView = lazy(() => import("../pages/facilityOverview/FacilityOverviewView"));
const LaneOverview = lazy(() => import("../pages/lanesOverview/LaneOverview"));
const UserSettingView = lazy(() => import("../pages/usersetting/UserSettingView"));
const VendorOverviewView = lazy(() => import("../pages/carrier/carrierOverview/VendorOverviewView"));
const CarrierComparisionView = lazy(() => import("../pages/carrierComprision/CarrierComparisionView"));
const PorjectDetailView = lazy(() => import("../pages/projectDetail/ProjectDetailView"));
const BenchmarkLaneTableView = lazy(() => import("../pages/benchmarkLaneTable/BenchmarkLaneTableView"));
const BenchmarkCarrierTableView = lazy(() => import("../pages/benchmarkCarrierTable/BenchmarkCarrierTableView"));
const ProjectView = lazy(() => import("../pages/project/ProjectView"));
const Decarb = lazy(() => import("../pages/decarb/decarbSummaryView"));
const DecarbRecommendedView = lazy(() => import("../pages/decarbProblemLanes/DecarbProblemLanesView"));
const BenchmarkRegion = lazy(() => import("../pages/benchmark/banchmarkRegion/BanchmarkRegionView"));
const BenchmarksView = lazy(() => import("pages/benchmark/BenchmarksView"));
const CompanyBenchmarkView = lazy(() => import("pages/benchmark/companyBenchmark/CompanyBenchmarkView"));
const KnowledgeHub = lazy(() => import("pages/knowledgeHub/KnowledgeHubView"));
const ErrorPage = lazy(() => import("pages/error/ErrorView"));
const FileManagementView = lazy(() => import("../pages/fileManagement/FileManagementView"));
const BusinessUnitView = lazy(() => import("pages/businessUnit/BusinessUnitView"))
const BusinessUnitOverviewView = lazy(() => import("pages/businessUnitOverview/BusinessUnitOverviewView"))
const EvView = lazy(() => import("pages/evMap/EvView"));
const TrailerView = lazy(() => import("pages/trailer/TrailerView"));
const TrailerOverviewView = lazy(() => import("pages/trailerOverview/TrailerOverviewView"))
const DivisionView = lazy(() => import("pages/division/DivisionView"))
const DivisionOverviewView = lazy(() => import("pages/divisionOverview/DivisionOverviewView"))
const OptimusView = lazy(() => import("pages/optimus/OptimusView"));
const ScopeSelectionView = lazy(() => import("pages/scopeSelection/ScopeSelectionView"));
const FuelStopsView = lazy(() => import("pages/fuelStops/FuelStopsView"));
const ScopeTwoDashboardView = lazy(() => import("pages/scopeTwo/dashboard/ScopeTwoDashboardView"));
const AiAgentFullPageView = lazy(() => import("pages/aiAgent/AiAgentFullPage/AiAgentFullPageView"));
const IntermodalReportView = lazy(() => import("../pages/intermodalReport/IntermodalReportView"));

/**
 * Component that defines all the routes for the website
 */
const GreenInsightRoute = () => {

  const { loginDetails, userProfile } = useAppSelector((state: any) => state.auth);


  // Fetch emission filter dates on component mount
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loginDetails?.data?.token) {
      dispatch(getFiltersDate());
      dispatch(getUserDetails());
      dispatch(getFuelStops());

    }
  }, [dispatch, loginDetails]);
  return (
    <div>
      <Router basename="/">
        <Routes>
          {/* LoginView route */}
          <Route path="/"
            element={
              <AuthRouteCheck userDetails={loginDetails} scopeType={""} userProfile={userProfile}>
                <Suspense fallback={<Spinner spinnerClass='justify-content-center' />}>
                  <LoginView />
                </Suspense>
              </AuthRouteCheck>
            }
          />
          <Route path="/bucket-login" element={<AuthBucketLoginRouteCheck>
            <BucketLoginView />
          </AuthBucketLoginRouteCheck>
          }
          />

          <Route element={<ProtectedRouteBucket />}>
            <Route path="/bucket-add" element={<BucketFileUpload />} />
          </Route>

          <Route element={<ProtectedRouteCheck />} >
            <Route path="/scope-selection" element={<ScopeSelectionView />} />
            {/* scope one route */}
          </Route>

          {/* Protected routes for application panel*/}
          <Route path="/scope3/" element={<Scope3ProtectedRoute scopePType={scopeSlug.scope3} loginDetails={loginDetails} />} >
            {/* SustainView route not accessible for regional Manager*/}

            {!checkRolePermission(loginDetails?.data, "regionalManager") && (
              <Route path="sustainable" key={"sustainable"} element={
                <SustainView />
              } />
            )}

            {/* RegionalLevel-Dashboard route */}
            <Route path="regional-level" element={<RegionalLevelView />} />

            {/* RegionalView route not accessible for regional Manager*/}
            {!checkRolePermission(loginDetails?.data, "regionalManager") && (
              <Route path="regional" element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                  <RegionalView />
                </RoutePermissionCheck>
              } />
            )}
            {/* RegionalView route not accessible for regional Manager*/}
            {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) && (
              <>
                <Route path="by-carrier-type" element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <CarrierTypeView />
                  </RoutePermissionCheck>
                } />
                <Route
                  path="by-carrier-type/:carrierTypeId/:years/:quarters/:pId?/:weekId?"
                  element={
                    <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                      <CarrierTypeOverview />
                    </RoutePermissionCheck>
                  }
                />
              </>
            )}

            {/* Regional-OverviewView route */}
            {!checkRolePermission(loginDetails?.data, "regionalManager") && (
              <Route
                path="region-overview/:regionId/:years/:quarters/:pId?/:weekId?"
                element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <RegionOverview />
                  </RoutePermissionCheck>
                }
              />
            )}

            {/* Carrier route */}
            <Route path="carrier" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                <VendorView />
              </RoutePermissionCheck>
            } />

            {/* Lanes route */}
            <Route path="lanes" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                <LaneView />
              </RoutePermissionCheck>
            } />

            {/* LaneOverview route */}
            <Route path="lanes-overview/:laneName/:years/:quarters/:pId?/:weekId?" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                <LaneOverview />
              </RoutePermissionCheck>
            } />
            {/* {Carrier-comparison route} */}


            {/* Facility route */}
            {isCompanyEnable(loginDetails?.data, [companySlug?.lw]) && (
              <Route path="facility" element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                  <FacilityView />
                </RoutePermissionCheck>
              } />
            )}
            {/* Fuel route */}
            {isCompanyEnable(loginDetails?.data, [companySlug.tql]) && (
              <>
                <Route path="trailer-overview/:id/:years?/:quarters?" element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <TrailerOverviewView overViewType="TrailerType" dbName="TrailerType" pageTitle="Trailer" tableLabel="Trailer" />
                  </RoutePermissionCheck>
                } />
                <Route path="trailer" element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <TrailerView dbName="TrailerType" pageTitle="Trailer" tableLabel="Trailer" />
                  </RoutePermissionCheck>
                } />
              </>
            )}

            {/* Fuel route */}
            {isCompanyEnable(loginDetails?.data, [companySlug.adm]) && (
              <>
                <Route path="fuel-overview/:id/:years?/:quarters?" element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <FuelOverviewView overViewType="fuelType" dbName="FuelType" pageTitle="Fuel" tableLabel="Fuel" />
                  </RoutePermissionCheck>
                } />

                <Route path="vehicle-overview/:id/:years?/:quarters?" element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <FuelOverviewView overViewType="vehicleModel" dbName="VehicleModel" pageTitle="Vehicle" tableLabel="Vehicle Model" />
                  </RoutePermissionCheck>
                } />
                <Route path="fuel" element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <FuelWrapperView />
                  </RoutePermissionCheck>
                } />

                <Route path="vehicle" element={
                  <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                    <VehicleWrapperView />
                  </RoutePermissionCheck>
                } />

              </>
            )}

            {/* Facility overview route */}
            {!isCompanyEnable(loginDetails?.data, [companySlug.tql]) && (
              <>
                <Route
                  path="facility-overview/:facilityId/:years/:quarters"
                  element={
                    <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                      <FacilityOverviewView />
                    </RoutePermissionCheck>
                  }
                />
                <Route
                  path="carrier-overview/:id/lane-detail/:laneName?/:years?/:quarters?/:pId?/:weekId?/:routeUrl?"
                  element={
                    <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                      <VendorOverviewView />
                    </RoutePermissionCheck>
                  }
                />
                <Route path="carrier-overview/:id/detail/:laneName?/:years?/:quarters?/:projectId?"
                  element={
                    <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                      <VendorOverviewView />
                    </RoutePermissionCheck>
                  }
                />
                <Route
                  path="carrier-overview/:id/:years?/:quarters?/:pId?/:weekId?"
                  element={
                    <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                      <VendorOverviewView />
                    </RoutePermissionCheck>
                  } />
                <Route
                  path="carrier-comparison"
                  element={
                    <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Segmentation}>
                      <CarrierComparisionView />
                    </RoutePermissionCheck>
                  }
                />
              </>
            )}


            {/* User setting route */}
            <Route path="settings" element={<UserSettingView />} />

            {/* Project route */}
            <Route path="projects" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Manage}>
                <ProjectView />
              </RoutePermissionCheck>

            } />
            {/* Project Detail Route */}
            <Route path="project-detail/:id/:laneName" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Manage}>
                <PorjectDetailView />
              </RoutePermissionCheck>
            } />

            <Route path="decarb" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Recommendations} checkedChild>
                <Decarb />
              </RoutePermissionCheck>
            } />

            <Route
              path="decarb-problem-lanes/:id/:page?"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Recommendations} checkedChild>
                  <DecarbRecommendedView />
                </RoutePermissionCheck>
              }
            />

            <Route path="decarb-problem-lanes-planning/:laneName?/:regionId?/:backPage?/:filter?" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Recommendations} checkedChild>
                <LaneSuggestionView />
              </RoutePermissionCheck>
            } />

            {/* lane Planning route */}
            <Route path="lane-planning/:laneName?/:pageUrl?/:filter?/:threshold?" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Recommendations} checkedChild>
                <LaneSuggestionView />
              </RoutePermissionCheck>
            } />

            <Route path="by-lane-planning/:laneName?/:pageUrl?" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Recommendations} checkedChild>
                <LaneSuggestionView />
              </RoutePermissionCheck>
            } />

            <Route
              path="benchmarkLaneTable/:band_no/:emission/:quarterId/:type/:yearId/:wtwType"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkLaneTableView />
                </RoutePermissionCheck>
              }
            />

            <Route
              path="benchmarkCarrierTable"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkCarrierTableView />
                </RoutePermissionCheck>
              }
            />

            <Route
              path="benchmarkLaneTable"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkLaneTableView />
                </RoutePermissionCheck>
              }
            />

            {/* BenchMarks Routes */}
            <Route
              path="benchmarks/:type/:id/:yearId/:quarterId/:wtwType"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <CompanyBenchmarkView />
                </RoutePermissionCheck>
              }
            />
            <Route path="benchmarks" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                <BenchmarksView />
              </RoutePermissionCheck>
            } />
            <Route
              path="benchmarks/:type/detail/:id/:yearId/:quarterId/:wtwType/:boundType"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkRegion />
                </RoutePermissionCheck>
              }
            />
            <Route
              path="benchmarks/:type/detail/:id/:yearId/:quarterId/:wtwType"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkRegion />
                </RoutePermissionCheck>
              }
            />
            <Route
              path="benchmarks/view-more/detail/:emissionId/:type/:quarterId/:yearId/:wtwType/:boundType/:id"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkCarrierTableView />
                </RoutePermissionCheck>
              }
            />
            <Route
              path="benchmarks/view-more/:emissionId/:type/:quarterId/:yearId/:wtwType/:bandNumber"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkCarrierTableView />
                </RoutePermissionCheck>
              }
            />

            <Route
              path="benchmarks-carrier-table/:type/detail/:id/:yearId/:quarterId/:wtwType"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Benchmarks}>
                  <BenchmarkRegion />
                </RoutePermissionCheck>
              }
            />

            {/* KnowledgeHub screen route */}
            <Route path="knowledge-hub" element={<KnowledgeHub />} />
            {/* bid planning Route */}
            {<Route path="bid-planning" element={<RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.BidPlanning}>
              <BidsPlanningView />
            </RoutePermissionCheck>} />}

            {<Route path="bid-matrics/:file_id/:file_name" element={<RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.BidPlanning}>
              <BidMatricsView />
            </RoutePermissionCheck>} />}

            {<Route path="bid-output/:file_id/:file_name" element={<RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.BidPlanning}>
              <OutPutScreenView />
            </RoutePermissionCheck>} />}
          </Route>

          {/* {loginDetails?.data?.chatbot_access &&  */}
          {isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) && loginDetails?.data?.chatbot_access && (
            <>
              <Route element={<Scope3ProtectedRoute loginDetails={loginDetails} scopePType={scopeSlug.scope3} application="chatbot" />} >
                <Route path="/scope3/ai-agent" element={
                  <AiAgentFullPageView />
                } />
              </Route>

              <Route element={<Scope3ProtectedRoute loginDetails={loginDetails} scopePType={scopeSlug.scope3} application="chatbot" />} >
                <Route path="/scope3/ai-agent/:titleSlug" element={
                  <AiAgentResponseView />
                } />
              </Route>

              <Route element={<Scope3ProtectedRoute loginDetails={loginDetails} scopePType={scopeSlug.scope3} application="chatbot" />} >
                <Route path="/scope3/ai-agent/sample/:titleSlug" element={
                  <AiAgentSampleView />
                } />
              </Route>
            </>
          )}

          <Route path="/scope2/" element={<Scope3ProtectedRoute urlKey="scope_2" loginDetails={loginDetails} scopePType={scopeSlug.scope2} application="dashboard" company={[companySlug?.pep, companySlug?.demo]} userProfile={userProfile} isOnBoard={true} isShowHeader={true} />} >
            {/* scope one route */}
            <Route path="onboard" element={
              <OnBoardingRouteCheck userDetails={loginDetails} userProfile={userProfile} urlKey="scope_2">
                <OnBoardView scopeId={2} />
              </OnBoardingRouteCheck>
            } />
          </Route>

          <Route path="/scope1/" element={<Scope3ProtectedRoute urlKey="scope_1" loginDetails={loginDetails} scopePType={scopeSlug.scope1} application="dashboard" company={[companySlug?.pep, companySlug?.demo]} userProfile={userProfile} isOnBoard={true} isShowHeader={true} />} >
            {/* scope one route */}
            <Route path="onboard" element={
              <OnBoardingRouteCheck userDetails={loginDetails} userProfile={userProfile} urlKey="scope_1">
                <OnBoardView scopeId={1} />
              </OnBoardingRouteCheck>
            } />
          </Route>

          <Route path="/scope2/" element={<Scope3ProtectedRoute urlKey="scope_2" scopePType={scopeSlug.scope2} loginDetails={loginDetails} userProfile={userProfile} company={[companySlug?.pep, companySlug?.demo]} />} >
            <Route path="dashboard" element={<ScopeTwoDashboardView />} />
          </Route>
          <Route path="/scope1/" element={<Scope3ProtectedRoute urlKey="scope_1" scopePType={scopeSlug.scope1} userProfile={userProfile} loginDetails={loginDetails} company={[companySlug?.pep]} />} >
            <Route path="fuel-report/:fuelType" element={<FuelReportView />} />
            <Route path="fuel-report/PFNA" element={<PfnaFuelReportView fuelSlug="pfna" />} />
            <Route path="fuel-report/PFNA/Bulk" element={<BulkCngView fuelSlug="bulk" />} />
            <Route path="fuel-report/PFNA/Cng" element={<BulkCngView fuelSlug="cng" />} />
            <Route path="fuel-report/PFNA/Rd" element={<BulkCngView fuelSlug="rd" />} />
            <Route path="fuel-report/PFNA/B100" element={<BulkCngView fuelSlug="b100" />} />
          </Route>

          <Route path="/scope1/" element={<Scope3ProtectedRoute urlKey="scope_1" scopePType={scopeSlug.scope1} userProfile={userProfile} loginDetails={loginDetails} company={[companySlug?.demo]} />} >
            <Route path="fuel-report" element={<FuelReportView />} />
          </Route>
          <Route path="/scope3/" element={<Scope3ProtectedRoute scopePType={scopeSlug.scope3} userProfile={userProfile} loginDetails={loginDetails} company={[companySlug?.pep, companySlug?.bmb, companySlug?.demo]} />} >
            <Route path="intermodal-report" element={<IntermodalReportView />} />
          </Route>

          {/* routes for admin panel */}
          <Route path="/scope3/" element={<Scope3ProtectedRoute scopePType={scopeSlug.scope3} userProfile={userProfile} loginDetails={loginDetails} company={[companySlug?.pep, companySlug?.bmb, companySlug?.demo]} />} >
            <Route path="business-unit" element={<BusinessUnitView />} />
            <Route path="business-unit-overview/:businessUnitId/:years/:quarters/:pId/:weekId?" element={<BusinessUnitOverviewView />} />
            <Route path="alternative-fuel" element={<AlternativeFuelView />} />

            <Route path="emission-saving-report" element={<EmissionSavingReportView />} />
            <Route path="fuel-location" element={<FuelStopsView />} />


            <Route path="division" element={<DivisionView />} />
            <Route path="division-overview/:divisionId/:years/:quarters/:pId/:weekId" element={<DivisionOverviewView />} />
            {/* Reports route */}
            <Route path="ev-dashboard/:carrierScac/:countryCode" element={<EvDashboardView />} />

            <Route path="master-dashboard" element={<EvMasterView />} />
          </Route>

          <Route path="/scope3/" element={<Scope3ProtectedRoute scopePType={scopeSlug.scope3} userProfile={userProfile} loginDetails={loginDetails} company={[companySlug?.pep, companySlug?.demo, companySlug?.rb]} />} >
            <Route path="reports" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.Recommendations} checkedChild>
                <ReportsView />
              </RoutePermissionCheck>
            } />

          </Route>

          <Route path="/scope3/" element={<Scope3ProtectedRoute scopePType={scopeSlug.scope3} userProfile={userProfile} loginDetails={loginDetails} company={[companySlug?.pep]} />} >
            <Route path="ev-network" element={<EvView />} />
            <Route path="optimus" element={<OptimusView />} />
          </Route>

          {/* routes for admin panel */}
          <Route element={<Scope3ProtectedRoute scopePType={scopeSlug.scope3} userProfile={userProfile} loginDetails={loginDetails} application={"admin"} />} >
            {/* user management route */}
            <Route path="/user-management-view/:userId/:roleId?" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.UserManagement}>
                <UserDetailView />
              </RoutePermissionCheck>
            } />

            <Route path="/user-management" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.UserManagement}>
                <UserManagementView />
              </RoutePermissionCheck>
            } />

            {/* user management user list route */}
            <Route
              path="/user-management/userlist"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.UserManagement}>
                  <UserManagementListView />
                </RoutePermissionCheck>
              }
            />
            {/* user management user list route */}
            <Route
              path="/user-management-edit/:user_id/:roleId?"
              element={
                <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.UserManagement}>
                  <EditUserView />
                </RoutePermissionCheck>
              }
            />

            {/* role management */}
            <Route path="/role-management/view/:roleId" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.RoleManagement}>
                <RoleDetailView />
              </RoutePermissionCheck>
            } />
            <Route path="/role-management/create-role" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.RoleManagement}>
                <CreateRoleView />
              </RoutePermissionCheck>
            } />
            <Route path="/role-management/edit-role/:roleId" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.RoleManagement}>

                <EditRoleView />
              </RoutePermissionCheck>} />

            <Route path="/role-management" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.RoleManagement}>
                <RoleManagementView />
              </RoutePermissionCheck>
            } />

            {/* data management route */}
            <Route path="/data-management" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.DataManagement}>
                <FileManagementView />
              </RoutePermissionCheck>
            } />
          </Route>

          <Route element={<Scope3ProtectedRoute scopePType={scopeSlug.scope3} userProfile={userProfile} loginDetails={loginDetails} company={[companySlug?.pep, companySlug?.demo, companySlug?.rb]} application={"admin"} />} >
            {/* lane setting route */}
            <Route path="/lane-setting" element={
              <RoutePermissionCheck permissionDto={loginDetails} routeKey={routeKey.DataManagement}>
                <LaneSettingView />
              </RoutePermissionCheck>
            } />
          </Route>

          {/* ErrorPage route */}
          <Route path="/coming-soon" element={
            <Suspense fallback={<Spinner spinnerClass='justify-content-center' />}>
              <ErrorPage title={"Coming Soon"} />
            </Suspense>
          } />


          <Route path="/page-not-found" element={
            <Suspense fallback={<span className="visually-hidden"></span>}>
              <ErrorPage showCode={true} title={"Page not found"} description={"It appears the page you were looking for couldn’t be found."} />
            </Suspense>
          } />

          <Route path="*" element={
            <Suspense fallback={<Spinner spinnerClass='justify-content-center' />}>
              <ErrorPage showCode={true} title={"Page not found"} description={"It appears the page you were looking for couldn’t be found."} />
            </Suspense>
          }
          />
        </Routes>
      </Router>
  
    </div>
  );
};

export default GreenInsightRoute;
