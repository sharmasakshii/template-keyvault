
import express from "express";
import dotenv from "dotenv";
import EvNetworkRouteConstant from "./scope3/track/evNetwork/evNetworkRoute";
import EvDashboardRouteConstant from "./scope3/track/evDashboard/evDashboardRoutes";
import onboardRouteConstant from "./scope1/onboardRoute";
import fuelLocationsRouteConstant from "./scope3/fuelLocationRoutes";
import AlternateFuelRouteConstant from "./scope3/track/alternateFuleType/alternateFuelRoute";
import updateEvLanesRouteConstant from "./scope3/updateEvLanesRoute";
import TrailerRouteConstant from "./scope3/track/trailer/trailerRoute";
import userRouteConstant from "./scope3/userSettingRouter";
import FacilityRouteConstant from "./scope3/track/facility/facilityRoute";
import reportRouteConstant from "./scope3/act/reportRoutes";
import fuelVehicleRouteConstant from "./scope3/track/fuelVehicle/fuelVehicleRoutes";
import commonRouteConstant from "./scope3/common/commonRoute";
import projectRouteConstant from "./scope3/manage/projectRoutes";
import adminUserRouteConstant from "./scope3/admin/userManagement/userRoute";
import LaneRouteConstant from "./scope3/track/lane/laneRoute"
import decarbRouteConstant from "./scope3/act/decarb/decarbRoutes";
import RegionRouteConstant from "./scope3/track/region/regionRoute"
import LaneOverViewRouteConstant from "./scope3/track/lane/laneOverViewRoute";
import lanePlanningouteConstant from "./scope3/act/lanePlanningRoutes";
import bidPlanningouteConstant from "./scope3/act/bidPlanningRoutes";
import CarrierRouteConstant from "./scope3/track/carrier/carrierRoute";
import BusinessRouteConstant from "./scope3/track/business/businessRoute";
import BusinessOverviewRouteConstant from "./scope3/track/business/businessOverview";
import fuelsReportRouter from "./scope1/fuelsReportRoute";
import pdfRouteConstant from "./scope3/pdfRoutes";
import chatBotRouteConstant from "./chatBot/chatBotRoutes";
import DivisionRouteConstant from "./scope3/track/division/divisionRoute";
import fuelsReportPFNARouteConstant from "./scope1/fuelsReportPFNARoute";
import fuelsReportPfnaPagesRouteConstant from "./scope1/fuelsReportPfnaPagesRoute";
import BenchmarkRouteConstant from "./scope3/benchmark/benchmarkRoute";
import adminRoleRouteConstant from "./scope3/admin/roleManagement/roleRoute";
import authRouteConstant from "./auth/authRoute";
import fileManagementRouteConstant from "./scope3/admin/fileManagement/fileManagementRoute";
import laneSettingRouteConstant from "./scope3/admin/laneSetting/laneSettingRoute";
import commonAltrEvRouteConstant from "./scope3/commonDashAltrEv/commonRouteAltrEv";
import IntermodalRouteConstant from "./scope3/track/intermodalReport/intermodalReportRoute";
import CarrierTypeRouteConstant from "./scope3/track/carrierType/carrierTypeRoute";

dotenv.config();

const app = express();

app.disable("x-powered-by");

type HttpMethod = "post" | "get" | "put" | "delete" | "patch";

interface SwaggerPathItem {
    [key: string]: {
        summary: string;
        responses: {
            [key: string]: {
                description: string;
            };
        };
    };
}

interface SwaggerPaths {
    [path: string]: SwaggerPathItem;
}

const routes = [
    { routeConstant: EvNetworkRouteConstant },
    { routeConstant: EvDashboardRouteConstant },
    { routeConstant: onboardRouteConstant },
    { routeConstant: fuelLocationsRouteConstant },
    { routeConstant: AlternateFuelRouteConstant },
    { routeConstant: updateEvLanesRouteConstant },
    { routeConstant: TrailerRouteConstant },
    { routeConstant: userRouteConstant },
    { routeConstant: FacilityRouteConstant },
    { routeConstant: reportRouteConstant },
    { routeConstant: fuelVehicleRouteConstant },
    { routeConstant: commonRouteConstant },
    { routeConstant: projectRouteConstant },
    { routeConstant: adminUserRouteConstant },
    { routeConstant: LaneRouteConstant },
    { routeConstant: LaneOverViewRouteConstant },
    { routeConstant: decarbRouteConstant },
    { routeConstant: RegionRouteConstant },
    { routeConstant: lanePlanningouteConstant },
    { routeConstant: bidPlanningouteConstant },
    { routeConstant: CarrierRouteConstant },
    { routeConstant: BusinessRouteConstant },
    { routeConstant: BusinessOverviewRouteConstant },
    { routeConstant: fuelsReportRouter },
    { routeConstant: pdfRouteConstant },
    { routeConstant: chatBotRouteConstant },
    { routeConstant: DivisionRouteConstant },
    { routeConstant: fuelsReportPFNARouteConstant },
    { routeConstant: fuelsReportPfnaPagesRouteConstant },
    { routeConstant: BenchmarkRouteConstant },
    { routeConstant: adminRoleRouteConstant },
    { routeConstant: authRouteConstant },
    { routeConstant: fileManagementRouteConstant },
    { routeConstant: laneSettingRouteConstant },
    { routeConstant: commonAltrEvRouteConstant },
    { routeConstant: IntermodalRouteConstant },
    { routeConstant: CarrierTypeRouteConstant },
];

const Router: any = express.Router();

const controllerRouteFileMapping = (prop: any) => {
    try {
        return Router[prop.method](prop.route, prop.handler);
    }
    catch (err) {
        console.log(err, "eerrr")
    }
};

routes?.map(async (ele: any) => {
    ele.routeConstant.map(async (ele1: any) => {
        app.use("", controllerRouteFileMapping(ele1));
    })
})

// Swagger JSON endpoint
app.get("/swagger.json", (req, res) => {
    res.json(generateSwaggerJson());
});

const getAllRoutes = () => {
    return routes.flatMap(({ routeConstant }) =>
        routeConstant.map((ele: any) => ({
            method: ele.method as HttpMethod,
            path: ele.route,
        }))
    );
};

const generateSwaggerJson = () => {
    const routes = getAllRoutes();
    const paths = routes.reduce<SwaggerPaths>((acc, { method, path }: any) => {
        if (!acc[path]) {
            acc[path] = {};
        }
        acc[path][method] = {
            summary: `Endpoint for ${path}`,
            responses: {
                "200": {
                    description: "Successful response",
                },
            },
        };
        return acc;
    }, {});

    return {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API documentation generated from routes",
        },
        paths,
    };
};

export { app as default, getAllRoutes };
