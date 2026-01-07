// Import necessary libraries and components
import { useEffect, useState } from "react";
import {
  projectData,
  searchProjectData,
  projectDelete
} from "../../store/project/projectSlice";
import { getYearOptions, isCompanyEnable } from "../../utils";

import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import moment from "moment";
import { companySlug } from "constant";

// Define the ProjectController functional component
const ProjectController = () => {
  // Create references and initialize state variables
  const dispatch = useAppDispatch();
  const { loginDetails } = useAppSelector((state: any) => state.auth);
  const isRBCompany = isCompanyEnable(loginDetails?.data, [companySlug?.rb]);
  const { projectList, searchProjectList, projectListLoading } = useAppSelector((state) => state.project);
  const [selectYear, setSelectYear] = useState({ value: moment().year(), label: moment().year() });
  const [selectProjectId, setSelectProjectId] = useState<any>({ label: "All Projects", value: "" });
  const [selectByLever, setSelectByLever] = useState({ value: "", label: "By Lever" });
  const [deleteProjectId, setDeleteProjectId] = useState("");
  const [showAllModalShift, setShowAllModalShift] = useState(false);
  const [showAllAlternative, setShowAllAlternative] = useState(false);
  const [showAllCarrierShift, setShowAllCarrierShift] = useState(false);
  const { emissionDates } = useAppSelector((state) => state.commonData);

  // Check user authentication and fetch project data based on filters
  useEffect(() => {
    if (loginDetails?.data) {
      dispatch(
        projectData({
          year: selectYear?.value,
          project_unique_id: selectProjectId?.value,
          lever: selectByLever?.value,
          search: ""
        })
      );
    }
  }, [dispatch, selectYear, selectProjectId, selectByLever, loginDetails]);

  // Fetch search project data when the component mounts
  useEffect(() => {
    if (loginDetails?.data) {
      dispatch(searchProjectData({ region_id: "" }));
    }
  }, [dispatch, loginDetails]);

  // Function to remove a project by setting its ID
  const removeProject = (id: any) => {
    setDeleteProjectId(id);
  };

  // Function to handle project deletion
  const handleDetlete = () => {
    if (deleteProjectId) {
      dispatch(
        projectDelete({
          id: deleteProjectId,
          data: {
            year: selectYear?.value,
            project_unique_id: selectProjectId?.value,
            lever: selectByLever?.value,
            search: ""
          }
        })
      );
      setDeleteProjectId("");
    }
  };
  const startDate = new Date()
  let yearOption = [...getYearOptions({ ...emissionDates?.data?.emission_dates, ...{ "end_date": startDate } })]

  // Return the required variables and functions from the component
  return {
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
    isRBCompany
  };
}

// Export the ProjectController component
export default ProjectController;
