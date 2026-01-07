
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, yearMockData, divisionMockdata } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import { toast } from "react-toastify";

import CarrierTypeOverview from "pages/carrierTypeOverview/CarrierTypeOverview";
import {
    roleReducer,
    updateRoleListStatus,
    getRoleDetailById,
    getAllModules,
    getRoleList,
    resetRoleData,
    initialState,
    addRole,
    deleteRole,
    updateRole 
} from "store/role/roleSlice";
import userEvent from "@testing-library/user-event";
import roleServices from "store/role/roleServices";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import store from "store"

import { nodeUrl } from "constant";


jest.mock("react-toastify", () => ({
    toast: { success: jest.fn() },
}));

// Payload for posting region graph data
const regionGraphPostPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
};

// Configuration for posting region graph data via Redux
const getRoleListSlice = {
    service: roleServices,
    serviceName: "getRoleListApi",
    sliceName: "getRoleList",
    sliceImport: getRoleList,
    data: regionGraphPostPayload,
    reducerName: roleReducer,
    loadingState: "isRoleListLoading",
    actualState: "roleList",
};

// Configuration for API testing of posting region graph data
const getRoleListApi = {
    serviceName: "getRoleListApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: roleServices,
    route: `${nodeUrl}get-role-data`,
};

// Configuration for posting region graph data via Redux
const getRoleDetailByIdSlice = {
    service: roleServices,
    serviceName: "getRoleDetailByIdApi",
    sliceName: "getRoleDetailById",
    sliceImport: getRoleDetailById,
    data: regionGraphPostPayload,
    reducerName: roleReducer,
    loadingState: "isRoleDetailByIdLoading",
    actualState: "roleDetail",
};

// Configuration for API testing of posting region graph data
const getRoleDetailByIdApi = {
    serviceName: "getRoleDetailByIdApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: roleServices,
    route: `${nodeUrl}get-role-details`,
};

// getAllModules

// Configuration for posting region graph data via Redux
const getAllModulesSlice = {
    service: roleServices,
    serviceName: "getAllModulesApi",
    sliceName: "getAllModules",
    sliceImport: getAllModules,
    data: regionGraphPostPayload,
    reducerName: roleReducer,
    loadingState: "isModuleList",
    actualState: "moduleList",
};

// Configuration for API testing of posting region graph data
const getAllModulesApi = {
    serviceName: "getAllModulesApi",
    method: "get",
    data: regionGraphPostPayload,
    serviceImport: roleServices,
    route: `${nodeUrl}get-all-modules`,
};

const addRoleApiApi = {
    serviceName: "addRoleApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: roleServices,
    route: `${nodeUrl}get-all-modules`,
};

const updateRoleDetailApi = {
    serviceName: "updateRoleDetail",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: roleServices,
    route: `${nodeUrl}edit-role`,
};
const deleteRoleApi = {
    serviceName: "deleteRoleApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: roleServices,
    route: `${nodeUrl}delete-role`,
};
// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [getRoleListSlice, getRoleDetailByIdSlice, getAllModulesSlice

    ],
});

// Execute API tests for various data
ApiTest({
    data: [getRoleListApi, getRoleDetailByIdApi,
        getAllModulesApi, addRoleApiApi, updateRoleDetailApi, deleteRoleApi
    ],
});

TestSliceMethod({
    data: [getRoleListSlice, getRoleDetailByIdSlice,
        getAllModulesSlice
    ],
});


describe("open sidebar Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(updateRoleListStatus(status));
        expect(result.payload).toBe(status);
    });
});


// Test case initialState
describe('initial reducer', () => {
    it('should reset state to initialState is called', () => {
        const modifiedState: any = {
            data: [{ id: 1, value: 'test' }],
            loading: true,
            error: 'Something went wrong',
        };

        const result = roleReducer.reducer(modifiedState, resetRoleData());
        expect(result).toEqual(initialState);
    });
});


describe("add role Thunk", () => {
    const navigate = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return the correct status when dispatched", async () => {
        const payload = { userPaylod: {}, isNavigate: true, navigate };
        // Dispatch the thunk action
        const result = await store.dispatch(addRole(payload));
        // expect(result.payload).toBe(status);
    });
});

describe("delete role Thunk", () => {
    const navigate = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return the correct status when dispatched", async () => {
        const payload = { userPaylod: {}, isNavigate: true, navigate };
        // Dispatch the thunk action
        const result = await store.dispatch(deleteRole(payload));
        // expect(result.payload).toBe(status);
    });
});

describe("update role Thunk", () => {
    const navigate = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return the correct status when dispatched", async () => {
        const payload = { userPaylod: {}, isNavigate: true, navigate };
        // Dispatch the thunk action
        const result = await store.dispatch(updateRole(payload));
        // expect(result.payload).toBe(status);
    });
});
