import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useNavigate, MemoryRouter } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { configureStore } from "@reduxjs/toolkit";


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

export const RenderPage = (props: any) => {
  describe(props.title, () => {
    const dispatch = jest.fn();
    const mockNavigate = jest.fn();
    beforeEach(async () => {
      jest.spyOn(window, "scrollTo").mockImplementation(() => { });

      props.reducerName && configureStore({
        reducer: props.reducerName.reducer,
      });
      // Mocking the hooks' behavior
      props.navigate
        ? (useNavigate as jest.Mock).mockReturnValue(mockNavigate)
        : (useAppSelector as jest.Mock).mockReturnValue({});
      props.dispatch
        ? (useAppDispatch as jest.Mock).mockReturnValue(dispatch)
        : (useAppSelector as jest.Mock).mockReturnValue({});
      props.selector?.length > 0
        ? (useAppSelector as jest.Mock).mockReturnValue(
          props.selector?.map(() => [])
        )
        : (useAppSelector as jest.Mock).mockReturnValue({});
      await waitFor(() => {
        render(
          <MemoryRouter>
            {props.component}
          </MemoryRouter>
        );
      })
    });
    afterEach(() => {
      // Clearing mocks and cleaning up after each test
      jest.clearAllMocks();
      jest.restoreAllMocks();
      cleanup();
    });
    // Test: Rendering the Dashboard component
    it(`renders ${props.testCaseName}  successfully.`, () => {
      const linkElement = screen.getByTestId(props.documentId);
      expect(linkElement).toBeInTheDocument();
    });
    // Test: Rendering the title correctly
    it("renders title correctly", async () => {
      const newTitle = props.title;
      // Retrieve and check the updated tab title
      if (props.title) {
        await waitFor(() => {
          expect(document.title).toBe(`GreenSight | ${newTitle}`);
        });
      }
    });
  });
};
