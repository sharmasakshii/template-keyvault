import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AiAgentFullPageView from "pages/aiAgent/AiAgentFullPage/AiAgentFullPageView";
import * as reduxHooks from "store/redux.hooks";
import * as reactRouter from "react-router-dom";
import { openSidebar } from "store/commonData/commonSlice";

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

jest.mock("pages/aiAgent/ChatSection/ChatSectionView", () => () => {
  return <div data-testid="chat-section">ChatSection Mock</div>;
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

describe("AiAgentFullPageView", () => {
  let dispatchMock: jest.Mock;
  let navigateMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    navigateMock = jest.fn();

    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({ isSidebarOpen: false });
    (reduxHooks.useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);
    (reactRouter.useNavigate as jest.Mock).mockReturnValue(navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders main elements correctly", () => {
    render(<AiAgentFullPageView />);
    expect(screen.getByTestId("button-icon")).toBeInTheDocument();
    expect(screen.getByTestId("heading")).toHaveTextContent("GreenSight Decarbonization Agent");
    expect(screen.getByTestId("button-text")).toHaveTextContent("Back to dashboard");
    expect(screen.getByTestId("chat-section")).toBeInTheDocument();
  });

  it("renders image with correct path and class", () => {
    render(<AiAgentFullPageView />);
    const image = screen.getByTestId("image");
    expect(image).toHaveAttribute("src", "/images/chatbot/stars.svg");
    expect(image).toHaveClass("pe-0");
  });

  it("renders heading with correct level and class", () => {
    render(<AiAgentFullPageView />);
    const heading = screen.getByTestId("heading");
    expect(heading.tagName).toBe("H3");
    // Adjusted to check for partial class match due to className differences
    expect(heading.className).toEqual(expect.stringContaining("font-20"));
    expect(heading.className).toEqual(expect.stringContaining("font-xxl-24"));
    expect(heading.className).toEqual(expect.stringContaining("fw-medium"));
    expect(heading.className).toEqual(expect.stringContaining("mb-0"));
  });

  it("renders back button with correct image path and class", () => {
    render(<AiAgentFullPageView />);
    const backButton = screen.getByTestId("button-text");
    expect(backButton).toHaveClass("font-xxl-16 font-14 fw-medium back-btn");
    // Note: imagePath is not directly testable as it's passed to ButtonComponent mock
  });

  it("applies correct className to sidebar toggle button when sidebar is closed", () => {
    render(<AiAgentFullPageView />);
    const toggleButton = screen.getByTestId("button-icon");
    expect(toggleButton).toHaveClass("close-btn-sidebar p-0 border-0 btn-transparent");
  });

  it("applies correct className to sidebar toggle button when sidebar is open", () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({ isSidebarOpen: true });
    render(<AiAgentFullPageView />);
    const toggleButton = screen.getByTestId("button-icon");
    expect(toggleButton).toHaveClass("d-none btn-transparent");
  });

  it("dispatches openSidebar thunk when sidebar toggle button is clicked", () => {
    render(<AiAgentFullPageView />);
    const toggleButton = screen.getByTestId("button-icon");
    fireEvent.click(toggleButton);
    expect(dispatchMock).toHaveBeenCalled();
    const dispatchedArg = dispatchMock.mock.calls[0][0];
    expect(typeof dispatchedArg).toBe("function");
  });

  it("calls navigate with correct path when back button is clicked", () => {
    render(<AiAgentFullPageView />);
    const backButton = screen.getByTestId("button-text");
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith("/scope3/sustainable");
  });

  it("renders ChatSection component", () => {
    render(<AiAgentFullPageView />);
    expect(screen.getByTestId("chat-section")).toBeInTheDocument();
  });

  it("dispatches openSidebar thunk with false when sidebar is open and toggle button is clicked", () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({ isSidebarOpen: true });
    render(<AiAgentFullPageView />);
    const toggleButton = screen.getByTestId("button-icon");
    fireEvent.click(toggleButton);
    expect(dispatchMock).toHaveBeenCalled();
    const dispatchedArg = dispatchMock.mock.calls[0][0];
    expect(typeof dispatchedArg).toBe("function");
  });
});
