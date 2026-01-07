import axios from "axios";
import { resetStore } from "store/auth/authDataSlice";
import { nodeUrl } from "constant";
const CryptoJS = require("crypto-js");

export const imageURL = process.env.REACT_APP_BASE_URL_ASSET;
export const imageToken = process.env.REACT_APP_BASE_URL_ASSET_TOKEN;

// Track active and cancellable requests
const activeRequests: Record<string, AbortController> = {};
const cancellableRequests: Record<string, AbortController> = {};

/**
 * Cancel all pending requests that were marked cancellable
 */
export const cancelAllRequests = () => {
  Object.keys(cancellableRequests).forEach((key) => {
    const controller = cancellableRequests[key];
    if (controller) controller.abort();
    delete cancellableRequests[key];
  });
};

/**
 * Axios interceptor setup
 */
const InterceptorApi = (store: any) => {
  axios.interceptors.request.use(
    (req: any) => {
      const originalRequest = req;
      const requestKey = req.url

      // Cancel duplicate requests unless denied
      if (!originalRequest?.headers?.deniedCancle && activeRequests[requestKey]) {
        const controller = activeRequests[requestKey];
        controller.abort(); // cancel previous
        delete activeRequests[requestKey];
      }

      // Skip special URLs
      if (
        originalRequest?.url !== `${nodeUrl}save-url` &&
        originalRequest?.url !== process.env.REACT_APP_FUNCTIONAL_URL
      ) {
        // Create new AbortController
        const controller = new AbortController();
        originalRequest.signal = controller.signal;
        activeRequests[requestKey] = controller;

        // Mark cancellable requests
        if (originalRequest?.headers?.cancelKey) {
          cancellableRequests[requestKey] = controller;
        }
      }

      // Set dynamic base URL
      originalRequest.baseURL = process.env.REACT_APP_BASE_URL_CA;
      return originalRequest;
    },
    (error: unknown) => {
      const rejectionError = error instanceof Error
        ? error
        : new Error("Unknown error in request interceptor");

      return Promise.reject(rejectionError);
    }
  );

  // Global response interceptor
  axios.interceptors.response.use(
    (response: any) => {
      const { request, data, config } = response;
      const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}`;

      // Clean up finished request
      delete activeRequests[requestKey];
      delete cancellableRequests[requestKey];

      // Decrypt response if applicable
      if (
        data &&
        request?.responseURL !== process.env.REACT_APP_FUNCTIONAL_URL &&
        !request?.responseURL.includes("ev-scac-excel")
      ) {
        try {
          const decryptedData = JSON.parse(
            CryptoJS.AES.decrypt(data?.data, process.env.REACT_APP_EN_KEY).toString(CryptoJS.enc.Utf8)
          );
          return { ...response, data: { ...data, data: decryptedData } };
        } catch (error) {
          console.error("Decryption failed:", error);
        }
      }
      return response;
    },
    (error) => {
      const { response, config } = error || {};
      const requestKey = `${config?.method}-${config?.url}-${JSON.stringify(config?.params || {})}-${JSON.stringify(config?.data || {})}`;

      // Clean up on error
      delete activeRequests[requestKey];
      delete cancellableRequests[requestKey];

      // Handle unauthorized access
      if (response?.data?.authorized === false || response?.status === 401) {
        Object.values(activeRequests).forEach((controller) => controller.abort());
        Object.keys(activeRequests).forEach((key) => delete activeRequests[key]);
        store.dispatch(resetStore());
      }

      // Attempt to decrypt error response
      if (
        response?.data?.data &&
        !response?.config?.url?.includes("ev-scac-excel") &&
        response?.config?.url !== process.env.REACT_APP_FUNCTIONAL_URL
      ) {
        try {
          const decryptedErrorData = JSON.parse(
            CryptoJS.AES.decrypt(response.data.data, process.env.REACT_APP_EN_KEY).toString(CryptoJS.enc.Utf8)
          );
          response.data.data = decryptedErrorData;
        } catch (decryptionError) {
          console.error("Error Decryption Failed:", decryptionError);
        }
      }

      let rejectionError: Error;
      if (error instanceof Error) {
        rejectionError = error;
      } else {
        // If it's not an Error, wrap it in a new Error
        rejectionError = new Error(error);
      }

      return Promise.reject(rejectionError);
    }
  );

  axios.defaults.withCredentials = true;
};

export default InterceptorApi;
