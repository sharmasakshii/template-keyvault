import { RenderPage } from "../commonCase/RenderPageCase";
import ErrorView from "../pages/error/ErrorView";


const renderPageData = {
    navigate: false,
    dispatch: true,
    selector: [
    ],
    component: <ErrorView pageTestId= "error-view"/>,
    testCaseName: "Error Component",
    documentId: "error-view",
    title: "Error",
    reducerName: null,

};

RenderPage(renderPageData);
