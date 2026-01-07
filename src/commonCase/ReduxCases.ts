import { configureStore, ThunkDispatch, AnyAction, EnhancedStore } from "@reduxjs/toolkit";
import { RootState, } from "store"
import { cleanup } from "@testing-library/react";
import axios, { AxiosResponse } from "axios"; // Import AxiosResponse
import {  nodeUrl } from "constant";

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    },
}));

export const TestFullFilledSlice = (props: any) => {
    props.data.map((testCase: any) => {
        describe(`${testCase.sliceName} Reducer`, () => {
            let store: any;
            beforeEach(() => {
                store = configureStore({
                    reducer: testCase.reducerName.reducer,
                });
            });
            afterEach(() => {
                jest.clearAllMocks();
            });
            it(`should handle ${testCase.sliceName}.fulfilled`, async () => {
                const mockResponse = { status: 200 };
                const mockFulfilledAction = testCase.sliceImport.fulfilled(mockResponse);
                store.dispatch(mockFulfilledAction)
                const state = store.getState();
                expect(state[testCase.loadingState]).toBe(false);
                expect(state[testCase.actualState]).toEqual(mockResponse);
                // Add more assertions as needed
            });
            it(`should handle ${testCase.sliceName}.rejected`, async () => {
                const mockFulfilledAction = testCase.sliceImport.rejected();
                store.dispatch(mockFulfilledAction)
                const state = store.getState();
                expect(state[testCase.loadingState]).toBe(false);
                expect(state[testCase.actualState]).toEqual(null);
                // Add more assertions as needed
            });
            it(`should handle ${testCase.sliceName}.pending`, async () => {
                const mockResponse = { status: 200 };
                const mockFulfilledAction = testCase.sliceImport.pending(mockResponse);
                store.dispatch(mockFulfilledAction)
                const state = store.getState();
                expect(state[testCase.loadingState]).toBe(true);
                // Add more assertions as needed
            });

        });
    });
};

export const ApiTest = (props: any) => {
    jest.mock("axios");
    props.data.map((testCase: any) => {
        describe(`${testCase.serviceName}`, () => {
            // Mock axios responses for each service function
            const mockApiResponse = { data: "This is some mock data", status: 200 }; // Mock GET response
            beforeEach(() => {
                jest.clearAllMocks();
            });
            it(`should make a ${testCase.method.toUpperCase()} request to fetch ${testCase.serviceName
                }`, async () => {
                    const axiosMock = jest.spyOn(axios, testCase.method);
                    if (testCase.method === "post") {
                        if ((testCase.route === `${nodeUrl}login-user-access` || testCase.route === "blob-login")) {
                            axiosMock.mockResolvedValue({
                                data: mockApiResponse,
                            } as AxiosResponse);
                            const userData = testCase.data;
                            const response = await testCase.serviceImport[testCase.serviceName](
                                userData,
                            )

                            expect(axios.post).toHaveBeenCalledWith(
                                testCase.route,
                                userData,
                            );
                            expect(response).toEqual(mockApiResponse);
                            return;

                        }
                        axiosMock.mockResolvedValue({
                            data: mockApiResponse,
                        } as AxiosResponse);
                        const userData = testCase.data;
                        const response = await testCase.serviceImport[testCase.serviceName](
                            userData
                        );
                       
                        expect(response).toEqual(mockApiResponse);
                    }

                    if (testCase.method === "get") {
                        const userData = testCase?.data || ""; // Include the mock data here
                        axiosMock.mockResolvedValue(mockApiResponse);
                        const result = await testCase.serviceImport[testCase.serviceName](userData);
                        expect(axios.get).toHaveBeenCalledWith(testCase.route);
                        expect(result).toEqual(mockApiResponse.data); // Check if the result matches mockApiResponse.data
                    }
                });

            it('should throw an error on unsuccessful API call', async () => {
                const mockedError: any = {
                    response: { status: 404, data: 'Not Found', statusText: 'Not Found', headers: {}, config: {} },
                    config: {},
                    isAxiosError: true,
                    name: 'AxiosError',
                    message: 'Request failed with status code 404',
                };
                // Mock the entire axios module
                testCase?.method == "post" ? (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValue(mockedError) : (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(mockedError);
                const userData = testCase.data;
                await expect(testCase.serviceImport[testCase.serviceName](userData)).rejects.toEqual(mockedError);
            });

            // Add similar tests for other service functions
        });

    });
};

export const TestSliceMethod = (props: any) => {

    props.data.map((testCase: any) => {
        describe(`${testCase.serviceName} thunk`, () => {
            let stores: EnhancedStore;
            jest.mock('react-toastify', () => ({
                toast: {
                    success: jest.fn(),
                },
            }));

            beforeEach(() => {
                stores = configureStore({
                    reducer: {},
                });
            });
            afterEach(() => {
                jest.clearAllMocks();
                jest.restoreAllMocks();
                cleanup();
            });
            afterEach(() => { jest.clearAllMocks();
            });


            it('fulfills with data from commonService when successful', async () => {
                const payload = {}; // Provide necessary payload for your test case

                // Dispatch the thunk with the payload
                await (stores.dispatch as ThunkDispatch<RootState, undefined, AnyAction>)(testCase.sliceImport(payload));
            });

            it(`should dispatch ${testCase.serviceName} the correct actions on successful API call`, async () => {
                const fakeDto = { "status": 200, };
                // Mock the getUserDetails function to resolve with the fake user details
                const mockDto = jest.fn().mockResolvedValueOnce(fakeDto);
                // Apply the mock to the module

                testCase.service[testCase.serviceName] = mockDto;

                // Initial state can be customized as needed
                if (testCase.isShowMessage) {
                    expect(require('react-toastify').toast.success).toHaveBeenCalledWith('Password updated successfully');
                }
                const result = await testCase.service[testCase.serviceName]({ status: 200 });
                expect(result).toEqual({ status: 200 });
            })
        })
    })
}
