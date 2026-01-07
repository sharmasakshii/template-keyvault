import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import PdfSendEmailController from "../../../controller/scope3/pdfSendEmailController";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../commonTest";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([
            { time_id: 210, period_name: 'P1W2' ,
                ev_emission: 0,
                total_shipment: 24,
                emissions_saved: 2.34,
                SCAC: 'SCNN',
                'carrier.id': 1,
                'carrier.name': 'Schneider',
                'carrier.image': '/images/company/schneider.svg'
            },
            { time_id: 211, period_name: 'P1W3',
                ev_emission: 0,
                total_shipment: 24,
                emissions_saved: 2.34,
                SCAC: 'SCNN',
                'carrier.id': 1,
                'carrier.name': 'Schneider',
                'carrier.image': '/images/company/schneider.svg'
             }
          ]),
        models: {
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { carrier: 'WALM',
                        carrier_name: 'WALMART BACKHAUL CARRIER',
                        carrier_logo: '/images/company_logo/walm.png',
                        name: 'TOLLESON, AZ, 85353_LANCASTER, TX, 75134',
                        emission: 118.67958553457397,
                        intensity: 102.867771,
                        shipment: 49,
                        period_name:"XX",
                        time_id:45,
                        maxDate:"27/07/1999",
                        division_id:9,
                    dataValues: {
                        carrier: 'WALM',
                        carrier_name: 'WALMART BACKHAUL CARRIER',
                        carrier_logo: '/images/company_logo/walm.png',
                        name: 'TOLLESON, AZ, 85353_LANCASTER, TX, 75134',
                        emission: 118.67958553457397,
                        intensity: 102.867771,
                        shipment: 49,
                        period_name:"XX",
                        time_id:45,
                        maxDate:"27/07/1999",
                        division_id:9
                      }
                 },
                {carrier: 'WALM',
                    carrier_name: 'WALMART BACKHAUL CARRIER',
                    carrier_logo: '/images/company_logo/walm.png',
                    name: 'TOLLESON, AZ, 85353_LANCASTER, TX, 75134',
                    emission: 118.67958553457397,
                    intensity: 102.867771,
                    shipment: 49,
                    period_name:"XX",
                    time_id:45,
                    maxDate:"27/07/1999",
                    division_id:9,
                    dataValues: {
                        maxDate:"27/07/1999",
                        carrier: 'WALM',
                        carrier_name: 'WALMART BACKHAUL CARRIER',
                        carrier_logo: '/images/company_logo/walm.png',
                        name: 'TOLLESON, AZ, 85353_LANCASTER, TX, 75134',
                        emission: 118.67958553457397,
                        intensity: 102.867771,
                        shipment: 49,
                        period_name:"XX",
                        time_id:45,
                        division_id:9
                      }
                }
                ]),
            },
            ConfigConstants:{
                findAll: jest.fn<any>().mockResolvedValue([
                    {config_value: '7',  dataValues: { config_key: 'pdf_alternative_fuel_excluded', config_value: 'dd,dd' }},
                    {config_value: '7',  dataValues: {
                        config_key: 'pdf_biweekly_day_range',
                        config_value: '7'
                      }},
                      {config_value: 'ggg',  dataValues: {
                        config_key: 'pdf_alternative_carrier_excluded',
                        config_value: 'fbf'
                      }}

                ])
            },
            LaneAlternateFuelType:{
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues:{
                            minYear:2024,
                            maxYear:2025,
                            total_emissions:34,
                            emissions_saved:374,
                            carrier_image:"dfdfdfdf",
                            carrier_scac:"dfdff",
                            carrier_name:"dddd"
                        }
                    }
                ]),
                min: jest.fn<any>().mockResolvedValue(9),
                max: jest.fn<any>().mockResolvedValue(12),
            },
            AlternateFuelTypeConstant:{findAll: jest.fn<any>().mockResolvedValue([])},
            AlternateFueltypeCarrier:{findAll: jest.fn<any>().mockResolvedValue([])},
        }
    },
};

const mockGeneratePdf = {
    generatePdfPeriodWisePepsi: jest.fn<any>().mockResolvedValue({
        fileName: 'report.pdf',
        buffer: Buffer.from('mocked-pdf-content'),
        subject: 'Emission Report',
        body: 'This is a test emission report.'
    }),
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Send Emission Report Email functionality",
    controller: PdfSendEmailController,
    moduleName: 'sendEmissionReportEmail',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and success message when email is sent successfully",
            body: {
                "pdf" : "period",
                "period" : 211,
                "division_id" : 9
            },
            responseStatus: 200,
            responseMessage: "Email sent successfully.",
        },
        {
            status: false,
            mockConnection: {
                company:"sdfsdf"
            },
            testName: "should return a 200 status code and success message You are not allowed to send pdf.",
            body: {
                "pdf" : "period",
                "period" : 211,
                "division_id" : 9
            },
            responseStatus: 200,
            responseMessage: "You are not allowed to send pdf.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("Database error")), // Simulate DB error
                        },
                    }
                },
            },
            testName: "should return 500 status and error message when there is a database error",
            body: {
                pdf: 'period',
                period: 'Q1 2024',
                division_id: 123,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

jest.mock("../../../emailSender/emailSentWithAttachment", () => ({
    azurEmailFunction: jest.fn<any>().mockResolvedValue(true),
}));
commonTestFile(payload);
