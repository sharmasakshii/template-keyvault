import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import { Op, Sequelize, QueryTypes } from "sequelize";
import moment from "moment";
import {  pdfLaneCarrierColors, units } from "../constant";
import { createConfigLookup, getBase64Image, getConfigConstants, getImageUrl, getSasToken } from "./commonServices";
import { ChartService } from "./chart";
import { splitArrayIntoTwoHalves } from "../utils";

const Handlebars = require('handlebars');
Handlebars.registerHelper('toLowerCase', function (str: any) {
    return str.toLowerCase();
});
Handlebars.registerHelper('eq', function (a: any, b: any) {
    return String(a).trim() === String(b).trim();
});

Handlebars.registerHelper('isEmpty', function (value: any) {
    return value === null || value === undefined || value === '';
});

Handlebars.registerHelper('substring', function (string: string, start: any, end: number) {
    return string ? string.substring(start, end) : '';
});

// Register partials
const partialsDir = path.join(__dirname, '../public/reportpdf/partials');
fs.readdirSync(partialsDir).forEach(file => {
    const partialName = file.split('.')[0]; // e.g., 'header'
    const partialTemplate = fs.readFileSync(path.join(partialsDir, file), 'utf8');
    Handlebars.registerPartial(partialName, partialTemplate);
});


class GeneratePdf {
    private sasToken: string;
    private logoBase64: string;
    private backgroundBase64: string;

    constructor() {
        this.sasToken = '';  // Default value or empty string, to be updated after initialization
        this.logoBase64 = '';
        this.backgroundBase64 = '';
    }

    // Initialize method to handle async calls
    async initialize() {
        this.sasToken = await getSasToken();
        this.logoBase64 = await getImageUrl('/images/login/greensightLogo.png', this.sasToken)
        this.backgroundBase64 = await getImageUrl('/images/background-img.png', this.sasToken);
    }

    async prepare() {
        // Wait for the initialization to complete before proceeding
        await this.initialize();
    }



