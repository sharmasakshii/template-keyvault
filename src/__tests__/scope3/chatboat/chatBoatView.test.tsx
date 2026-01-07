// Import necessary modules and components
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";
import ChatSectionView from "pages/aiAgent/ChatSection/ChatSectionView";
import {
  chatbotDataReducer,
  addNewMessage, getChatHistory, resetChatHistory, getSearchChatHistory, removeSearchChatHistory,
  getChatListApi, initialState, resetChatbotData, resetHistory, resetChatList
} from "store/scopeThree/chatbot/chatBotSlice";
import chatbotService from "store/scopeThree/chatbot/chatBotService";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import userEvent from "@testing-library/user-event";

import { nodeUrl } from "constant";
import store from "store"
import { useParams } from 'react-router-dom';

const graphDistancePayload = {
  toggle_data: 0,
  year: 2022,
  quarter: "",
};

const getChatHistorySlicetest = {
  service: chatbotService,
  serviceName: "getChatHistory",
  sliceName: "getChatHistory",
  sliceImport: getChatHistory,
  data: graphDistancePayload,
  reducerName: chatbotDataReducer,
  loadingState: "isLoadingChatHistory",
  isSuccess: "isSuccess",
  actualState: "chatHistoryData",
};

const getSearchChatHistorySlicetest = {
  service: chatbotService,
  serviceName: "getSearchChatHistory",
  sliceName: "getSearchChatHistory",
  sliceImport: getSearchChatHistory,
  data: graphDistancePayload,
  reducerName: chatbotDataReducer,
  loadingState: "searchChatHistoryLoading",
  actualState: "searchChatHistory",
};




const removeSearchChatHistorySlicetest = {
  service: chatbotService,
  serviceName: "removeSearchChatHistory",
  sliceName: "removeSearchChatHistory",
  sliceImport: removeSearchChatHistory,
  data: graphDistancePayload,
  reducerName: chatbotDataReducer,
  loadingState: "searchChatHistoryLoading",
  actualState: "removeSearchChatHistory",
};

const getChatListSlicetest = {
  service: chatbotService,
  serviceName: "getChatListApi",
  sliceName: "getChatListApi",
  sliceImport: getChatListApi,
  data: graphDistancePayload,
  reducerName: chatbotDataReducer,
  loadingState: "isLoadingChatList",
  actualState: "chatListData",
};
// const benchmarkWeightSlicetest = {
//   service: chatbotService,
//   serviceName: "benchmarkWeight",
//   sliceName: "benchmarkWeight",
//   sliceImport: benchmarkWeight,
//   data: graphWeightPayload,
//   reducerName: chatbotDataReducer,
//   loadingState: "benchmarkWeightDtoLoading",
//   isSuccess: "isSuccess",
//   actualState: "benchmarkWeightDto",
// };



// Configuration for API testing of fetching table data
const getChatListApiTest = {
  serviceName: "getChatListApi",
  method: "get",
  data: { page: 1, page_size: 10 },
  serviceImport: chatbotService,
  route: `${nodeUrl}get-chat-list?page=1&page_size=10`,
};

const getChatHistoryApiTest = {
  serviceName: "getChatHistoryApi",
  method: "post",
  data: graphDistancePayload,
  serviceImport: chatbotService,
  route: `${nodeUrl}get-chat-history`,
};

const getSearchChatHistoryApiTest = {
  serviceName: "getSearchChatHistoryApi",
  method: "get",
  data: graphDistancePayload,
  serviceImport: chatbotService,
  route: `${nodeUrl}search-chat-history?search=&limit=5`,
};

const removeSearchChatHistoryApiTest = {
  serviceName: "removeSearchChatHistoryApi",
  method: "post",
  data: graphDistancePayload,
  serviceImport: chatbotService,
  route: `${nodeUrl}remove-chat-history`,
};


// Execute Redux slice tests for table data
TestFullFilledSlice({
  data: [
    // addNewMessageSlicetest,
    getChatHistorySlicetest,
    getSearchChatHistorySlicetest,
    getChatListSlicetest,
    removeSearchChatHistorySlicetest,
  ],
});

