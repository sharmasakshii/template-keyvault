import { configureStore } from '@reduxjs/toolkit';
import authDataReducer from "./auth/authDataSlice";
import homeReducer from "./home/homeSlice";
import { logger } from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import commonDataReducer from './commonData/commonSlice';
import regionDataReducer from './scopeThree/track/region/regionSlice';
import laneDetailsReducer from './scopeThree/track/lane/laneDetailsSlice';
import regionOverviewReducer from './scopeThree/track/region/regionOverviewSlice';
import sustainDataReducer from './sustain/sustainSlice';
import dashRegionReducer from './dashRegion/dashRegionSlice';
import carrierDetailsReducer from './scopeThree/track/carrier/vendorSlice';
import facilityOverviewDataReducer from './scopeThree/track/facilityOverview/facilityOverviewDataSlice';
import facilityDataReducer from './scopeThree/track/facility/facilityDataSlice';
import userSettingReducer from './user/userSlice';
import decarbReducer from './scopeThree/track/decarb/decarbSlice';
import projectReducer from './project/projectSlice';
import benchmarkReducer from './benchmark/benchmarkSlice';
import fileReducer from './file/fileSlice'
import businessUnitDataReducer from './businessUnit/businessUnitSlice';
import businessUnitOverviewReducer from './businessUnit/businessUnitOverviewSlice';
import roleReducer from "./role/roleSlice"
import evSlice from './ev/evSlice';
import bidPlanningDataReducer from "./bidPlanning/bidPlanningSlice";
import localFreightDataReducer from "./localFreight/localFreightSlice"
import fuelDataReducer from "./fuel/fuelSlice"
import trailerDataReducer from './trailer/trailerSlice';
import divisionDataReducer from "./scopeThree/track/division/divisionSlice"
import divisionOverviewReducer from "./scopeThree/track/division/divisionOverviewSlice"
import reportDataReducer from './report/reportSlice';
import evDashboardReducer from './scopeThree/track/evDashboard/evDashboardSlice';
import fuelStopDataReducer from './fuelStops/fuelStopSlice';
import scopeOneFuelReportReducer from './scope1/fuelReport/fuelReportSlice';
import chatbotDataReducer from './scopeThree/chatbot/chatBotSlice';
import scopeOnePfnaReportReducer from './scope1/pfnaReport/pfnaReportSlice';
import emissionSavedReducer from './scopeThree/track/emissionSaveReport/emissionSavedSlice';
import intermodalReportDataReducer from "./intermodalReport/IntermodalReportSlice"

const CryptoJS = require("crypto-js");

// Array to hold middleware
const middleware: any = [];

// Add logger middleware to the array
if (process.env.REACT_APP_IS_DEV === "true") {
  middleware.push(logger);
}

// Create the encryptor
const encryptor = {
  in: (inboundState: any, key: any) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(inboundState),
      process.env.REACT_APP_EN_KEY // Replace with a secure key
    ).toString();
    return encrypted;
  },
  out: (outboundState: any, key: any) => {
    const bytes = CryptoJS.AES.decrypt(outboundState, process.env.REACT_APP_EN_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  },
};

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor], // Add the encryption transform
  whitelist: [
    "loginDetails",
    "bucketLoginDetails",
    "bucketFileUpload",
    "regionalId",
    "divisionId",
    "scopeType",
    "applicationTypeStatus",
    "userProfile"
  ]
}

const authReducer = persistReducer(persistConfig, authDataReducer)
// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    chatBot: chatbotDataReducer,
    commonData: commonDataReducer,
    region: regionDataReducer,
    regionDash: dashRegionReducer,
    regionOverview: regionOverviewReducer,
    lane: laneDetailsReducer,
    home: homeReducer,
    sustain: sustainDataReducer,
    carrier: carrierDetailsReducer,
    facilityOverview: facilityOverviewDataReducer,
    facility: facilityDataReducer,
    user: userSettingReducer,
    project: projectReducer,
    fuelStops: fuelStopDataReducer,
    decarb: decarbReducer,
    benchmark: benchmarkReducer,
    file: fileReducer,
    businessUnit: businessUnitDataReducer,
    businessUnitOverview: businessUnitOverviewReducer,
    ev: evSlice,
    evDashboard: evDashboardReducer,
    role: roleReducer,
    bidPlanning: bidPlanningDataReducer,
    localFreight: localFreightDataReducer,
    fuel: fuelDataReducer,
    trailer: trailerDataReducer,
    division: divisionDataReducer,
    divisionOverview: divisionOverviewReducer,
    laneReport: reportDataReducer,
    scopeOneFuelReport: scopeOneFuelReportReducer,
    scopeOnePfnaReport: scopeOnePfnaReportReducer,
    emissionSaved: emissionSavedReducer,
    intermodalReport: intermodalReportDataReducer,
  },
  devTools: false,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    // Disable checks for immutability and serializability for improved performance
    immutableCheck: false,
    serializableCheck: false
  }).concat(middleware),
});

export const persistor = persistStore(store)


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { auth: AuthState, dashboard: DashboardState, commonData: CommonState, region: RegionState, home: HomeState }
export type AppDispatch = typeof store.dispatch;

export default store;