    async generatePdfPeriodWisePepsi(companyConnection:any, period: any, division_id: any): Promise<any> {
        try {
            let models = companyConnection.models;
            await this.prepare(); // Ensure sasToken is ready before PDF generation
            let timeId;
            let divisionId;
            if (!period && !division_id) {
                const timeIdAndDivisionId = await companyConnection.query(`
                EXEC [greensight_pepsi].[getTimeAndDivisionForReport]`, {
                    replacements: {
                    },
                    type: QueryTypes.SELECT,
                });
                timeId = timeIdAndDivisionId[0].time_id;
                divisionId = timeIdAndDivisionId[0].division_id;
            } else {
                timeId = period;
                divisionId = division_id;
            }

            const timeIdAndDivisionId = await companyConnection.query(`
                EXEC [greensight_pepsi].[getTopTimeidbyDate] @time_id =:timeId`, {
                replacements: {
                    timeId
                },
                type: QueryTypes.SELECT,
            });

            const formattedResultTimeIds = this.formatTimeIdAndDivisionId(timeIdAndDivisionId);
            const periodName = formattedResultTimeIds[timeId];
            let wherePeriod = {
                division_id: divisionId,
                time_id: timeId
            }
            let timeIds = Object.keys(formattedResultTimeIds);
            let periods = Object.values(formattedResultTimeIds);
            let params = { pdf: 'period', periodName }
            const topLanes = await this.getTopLanesByVolume(models, 'DESC', wherePeriod, params);
            const bottomLanes = await this.getTopLanesByVolume(models, 'ASC', wherePeriod, params);
            const topCarriers = await this.getCarriersByVolume(models, 'DESC', wherePeriod, params);
            const bottomCarriers = await this.getCarriersByVolume(models, 'ASC', wherePeriod, params);
            let graphsEmissionsIntensity = await this.getLaneWiseEmissionsOverPeriods(models, topLanes['lanes'], timeIds, periods, divisionId);
            let graphsCarrierEmissionsIntensity = await this.getCarrierWiseEmissionsOverPeriods(models, topCarriers['scacs'], timeIds, periods, divisionId)
            // Process contributor and detractor data
            let configData = await getConfigConstants(
                companyConnection.models
            );
            const configLookup = createConfigLookup(configData);
            const daysRange = configLookup['pdf_biweekly_day_range'];
            const excludedFuel = configLookup['pdf_alternative_fuel_excluded'];
            const excludedCarrier  = configLookup['pdf_alternative_carrier_excluded']



            const result = await this.getMaxDateByBusinessUnit(companyConnection.models, divisionId);
            let eDate = new Date(result?.dataValues?.maxDate);
            const startDate = new Date(result?.dataValues?.maxDate);
            startDate.setDate(eDate.getDate() - daysRange);
            let endDate = result?.dataValues?.maxDate;
            // Pepsi West Division EV Shipments Report
            let replacements = {
                timeId: timeId
            }
            const evTable = await this.getEvShipmentsReport(companyConnection, replacements, periodName);
            let whereALt = {
                fuel_type: {
                    [Op.notIn]: excludedFuel.split(',')
                },
                scac: {
                    [Op.notIn]: excludedCarrier.split(',')
                },
                is_deleted: false
            }
            const alternateTable: any = await this.getAlternativeFuelReport(companyConnection.models, startDate, endDate,
                whereALt
            );
            // Pepsi West Division EV Shipments Report
            // Transform the topLanes data into the required format
            let tablesData: any = [];
            let topLanesTable = [];
            let bottomLanesA = [];
            let topCarriersA = [];
            topLanesTable.push(topLanes);
            bottomLanesA.push(bottomLanes);
            topCarriersA.push(topCarriers);
            tablesData.push(bottomCarriers);
            let evtable: any = [];
            for (const table of alternateTable) {
                evtable.push(table);
            }
            evtable.push(evTable);
            const pdfBuffer: any = await this.generatePdfFromHtmlPeriod(topLanesTable, bottomLanesA, topCarriersA, tablesData, evtable, graphsEmissionsIntensity, graphsCarrierEmissionsIntensity);
            const pdfFilePath = path.join(__dirname, "../public/emissions_report.pdf");
            fs.writeFileSync(pdfFilePath, pdfBuffer);
            return {
                subject: `Scope23: Pepsi West Period ${periodName} Emissions Report  `,
                fileName: `Emissions Report Period ${periodName}.pdf `,
                body: `Please find attached Emissions Report for Period ${periodName}`,
                buffer: pdfBuffer
            };

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }

    private async generatePdfFromHtmlPeriod(topLanesTable: any[], bottomLanes: any[], topCarriers: any[], tables: any[], evtable: any[], graphsEmissionsIntensity: any, graphsCarrierEmissionsIntensity: any): Promise<Buffer | undefined> {
        try {
            const templatePath = path.join(__dirname, "../public/reportpdf/indexPdfWestDivision.html");
            const htmlTemplate = fs.readFileSync(templatePath, "utf8");
            const template = handlebars.compile(htmlTemplate);
            // Convert background image to Base64
            const backgroundBase64 = this.backgroundBase64;
            const logoBase64 = this.logoBase64;
            const htmlContent = template({
                topLanesTable,
                bottomLanes,
                topCarriers,
                tables,
                backgroundBase64,
                logoBase64,
                show: true,
                evtable,
                ...graphsEmissionsIntensity,
                ...graphsCarrierEmissionsIntensity
            });

            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'], // Disable sandbox for root users
            });
            const page = await browser.newPage();
            await page.setContent(htmlContent);
            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
            });
            await browser.close();
            return Buffer.from(pdfBuffer);
        } catch (error) {
            console.error("Error Period Html PDF:", error);
        }
    }

    // Define a method to execute the query
    private async getMaxDateByBusinessUnit(dbCompany: any, divisionId: string) {
        try {
            const result = await dbCompany?.Emission.findAll({
                attributes: [
                    [Sequelize.fn('MAX', Sequelize.col('date')), 'maxDate'], // Using Sequelize.fn to apply MAX function on date
                    'division_id',
                ],
                where: { division_id: divisionId },
                group: ['division_id'], // Group by division_id
            });

            return result[0];
        } catch (error) {
            console.error("Error fetching max date by business unit:", error);
            return undefined; // Return undefined or an empty result if an error occurs
        }
    }

    // Function to get top 10 lanes by volume
    private async fetchTopEntities(
        dbCompany: any, 
        order: string, 
        where: any, 
        groupByFields: string[], 
        additionalAttributes: any[], 
        entityType: 'lanes' | 'carriers'
    ) {
        const havingCondition = order === 'ASC' ? Sequelize.literal('SUM(shipments) >= 20') : undefined;
        return await dbCompany.Emission.findAll({
            attributes: [
                ...groupByFields,
                [Sequelize.literal('SUM(emission) / 1000000'), 'emission'],
                [Sequelize.literal('SUM(emission) / SUM(total_ton_miles)'), 'intensity'],
                [Sequelize.literal('SUM(shipments)'), 'shipment'],
                ...additionalAttributes
            ],
            where,
            group: groupByFields,
            order: [[Sequelize.literal('SUM(shipments)'), order], [Sequelize.literal('SUM(emission)'), 'DESC']],
            having: havingCondition,
            limit: 10
        });
    }
    
    private buildResponseObject(
        periodName: string, 
        order: string, 
        entityType: 'lanes' | 'carriers'
    ) {
        const entityTitle = entityType === 'lanes' ? 'Lanes' : 'Carriers';
        const keyPrefix = order === 'DESC' ? 'Top' : 'Bottom';
    
        return {
            logoBase64: this.logoBase64,
            backgroundBase64: this.backgroundBase64,
            key: `${keyPrefix}${entityTitle}PD`,
            title: `${keyPrefix} 10 ${entityTitle} by Volume: Pure Diesel`,
            dateRange: `Data Available for Period - ${periodName}`,
            headers: entityType === 'lanes'
                ? ["Lane Name", "Emissions \n (tCO2e)", "Avg. Emissions Intensity (gCO2e/Ton-Mile)", "Total Shipments"]
                : ["SCAC", "Carrier Name", "Emissions \n (tCO2e)", "Avg. Emissions Intensity (gCO2e/Ton-Mile)", "Total Shipments"],
            rows: [],
            [entityType === 'lanes' ? 'lanes' : 'scacs']: []
        };
    }
    
    private async getTopLanesByVolume(dbCompany: any, order: string, where: any, requiredData: any) {
        try {
            const { periodName } = requiredData;
            const topLanes = await this.fetchTopEntities(
                dbCompany, 
                order, 
                where, 
                ['name'], 
                [], 
                'lanes'
            );
            let response:any = this.buildResponseObject(periodName, order, 'lanes');
            
            response.rows = topLanes.map((lane: any) => {
                response.lanes.push(lane.name);
                return {
                    'lane name': lane.name.replace('_', ' to '),
                    "emissions \n (tco2e)": lane.dataValues.emission.toFixed(2),
                    "avg. emissions intensity (gco2e/ton-mile)": lane.dataValues.intensity.toFixed(1),
                    "total shipments": lane.dataValues.shipment
                };
            });
    
            return response;
        } catch (error) {
            console.error("Error in getTopLanesByVolume:", error);
        }
    }
    
    private async getCarriersByVolume(dbCompany: any, order: string, where: any, requiredData: any) {
        try {
            const { periodName } = requiredData;
            const topCarriers = await this.fetchTopEntities(
                dbCompany, 
                order, 
                where, 
                ['carrier', 'carrier_name', 'carrier_logo'], 
                [], 
                'carriers'
            );
            let response:any = this.buildResponseObject(periodName, order, 'carriers');
    
            for (let carrier of topCarriers) {
                let carrierImage = carrier.dataValues.carrier_logo 
                    ? await getImageUrl(carrier.dataValues.carrier_logo, this.sasToken) 
                    : null;
    
                response.scacs.push(carrier.dataValues.carrier);
                response.rows.push({
                    'scac': carrier.dataValues.carrier,
                    'carrier name': carrier.dataValues.carrier_name,
                    'carrier_logo': carrierImage,
                    'emissions \n (tco2e)': carrier.dataValues.emission.toFixed(2),
                    'avg. emissions intensity (gco2e/ton-mile)': carrier.dataValues.intensity.toFixed(1),
                    "total shipments": carrier.dataValues.shipment
                });
            }
    
            return response;
        } catch (error) {
            console.error("Error in getCarriersByVolume:", error);
        }
    }
    

    private async getEvShipmentsReport(dbCompany: any, replacements: any, periodName: string) {
        try {
            const evShipments = await dbCompany.query(`
                EXEC [greensight_pepsi].[GetEvShipmentsReport] @time_id =:timeId`, {
                replacements: {
                    ...replacements
                },
                type: QueryTypes.SELECT,
            });

            let rowData = [];
            for (let shipment of evShipments) {
                rowData.push({
                    'scac': shipment['SCAC'],
                    carrier_logo: shipment['carrier.image'] ? await getImageUrl(shipment['carrier.image'], this.sasToken) : '',
                    'carrier name': shipment['carrier.name'],
                    'total shipments': shipment['total_shipment'],
                    'emissions (tco2e)': shipment['ev_emission'],
                    'emissions saved (tco2e)': shipment['emissions_saved']
                });
            }

            let obj: any = {};
            obj['logoBase64'] = this.logoBase64;
            obj['backgroundBase64'] = this.backgroundBase64;
            obj['key'] = "EvCarriers";
            obj['title'] = "Pepsi West Division Zero Emissions Report";
            obj['dateRange'] = `Data Available for Period - ${periodName}`
            obj["headers"] = ["Carrier Name", "Total Shipments", "Emissions (tCO2e)", "Emissions Saved (tCO2e)"];
            obj["rows"] = rowData;

            return obj;
        } catch (error) {
            console.error('Error fetching EV shipments report:', error);
        }
    }

    /**
 * Method to format and return the data for the alternative fuel report
 */
    private async getAlternativeFuelReport(dbCompany: any, startDate: Date, endDate: Date, where: any) {
        try {
            // Fetch the latest year
            const yearRange = await dbCompany.LaneAlternateFuelType.findAll({
                attributes: [
                    [Sequelize.fn('MIN', Sequelize.col('year')), 'minYear'],
                    [Sequelize.fn('MAX', Sequelize.col('year')), 'maxYear'],
                ],
                where: { is_deleted: false },
                raw: true
            });
            let startMonth;
            let endMonth;
            if (yearRange.length > 0) {
                // Find the minimum and maximum month in the latest year
                startMonth = await dbCompany.LaneAlternateFuelType.min('month', {
                    where: { year: yearRange[0].minYear, is_deleted: false },
                });
                endMonth = await dbCompany.LaneAlternateFuelType.max('month', {
                    where: { year: yearRange[0].maxYear, is_deleted: false },
                });

            }

            // Query the data with joins and calculations
            const data = await dbCompany.LaneAlternateFuelType.findAll({
                attributes: [
                    [Sequelize.col('afc.code'), 'fuel_type'],
                   // ['[afc].[code]', 'fuel_type'],
                    [Sequelize.literal('SUM(emission) / 1000000'), 'total_emissions'],
                    [
                        Sequelize.literal(
                            '(SUM(emission) - (SUM(emission) * afc.fuel_constant))/ 1000000'
                        ),
                        'emissions_saved'
                    ],
                    [Sequelize.col('afc2.image'), 'carrier_image'],
                    [Sequelize.col('afc2.scac'), 'carrier_scac'],
                    [Sequelize.col('afc2.name'), 'carrier_name']
                ],
                include: [
                    {
                        model: dbCompany.AlternateFuelTypeConstant,
                        attributes:['code', 'fuel_constant'],
                        as: 'afc',
                        required: false
                    },
                    {
                        model: dbCompany.AlternateFueltypeCarrier,
                        attributes:['image', 'scac', 'name'],
                        as: 'afc2',
                        required: false
                    }
                ],
                where: where,
                group: [
                    '[afc].[id]',
                     '[afc2].[id]',
                    'afc.fuel_constant',
                    'afc2.image',
                    'afc2.scac',
                    'afc2.name',
                    'afc.code'
                ],
                order: [[Sequelize.col('afc2.name'), 'ASC'], ['total_emissions', 'Desc']]
            });
            let rowData = [];
            for (let row of data) {
                let image = row.getDataValue('carrier_image');
                let carrierImage;
                if (image) {
                    carrierImage = await getImageUrl(row.getDataValue('carrier_image'), this.sasToken)
                } else {
                    carrierImage = null
                }
                rowData.push({
                    'fuel type': row.fuel_type,
                    'scac': row.getDataValue('carrier_scac'),
                    'emissions (tco2e)': parseFloat(row.getDataValue('total_emissions')).toFixed(2),
                    'emissions saved (tco2e)': parseFloat(row.getDataValue('emissions_saved')).toFixed(2),
                    'carrier_logo': carrierImage,
                    'carrier scac': row.getDataValue('carrier_scac') || null,
                    'carrier name': row.getDataValue('carrier_name') || null
                });
            }
            const startMonthName = moment().month(startMonth - 1).format("MMM"); // Convert month number to name
            const endMonthName = moment().month(endMonth - 1).format("MMM");

            const MAX_ROWS_PER_TABLE = 12;
                const splitTables = [];
                for (let i = 0; i < rowData.length; i += MAX_ROWS_PER_TABLE) {
                const chunk = rowData.slice(i, i + MAX_ROWS_PER_TABLE);

                splitTables.push({
                    title: "Pepsi West Division Alternative Fuel Report",
                    logoBase64: this.logoBase64,
                    backgroundBase64: this.backgroundBase64,
                    dateRange: `Data Available from ${startMonthName} ${yearRange[0].minYear} to ${endMonthName} ${yearRange[0].maxYear}`,
                    headers: ["Carrier Name", "Fuel Type", "Emissions (tCO2e)", "Emissions Saved (tCO2e)"],
                    rows: chunk
                });
                }
            return splitTables;
        } catch (error) {
            console.error("Error generating alternative fuel report:", error);
            return [{
                title: "Pepsi West Division Alternative Fuel Report",
                headers: ["Fuel Type", "Emissions (tCO2e)", "Emissions Saved (tCO2e)", "Carrier Image", "Carrier SCAC", "Carrier Name"],
                rows: []
            }];
        }
    }

    private formatTimeIdAndDivisionId(data: any) {
        const result: any = {};
        data.forEach((item: any) => {
            result[item.time_id] = item.period_name;
        });
        return result;
    }

    private async getLaneWiseEmissionsOverPeriods(models: any, topLanes: any, timeIds: any[], labels: any[], divisionId: any) {
        try {
            const { firstHalf, secondHalf } = splitArrayIntoTwoHalves(topLanes);
            //Fetching graph data 
            const filters = {
                timeIds: timeIds,
                names: firstHalf,
                division_id: divisionId
            };
            const emissionsGraphFirstData = await this.getEmissionsIntensityPeriodWise(models, filters);
            filters['names'] = secondHalf;
            const emissionsGraphSencondData = await this.getEmissionsIntensityPeriodWise(models, filters);
            //Graphs for Emissions
            let firstBarEmissionData = this.formatDataInBarChart(emissionsGraphFirstData, labels, 'emissions');

            let firstBarEmissionImage = await this.generateAndSaveChart(
                firstBarEmissionData,
                '',
                '', units.emissions
            )
            let secondBarEmissionData = this.formatDataInBarChart(emissionsGraphSencondData, labels, 'emissions');
            let secondBarEmissionImage = await this.generateAndSaveChart(
                secondBarEmissionData,
                '',
                '',
                units.emissions,
            )

            //Graphs for Intensity
            let firstBarIntensityData = this.formatDataInBarChart(emissionsGraphFirstData, labels, 'intensity');
            let firstBarIntensityImage = await this.generateAndSaveChart(
                firstBarIntensityData,
                '',
                '',
                units.emissionsIntensity
            )
            let secondBarIntensityData = this.formatDataInBarChart(emissionsGraphSencondData, labels, 'intensity');
            let secondBarIntensityImage = await this.generateAndSaveChart(
                secondBarIntensityData,
                '',
                '',
                units.emissionsIntensity
            )

            return { firstBarEmissionImage, secondBarEmissionImage, firstBarIntensityImage, secondBarIntensityImage }
        } catch (error) { console.error("error :", error) }
    }

    /**
 * Function to fetch emissions data using Sequelize's findAll method.
 *
 * @param {Object} models - Sequelize models object containing Emissions, TimeMapping, and TimePeriod models.
 * @param {Object} filters - Filter object containing the following:
 *    @property {Array<number>} timeIds - Array of time IDs to filter (optional).
 *    @property {Array<string>} names - Array of emission names to filter (optional).
 * @returns {Promise<Array<Object>>} - Returns an array of filtered and grouped emissions data.
 */
    private async getEmissionsIntensityPeriodWise(models: any, filters: any) {
        const { Emission, TimeMapping, TimePeriod } = models;

        // Dynamically construct where conditions
        const whereConditions = {
            [Op.and]: [
                // Add dynamic time_id filter if provided
                filters.timeIds ? { time_id: { [Op.in]: filters.timeIds } } : null,
                // Add dynamic names filter if provided
                filters.names ? { name: { [Op.in]: filters.names } } : null,
                filters.division_id ? { division_id: filters.division_id } : null
            ].filter(Boolean), // Remove null entries
        };

        try {
            const result = await Emission.findAll({
                attributes: [
                    [Sequelize.fn('CONCAT', Sequelize.col('TimeMapping->TimePeriod.name'), Sequelize.col('TimeMapping.name')), 'period_name'],
                    'time_id',
                    'name',
                    [Sequelize.literal('SUM(emission) / 1000000'), 'emissions'],
                    [Sequelize.literal('SUM(emission) / SUM(total_ton_miles)'), 'intensity']
                ],
                include: [
                    {
                        model: TimeMapping,
                        attributes: [],
                        as: "TimeMapping",
                        include: [
                            {
                                model: TimePeriod,
                                as: "TimePeriod",
                                attributes: []
                            }
                        ]
                    }
                ],
                where: whereConditions,
                group: ['Emission.time_id', 'Emission.name', 'TimeMapping->TimePeriod.name', 'TimeMapping.name'],
                order: ['name', 'time_id'],
                raw: true
            });
            return result;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }


    private async getCarrierWiseEmissionsOverPeriods(models: any, topCarrieris: any, timeIds: any[], periods: any[], divisionId: any) {
        try {
            const { firstHalf, secondHalf } = splitArrayIntoTwoHalves(topCarrieris);
            //Fetching graph data 
            const filters = {
                timeIds: timeIds,
                scacs: firstHalf,
                division_id: divisionId
            };
            const carrierEmissionsGraphFirstData = await this.getCarrierEmissionsIntensityPeriodWise(models, filters);
            filters['scacs'] = secondHalf;
            const carrierEmissionsGraphSencondData = await this.getCarrierEmissionsIntensityPeriodWise(models, filters);
            //Graphs for Emissions
            let firstBarCarrierEmissionData = this.formatDataInBarChart(carrierEmissionsGraphFirstData, periods, 'emissions', 'carrier');
            let firstBarCarrierEmissionImage = await this.generateAndSaveChart(
                firstBarCarrierEmissionData,
                '',
                '',
                units.emissions
            )
            let secondBarCarrierEmissionData = this.formatDataInBarChart(carrierEmissionsGraphSencondData, periods, 'emissions', 'carrier');
            let secondBarCarrierEmissionImage = await this.generateAndSaveChart(
                secondBarCarrierEmissionData,
                '',
                '',
                units.emissions
            )

            //Graphs for Intensity
            let firstBarCarrierIntensityData = this.formatDataInBarChart(carrierEmissionsGraphFirstData, periods, 'intensity', 'carrier');
            let firstBarCarrierIntensityImage = await this.generateAndSaveChart(
                firstBarCarrierIntensityData,
                '',
                '',
                units.emissionsIntensity
            )
            let secondBarCarrierIntensityData = this.formatDataInBarChart(carrierEmissionsGraphSencondData, periods, 'intensity', 'carrier');
            let secondBarCarrierIntensityImage = await this.generateAndSaveChart(
                secondBarCarrierIntensityData,
                '',
                '',
                units.emissionsIntensity
            )

            return { firstBarCarrierEmissionImage, secondBarCarrierEmissionImage, firstBarCarrierIntensityImage, secondBarCarrierIntensityImage }
        } catch (error) { console.error("error :", error) }
    }

    /**
 * Function to fetch emissions intensity data period-wise using Sequelize's findAll method.
 *
 * @param {Object} models - Sequelize models object containing Emissions, TimeMapping, and TimePeriod models.
 * @param {Object} filters - Filter object containing the following:
 *    @property {Array<number>} timeIds - Array of time IDs to filter (required).
 *    @property {Array<string>} carriers - Array of carrier names to filter (required).
 * @returns {Promise<Array<Object>>} - Returns an array of filtered and grouped emissions data.
 */
    private async getCarrierEmissionsIntensityPeriodWise(models: any, filters: { timeIds: number[], scacs: string[], division_id: string | number }) {
        const { Emission, TimeMapping, TimePeriod } = models;

        // Validate filters
        if (!filters.timeIds || !filters.scacs) {
            throw new Error('Both "timeIds" and "carriers" filters are required.');
        }

        try {
            const result = await Emission.findAll({
                attributes: [
                    [
                        Sequelize.fn(
                            'CONCAT',
                            Sequelize.col('TimeMapping->TimePeriod.name'),
                            Sequelize.col('TimeMapping.name')
                        ),
                        'period_name'
                    ],
                    'time_id',
                    'carrier',
                    [Sequelize.literal('SUM(emission) / 1000000'), 'emissions'],
                    [
                        Sequelize.literal('SUM(emission) / SUM(total_ton_miles)'),
                        'intensity'
                    ]
                ],
                include: [
                    {
                        model: TimeMapping,
                        as: 'TimeMapping',
                        attributes: [],
                        include: [
                            {
                                model: TimePeriod,
                                as: 'TimePeriod',
                                attributes: []
                            }
                        ]
                    }
                ],
                where: {
                    time_id: { [Op.in]: filters.timeIds },
                    carrier: { [Op.in]: filters.scacs },
                    division_id: filters.division_id
                },
                group: [
                    'time_id',
                    'carrier',
                    'TimeMapping->TimePeriod.name',
                    'TimeMapping.name'
                ],
                raw: true
            });

            return result;
        } catch (error) {
            console.error('Error fetching emissions intensity data:', error);
            throw error;
        }
    }

    private formatDataInBarChart(data: any[], labels: any, dataType = 'emissions', graph = 'lane') {
        interface ChartData {
            label: string;
            data: number[];
            backgroundColor: string;
            borderRadius: number;
            barPercentage: number;
        }
        const chartObj: any = {};
        let i = 0;
        for (let periodLane of data) {
            let name;
            if (graph == 'lane') {
                name = periodLane['name'];
            } else {
                name = periodLane['carrier'];
            }

            if (!chartObj[name]) {
                // Initialize the object if it doesn't exist
                chartObj[name] = {
                };
                i++;
            }

            chartObj[name][periodLane['period_name']] = periodLane[dataType];
        }
        const datasets = this.generateBarChartDataset(chartObj, labels);
        //Generate char image
        return { labels, datasets: datasets };
    };

    private generateBarChartDataset(data: any, labels: any) {
        const datasets = [];


        let laneIndex = 0;

        // Loop through each lane in the data object
        for (const lane in data) {
            const laneData: any = [];

            // Loop through each label (P1, P2, ..., P6) and push the corresponding value from the lane
            labels.forEach((label: any) => {
                // Push the value from the lane object, or 0 if the property doesn't exist
                laneData.push(data[lane][label] || 0);
            });

            // Create the dataset object for the current lane
            datasets.push({
                label: lane,
                data: laneData,
                backgroundColor: pdfLaneCarrierColors[laneIndex],
                barPercentage: 0.4,
                borderRadius: 8,
            });

            // Move to the next lane (cycle through the colors array)
            laneIndex++;
        }

        return datasets;
    }


    private async generateAndSaveChart(
        data: any,
        title: string,
        xAxisLabel: string,
        yAxisLabel: string,
        imageFileName: string = 'emissions_emission.png',
        width: number = 700,
        height: number = 430
    ): Promise<string> {
        try {
            // Generate the chart buffer using the generateBarChart function
            const chartService = new ChartService(width, height);
            const buffer: Buffer = await chartService.generateBarChart(
                data.labels,
                data.datasets,
                title,
                xAxisLabel,
                yAxisLabel
            );

            // Convert the buffer to a base64 string
            const stringImage = getBase64Image(buffer);

            // Return the base64 string
            return stringImage;
        } catch (error) {
            console.error("Error generating or saving chart:", error);
            throw new Error("Failed to generate or save chart.");
        }
    }



}

export default GeneratePdf;



