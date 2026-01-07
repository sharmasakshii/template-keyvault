import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AiAgentSampleView from "pages/aiAgent/AiAgentFullPage/AiAgentSampleView";
import * as reduxHooks from "store/redux.hooks";
import * as reactRouter from "react-router-dom";
import { companySlug, sampleQuestions, sampleQuestionsDEMO } from "constant";
import { isCompanyEnable } from "utils";

jest.mock("component/forms/button", () => (props: any) => {
  return (
    <button
      data-testid={props.text ? "button-text" : "button-icon"}
      onClick={props.onClick}
      className={props.btnClass}
    >
      {props.text || "icon"}
    </button>
  );
});

jest.mock("component/heading", () => (props: any) => {
  return <h3 data-testid="heading" className={props.className}>{props.content}</h3>;
});

jest.mock("component/images", () => (props: any) => {
  return <img data-testid="image" src={props.path} alt="mocked-img" className={props.className} />;
});

jest.mock("react-infinite-scroll-component", () => (props: any) => {
  return <div data-testid="infinite-scroll">{props.children}</div>;
});

jest.mock("pages/aiAgent/ChatSection/MessageFormater", () => (props: any) => {
  return <div data-testid="message-formater">{JSON.stringify(props.chat)}</div>;
});

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  isCompanyEnable: jest.fn(),
}));

jest.mock("store/redux.hooks", () => ({
  ...jest.requireActual("store/redux.hooks"),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe("AiAgentSampleView", () => {
  let dispatchMock: jest.Mock;
  let navigateMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    navigateMock = jest.fn();

    (reduxHooks.useAppSelector as jest.Mock).mockReturnValueOnce({
      isSidebarOpen: false
    }).mockReturnValueOnce({
      loginDetails: { data: {} }
    });
    (reduxHooks.useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);
    (reactRouter.useNavigate as jest.Mock).mockReturnValue(navigateMock);
    (reactRouter.useParams as jest.Mock).mockReturnValue({ titleSlug: "2600" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders main elements correctly", () => {
    (isCompanyEnable as jest.Mock).mockReturnValue(true);
    render(<AiAgentSampleView />);
    expect(screen.getByTestId("button-icon")).toBeInTheDocument();
    expect(screen.getByTestId("heading")).toHaveTextContent("GreenSight Decarbonization Agent");
    expect(screen.getByTestId("button-text")).toHaveTextContent("Back to dashboard");
    expect(screen.getByTestId("infinite-scroll")).toBeInTheDocument();
  });

  it("renders sample questions for PEP company", () => {
    (isCompanyEnable as jest.Mock).mockReturnValue(true);
    render(<AiAgentSampleView />);
    const messageFormaterElements = screen.getAllByTestId("message-formater");
    expect(messageFormaterElements.length).toBeGreaterThan(0);
    expect(messageFormaterElements[0]).toHaveTextContent(sampleQuestions[0].id);
  });

  it("renders sample questions for non-PEP company", () => {
    (isCompanyEnable as jest.Mock).mockReturnValue(false);
    render(<AiAgentSampleView />);
    const messageFormaterElements = screen.getAllByTestId("message-formater");
    expect(messageFormaterElements.length).toBeGreaterThan(0);
    expect(messageFormaterElements[0]).toHaveTextContent(sampleQuestionsDEMO[0].id);
  });

  it("dispatches openSidebar thunk when sidebar toggle button is clicked", () => {
    render(<AiAgentSampleView />);
    const toggleButton = screen.getByTestId("button-icon");
    fireEvent.click(toggleButton);
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("calls navigate with correct path when back button is clicked", () => {
    render(<AiAgentSampleView />);
    const backButton = screen.getByTestId("button-text");
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith("/scope3/sustainable");
  });
});
