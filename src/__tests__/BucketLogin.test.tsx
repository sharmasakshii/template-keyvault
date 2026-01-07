import { RenderPage } from "../commonCase/RenderPageCase";
import BucketLoginView from "../pages/bucket/login/BucketLogin";

import { authDataReducer, bucketLogin } from "../store/auth/authDataSlice";
import { ApiTest, TestFullFilledSlice } from "../commonCase/ReduxCases";
import authService from "../store/auth/authService";
import {  nodeUrl } from "constant"

jest.mock("store/redux.hooks", () => ({
    ...jest.requireActual("store/redux.hooks"),
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));


// Payload for fetching table data
const authLoginPostDataPayload = {
    "email": process.env.REACT_APP_DUMMY_EMAIL,
    "password": process.env.REACT_APP_DUMMY_PASSWORD
}


// Configuration for fetching project count API data via Redux
const postBucketLoginApiDataObject = {
    service: authService,
    serviceName: "bucketLoginPost",
    sliceName: "bucketLogin",
    sliceImport: bucketLogin,
    data: authLoginPostDataPayload,
    reducerName: authDataReducer,
    loadingState: "bucketLoginLoading",
    isSuccess: "isSuccess",
    actualState: "bucketLoginDetails",
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [

        postBucketLoginApiDataObject,
    ],
});


// Configuration for API testing of fetching project count API data
const getBucketLoginApiApiTestData = {
    serviceName: "bucketLoginPost",
    method: "post",
    data: authLoginPostDataPayload,
    serviceImport: authService,
    route: `${nodeUrl}blob-login`,
};

// Execute API tests for various data
ApiTest({
    data: [
        getBucketLoginApiApiTestData,
    ],
});

// Configuration for rendering a specific page/component
const renderPageData = {
    navigate: false,
    dispatch: true,
    selector: ['bucketLoginDetails'],
    component: <BucketLoginView/>,
    testCaseName: "Bucket Login Component",
    documentId: "bucket-login",
    title: "Bucket Login",
    reducerName: authDataReducer,
};

RenderPage(renderPageData);
