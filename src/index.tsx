import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/scss/bootstrap.scss";
import "./scss/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import InterceptorApi from "./utils/InterceptorApi";
import { PersistGate } from 'redux-persist/integration/react';
import "./i18n"
import { updateAuthStore, getUserDetails } from "store/auth/authDataSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { decryptDataFunction } from 'utils';
import { regionShow } from 'store/commonData/commonSlice';

InterceptorApi(store);

window.addEventListener('storage', async (event) => {
  const userInfo: any = localStorage.getItem('persist:root')
  
  if (event.key === 'persist:root') {
    const updatedState = JSON.parse(userInfo);

    if (updatedState) {
      const info = decryptDataFunction(JSON.parse(updatedState.loginDetails));
      const currentAuthState = store.getState().auth.loginDetails;
      // Only update if the new state from localStorage differs from the current state
      if (info?.data && currentAuthState && JSON.stringify(info?.data) !== JSON.stringify(currentAuthState.data)) {
        // Merge with current state and update the store
        await store.dispatch(updateAuthStore({
          ...currentAuthState,
          data: { ...info?.data, login_count: 2 }
        })).then(() => {
          const divisionId = store.getState()?.auth?.divisionId

          store.dispatch(getUserDetails())
          store.dispatch(regionShow({ division_id: divisionId }));;

          store.dispatch(getConfigConstants({ region_id: "", division_id: "" }));

        });

      }
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <div>
    <ToastContainer
      data-testid="toast-container"
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