// Execute API test for table data
ApiTest({
  data: [
    getChatListApiTest,
    getChatHistoryApiTest,
    getSearchChatHistoryApiTest,
    removeSearchChatHistoryApiTest
  ],
});

TestSliceMethod({
  data: [
    // addNewMessageSlicetest,
    getChatHistorySlicetest,
    getSearchChatHistorySlicetest,
    getChatListSlicetest,
    removeSearchChatHistorySlicetest,
  ],
});


describe("addNewMessage Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(addNewMessage(status));
    expect(result.payload).toBe(status);
  });
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = chatbotDataReducer.reducer(modifiedState, resetChatbotData());

    expect(result).toEqual(initialState);


  });
});


// Test case initialState
describe('resetHistory reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      ...initialState,
      chatHistoryData: null,
    };

    const result = chatbotDataReducer.reducer(modifiedState, resetHistory());

    expect(result).toEqual(initialState);


  });
});

// Test case initialState
describe('resetChatList reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      ...initialState,
      chatListData: null,
    };

    const result = chatbotDataReducer.reducer(modifiedState, resetChatList());

    expect(result).toEqual(initialState);


  });
});



describe("resetChatHistory Thunk", () => {

  it("should handle success scenario", async () => {
    const mockResponse = { data: "mock chat history" };
    const spy = jest.spyOn(chatbotService, "getChatHistoryApi");

    const result = await store.dispatch(resetChatHistory({ userId: 1 }));
    expect(spy).toHaveBeenCalledWith({ userId: 1 });
    // expect(result.payload).toEqual(mockResponse);

    spy.mockRestore();
  });

  it("should handle failure scenario", async () => {
    const errorMessage = "Network Error";
    const spy = jest.spyOn(chatbotService, "getChatHistoryApi").mockRejectedValue(new Error(errorMessage));

    const result = await store.dispatch(resetChatHistory({ userId: 1 }));
    expect(spy).toHaveBeenCalledWith({ userId: 1 });
    // expect(result.error.message).toBe(errorMessage);

    spy.mockRestore();
  });

  // it("should return the correct status when dispatched", async () => {
  //   const status = true;
  //   // Dispatch the thunk action
  //   const result = await store.dispatch(resetChatHistory(status));
  //   expect(result.payload).toBe(status);
  // });
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));


describe("chat bot view ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
        benchmarkView: chatbotDataReducer?.reducer,
        auth: authDataReducer.reducer,
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

    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    const mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  const renderChatBoatView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <ChatSectionView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    const mockedParams = { titleSlug: '' };

    useSelectorMock.mockReturnValue({
      chatHistoryData: [{
        id: 1, question: "test question",
        answer: "test answer",
      }]
    });

    // Mock the return value of useParams hook
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderChatBoatView();
    expect(screen.getByTestId("chat-boat-view")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("track"));

  });

  it(`<section> test case for whole page `, async () => {
    const mockedParams = { titleSlug: 'test' };

    useSelectorMock.mockReturnValue({
      chatHistoryData: [{
        id: 1, question: "test question",
        answer: "test answer",
      }],
      isNewChat: { message: "test", isNew: true }
    });

    // Mock the return value of useParams hook
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderChatBoatView();
    expect(screen.getByTestId("chat-boat-view")).toBeInTheDocument();
  });


  it(`<section> test case for whole page `, async () => {
    const mockedParams = { titleSlug: 'test' };

    useSelectorMock.mockReturnValue({
      chatHistoryData: {
        data: {
          list: [{
            id: 1, question: "test question",
            answer: "test answer",
          }]
        }
      },
      loginDetails: {
        data: authMockData?.userdata
      },

      isNewChat: { message: "test", isNew: false }

    });

    // Mock the return value of useParams hook
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderChatBoatView();
    const messageType = screen.getByTestId("chat-type-message");

    expect(screen.getByTestId("chat-boat-view")).toBeInTheDocument();
    expect(messageType).toBeInTheDocument();

    fireEvent.change(messageType, { target: { value: "Hello" } });
    fireEvent.keyDown(messageType, { key: "Enter", code: "Enter" });
    userEvent.click(screen.getByTestId("send-message"));
  });
  
});
