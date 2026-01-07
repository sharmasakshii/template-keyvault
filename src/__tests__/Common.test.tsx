// Import necessary modules and components
import commonService from "../store/commonData/commonService";

import {
  addUrl, commonDataReducer, getFiltersDate, regionShow, getDivisionList,
 getNotificationListing, getTimePeriod, getOnboardQuestionList,
  addUpdateQuestionAnswere, initialState, resetCommonData, openSidebar, isLoadingCommonDashboard,
  updatePageTitle
} from "../store/commonData/commonSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../commonCase/ReduxCases";
import { nodeUrl } from "constant"
import { getUserDetails, authDataReducer } from "../store/auth/authDataSlice";
import authService from "store/auth/authService";
import store from "store"

// Configuration for fetching lane carrier data using Redux
const getUserDetailsDataObject = {
  service: authService,
  serviceName: "getUserDetails",
  sliceName: "getUserDetails",
  sliceImport: getUserDetails,
  reducerName: authDataReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "userProfile",
};

// Configuration for API testing of fetching lane carrier data
const getUserDetailsApiTestData = {
  serviceName: "getUserDetails",
  method: "get",
  serviceImport: authService,
  route: `${nodeUrl}user-profile`,
};

// Configuration for fetching lane carrier data using Redux
const getFiltersDateDataObject = {
  service: commonService,
  serviceName: "getFiltersDate",
  sliceName: "getFiltersDate",
  sliceImport: getFiltersDate,
  reducerName: commonDataReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "emissionDates",
};

// Configuration for API testing of fetching lane carrier data
const getFiltersDateApiTestData = {
  serviceName: "getFiltersDate",
  method: "get",
  serviceImport: commonService,
  route: `${nodeUrl}region-emission-dates`,
};


// Configuration for fetching lane carrier data using Redux
const getRegionsDataObject = {
  service: commonService,
  serviceName: "getRegions",
  sliceName: "regionShow",
  sliceImport: regionShow,
  data: { division_id: "" },
  reducerName: commonDataReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "regions",
};

// Configuration for API testing of fetching lane carrier data
const getRegionsApiTestData = {
  serviceName: "getRegions",
  method: "get",
  serviceImport: commonService,
  route: `${nodeUrl}get-regions`,
};

// Configuration for API testing of fetching lane carrier data
const getRegionsPayloadApiTestData = {
  serviceName: "getRegions",
  method: "get",
  data: { division_id: 1 },
  serviceImport: commonService,
  route: `${nodeUrl}get-regions?division_id=1`,
};
// Configuration for common service to save url using Redux
const addUrlObject = {
  service: commonService,
  serviceName: "saveUrlApi",
  sliceName: "addUrl",
  sliceImport: addUrl,
  data: { url: "" },
  reducerName: commonDataReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "urlKey",
};

// Configuration for API testing of fetching lane carrier data
const addUrlApiTest = {
  serviceName: "saveUrlApi",
  method: "post",
  data: { url: "" },
  serviceImport: commonService,
  route: `${nodeUrl}save-url`,
};


// Configuration for fetching lane carrier data using Redux
const getDivisionListDataObject = {
  service: commonService,
  serviceName: "getDivisions",
  sliceName: "getDivisionList",
  sliceImport: getDivisionList,
  reducerName: commonDataReducer,
  loadingState: "isLoadingDivisions",
  actualState: "divisions",
};

// Configuration for API testing of fetching lane carrier data
const getDivisionListApiTestData = {
  serviceName: "getDivisions",
  method: "get",
  serviceImport: commonService,
  route: `${nodeUrl}get-division-list`,
};


const getNotificationListingDataObject = {
  service: commonService,
  serviceName: "getNotificationListing",
  sliceName: "getNotificationListing",
  sliceImport: getNotificationListing,
  reducerName: commonDataReducer,
  loadingState: "isLoadingNotification",
  actualState: "notificationDetail",
};

// Configuration for API testing of fetching lane carrier data
const getNotificationListingApiTestData = {
  serviceName: "getNotificationListing",
  method: "get",
  serviceImport: commonService,
  route: `${nodeUrl}get-user-notifications`,
  data: {}
};

