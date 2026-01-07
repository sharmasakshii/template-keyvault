import { act, cleanup, render, screen } from "@testing-library/react";
import KnowledgeHubView from "../../pages/knowledgeHub/KnowledgeHubView";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../commonCase/ReduxCases";
import commonService from "../../store/commonData/commonService";
import * as router from "react-router-dom";
import * as reactRedux from "react-redux";
import { configureStore, ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import * as utils from "store/redux.hooks";
import { useAppSelector } from "store/redux.hooks"
import {
    commonDataReducer,
    getCmsContentApi,
} from "store/commonData/commonSlice";
import { nodeUrl } from "constant"
// Payload for fetching region emission data
const getContentPayload = {
    "page_slug": "/knowledge-hub"
};


// Configuration for fetching project count API data via Redux
const getCmsContentApiDataObject = {
    service: commonService,
    serviceName: "getCmsContentApi",
    sliceName: "getCmsContentApi",
    sliceImport: getCmsContentApi,
    data: getContentPayload,
    reducerName: commonDataReducer,
    loadingState: "isLoadingCmsContent",
    isSuccess: "isSuccess",
    actualState: "cmsContent",
};

// Configuration for API testing of fetching project count API data
const getCmsContentApiApiTestData = {
    serviceName: "getCmsContentApi",
    method: "post",
    data: getContentPayload,
    serviceImport: commonService,
    route: `${nodeUrl}get-cms-content`,
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getCmsContentApiDataObject,
    ],
});

// Execute API tests for various data
ApiTest({
    data: [
        getCmsContentApiApiTestData,
    ],
});

TestSliceMethod({
    data: [getCmsContentApiDataObject],
});

jest.mock("store/redux.hooks", () => ({
    ...jest.requireActual("store/redux.hooks"),
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));
jest.mock("auth/ProtectedRoute", () => ({
    useAuth: jest.fn(),
}));

describe("test knowledgeHub view ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: ReturnType<typeof configureStore>;
    const navigate = jest.fn();
    beforeEach(() => {
        stores = configureStore({
            reducer: {
                commonData: commonDataReducer?.reducer,
            },
        });
        jest
            .spyOn(router, "useNavigate")
            .mockImplementation(() => navigate) as jest.Mock;
        jest.mock("react-router-dom", () => ({
            ...jest.requireActual("react-router-dom"),
            useNavigate: jest.fn(),
        }));

        useSelectorMock = jest
            .spyOn(utils, "useAppSelector")
            .mockReturnValue({}) as jest.Mock;
        useDispatchMock = jest.spyOn(utils, "useAppDispatch") as jest.Mock;

        // let auth = jest.spyOn(tem, "useAuth");
        // auth.mockReturnValue(authMockData);
        const mockDispatch = jest.fn();
        useDispatchMock.mockReturnValue(mockDispatch);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cleanup();
    });

    const renderKnowledgeHubView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <KnowledgeHubView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({
            cmsContent: {
                data: {
                    page_slug: "/knowledge",
                    id: 1,
                    content: `<div ><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js">        </script>Knowledge Hub Content</div>`,
                }
            },
            isLoadingCmsContent: false,
        });

        await renderKnowledgeHubView();
        expect(screen.getByTestId("knowledge-hub")).toBeInTheDocument();
    });

     //section id.....
    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({
            cmsContent: {
                data: {
                    page_slug: "/knowledge",
                    id: 1,
                    content: `<div ><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js">        </script>Knowledge Hub Content</div>`,
                }
            },
            isLoadingCmsContent: true,
        });

        await renderKnowledgeHubView();
        expect(screen.getByTestId("knowledge-hub-loading")).toBeInTheDocument();
    });

});

