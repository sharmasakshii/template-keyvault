import ProjectController from "./projectController";
import TitleComponent from "../../component/tittle";
import SelectDropdown from "component/forms/dropdown";
import ImageComponent from "component/images";
import ProjectCardView from "./ProjectCardView";
import CustomModal from "component/DailogBox/CustomModal";
import { routeKey } from "constant"
import { isPermissionChecked, filterLeverOption, normalizedList, getDropDownOptions } from 'utils';

const ProjectView = () => {

    // Importing all states and functions from Facility Controller
    const {
        projectList,
        searchProjectList,
        selectYear, setSelectYear,
        setSelectProjectId,
        selectByLever, setSelectByLever,
        deleteProjectId, setDeleteProjectId,
        showAllModalShift, setShowAllModalShift,
        showAllAlternative, setShowAllAlternative,
        showAllCarrierShift, setShowAllCarrierShift,
        removeProject,
        handleDetlete,
        yearOption,
        projectListLoading,
        loginDetails,
        selectProjectId,
    } = ProjectController();

    const permissionsDto = loginDetails?.data?.permissionsData || []
    return (
        <>
            <TitleComponent title={"Projects"} pageHeading="All Projects" />
            <CustomModal
                show={deleteProjectId !== ""}
                handleClose={() => setDeleteProjectId("")}
                modalHeader={"Delete Project"}
                modalBody={"Are you sure you want to delete the project?"}
                primaryButtonClick={() => setDeleteProjectId("")}
                secondaryButtonClick={handleDetlete}
                secondaryButtonTestId="delete-project-confirm-btn"
                primaryButtonTestId="cancel-project-btn"
                secondaryButtonText="Delete"
                primaryButtonText="Cancel"
                modalClass="removeCardModal"
                primaryButtonClass="cancel-btn px-4 py-2 text-decoration-none"
                secondaryButtonclass="delete-btn px-4 py-2 text-decoration-none"
            />

            <section className="project-screen pb-4" data-testid="projects">
                <div className="project-screen-wraper">
                    {/* Project dashboard */}

                    <div className="project-section py-1 px-2">
                        <div className="project-heading">
                            <div className="select-box d-lg-flex mb-3 gap-2 border-bottom pb-3">
                                <div className="search-icon-img">
                                    <span className="height-0 d-block">
                                        <ImageComponent path="/images/search.svg" className="search-img" />
                                    </span>
                                    <SelectDropdown
                                        aria-label="searchable-drop-down"
                                        disabled={projectListLoading}
                                        selectedValue={selectProjectId}
                                        customClass="text-capitalize project-search-dropdown "
                                        onChange={(e: any) => {
                                            setSelectProjectId(e)
                                        }}
                                        placeholder="All Projects"
                                        isSearchable={true}
                                        options={getDropDownOptions(searchProjectList?.data, "project_name", "project_unique_id", "All Projects")}
                                    />
                                </div>

                                <SelectDropdown
                                    aria-label="year-dropdown"
                                    options={yearOption}
                                    placeholder="Year"
                                    customClass=" yearDropdown"
                                    disabled={projectListLoading}
                                    selectedValue={yearOption?.filter(
                                        (el: any) => Number(el.value) === Number(selectYear.value)
                                    )}
                                    onChange={(e: any) => setSelectYear(e)}
                                />
                                <SelectDropdown
                                    aria-label="lever-options-dropdown"
                                    options={filterLeverOption(permissionsDto)}
                                    placeholder="By Lever"
                                    disabled={projectListLoading}
                                    onChange={(e: any) => setSelectByLever(e)}
                                    selectedValue={selectByLever}
                                />
                            </div>
                        </div>
                        {/* Modal Shift Projects */}
                        {projectListLoading ? (
                            <div
                                data-testid="spinner-loader"
                                className="graph-loader d-flex justify-content-center align-items-center"
                            >
                                <div className="spinner-border  spinner-ui">
                                    <span className="visually-hidden"></span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {isPermissionChecked(permissionsDto, routeKey?.ModalShift)?.isChecked &&

                                    <ProjectCardView
                                        selectByLever={selectByLever}
                                        projectList={normalizedList(projectList?.data?.modal_shift)}
                                        setShowAll={setShowAllModalShift}
                                        showAll={showAllModalShift}
                                        removeProject={removeProject}
                                        headingTitle="Modal Shift Projects"
                                        projectKey="modal_shift"

                                    />
                                }

                                {isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)?.isChecked &&

                                    <ProjectCardView
                                        selectByLever={selectByLever}
                                        projectList={normalizedList(projectList?.data?.alternative_fuel)}
                                        setShowAll={setShowAllAlternative}
                                        showAll={showAllAlternative}
                                        removeProject={removeProject}
                                        headingTitle="Alternative Fuel Usage Projects"
                                        projectKey="alternative_fuel"
                                        fuelStopList={projectList?.data?.fuel_stops}
                                        evFuelStopDto={projectList?.data?.ev_fuel_stop}
                                        rdFuelStopDto={projectList?.data?.rd_fuel_stop}

                                    />
                                }

                                {isPermissionChecked(permissionsDto, routeKey?.CarrierShift)?.isChecked &&

                                    <ProjectCardView
                                        selectByLever={selectByLever}
                                        projectList={normalizedList(projectList?.data?.carrier_shift)}
                                        setShowAll={setShowAllCarrierShift}
                                        showAll={showAllCarrierShift}
                                        removeProject={removeProject}
                                        headingTitle="Carrier Shift Projects"
                                        projectKey="carrier_shift"

                                    />
                                }
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
export default ProjectView