const getOnboardQuestionListDataObject = {
  service: commonService,
  serviceName: "getOnboardQuestionListApi",
  sliceName: "getOnboardQuestionList",
  sliceImport: getOnboardQuestionList,
  reducerName: commonDataReducer,
  loadingState: "isLoadingQuestions",
  actualState: "questionsDto",
};

// Configuration for API testing of fetching lane carrier data
const getOnboardQuestionListApiTestData = {
  serviceName: "getOnboardQuestionListApi",
  method: "post",
  serviceImport: commonService,
  route: `${nodeUrl}get-onboard-question-list`,
  data: {}
};

const getTimePeriodDataObject = {
  service: commonService,
  serviceName: "getTimePeriodApi",
  sliceName: "getTimePeriod",
  sliceImport: getTimePeriod,
  reducerName: commonDataReducer,
  loadingState: "timePeriodLoading",
  actualState: "timePeriodList",
};

// Configuration for API testing of fetching lane carrier data
const getTimePeriodApiTestData = {
  serviceName: "getTimePeriodApi",
  method: "post",
  serviceImport: commonService,
  route: `${nodeUrl}scope3/time-mapping-list`,
  data: {}
};

const addUpdateQuestionAnswereDataObject = {
  service: commonService,
  serviceName: "addUpdateQuestionAnswereApi",
  sliceName: "addUpdateQuestionAnswere",
  sliceImport: addUpdateQuestionAnswere,
  reducerName: commonDataReducer,
  loadingState: "isLoadingQuestions",
  actualState: "questionListDto",
};

// Configuration for API testing of fetching lane carrier data
const addUpdateQuestionAnswereApiTestData = {
  serviceName: "addUpdateQuestionAnswereApi",
  method: "post",
  serviceImport: commonService,
  route: `${nodeUrl}add-update-question-answere`,
  data: {}
};


// Execute Redux slice tests for lane carrier data and vendor table data
TestFullFilledSlice({
  data: [
    getUserDetailsDataObject,
    getDivisionListDataObject,
    getFiltersDateDataObject,
    getRegionsDataObject,
    addUrlObject,
    getNotificationListingDataObject,
    getOnboardQuestionListDataObject,
    getTimePeriodDataObject,
    addUpdateQuestionAnswereDataObject
  ],
});

// Execute API tests for vendor comparison, vendor table, and lane carrier data
ApiTest({
  data: [
    getUserDetailsApiTestData,
    getDivisionListApiTestData,
    getFiltersDateApiTestData,
    addUrlApiTest,
    getRegionsApiTestData,
    getRegionsPayloadApiTestData,
    getNotificationListingApiTestData,
    getOnboardQuestionListApiTestData,
    getTimePeriodApiTestData,
    addUpdateQuestionAnswereApiTestData
  ],
});
;

TestSliceMethod({
  data: [
    getUserDetailsDataObject,
    getDivisionListDataObject,
    getFiltersDateDataObject,
    addUrlObject,
    getRegionsDataObject,
    getNotificationListingDataObject,
    getOnboardQuestionListDataObject,
    getTimePeriodDataObject,
    addUpdateQuestionAnswereDataObject
  ],
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = commonDataReducer.reducer(modifiedState, resetCommonData());
    expect(result).toEqual(initialState);


  });
});

describe("open sidebar Thunk", () => {
  it("should return the correct status when dispatched", async () => {
      const status = true;
      // Dispatch the thunk action
      const result = await store.dispatch(openSidebar(status));
      expect(result.payload).toBe(status);
  });
});

describe("load dashboard Thunk", () => {
  it("should return the correct status when dispatched", async () => {
      const status = true;
      // Dispatch the thunk action
      const result = await store.dispatch(isLoadingCommonDashboard(status));
      expect(result.payload).toBe(status);
  });
});

describe("update page title Thunk", () => {
  it("should return the correct status when dispatched", async () => {
      const title = "";
      // Dispatch the thunk action
      const result = await store.dispatch(updatePageTitle(title));
      expect(result.payload).toBe(title);
  });
});

