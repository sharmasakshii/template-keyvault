import React from "react";
import { render, screen } from "@testing-library/react";
import AiAgentResponseView from "pages/aiAgent/AiAgentFullPage/AiAgentResponseView";

jest.mock("pages/aiAgent/AiAgentFullPage/AiAgentFullPageView", () => () => {
  return <div data-testid="ai-agent-full-page-view">AiAgentFullPageView Mock</div>;
});

describe("AiAgentResponseView", () => {
  it("renders AiAgentFullPageView component", () => {
    render(<AiAgentResponseView />);
    expect(screen.getByTestId("ai-agent-full-page-view")).toBeInTheDocument();
  });
});
