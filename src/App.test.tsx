
import { render, screen} from "@testing-library/react";
import App from "./App";
import * as reactRedux from "react-redux";
import store from "store";


describe("testcases for app page ", () => {
    beforeEach(() => {
})

it('renders without crashing',()=>{
    render(
        <reactRedux.Provider store={store}>
            <App/>
        </reactRedux.Provider>
      );
 expect(screen.getByTestId("app-component")).toBeInTheDocument();
})

})
