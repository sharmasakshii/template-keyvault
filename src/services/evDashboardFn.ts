import { Op, Sequelize } from "sequelize";
import { callStoredProcedure, getDateDiffrenceInDays, getWeekDateRange, whereClauseFn } from "./commonServices";
import moment from "moment";
const Excel = require("excel4node");
import { buildWhereClause, checkNUllValue } from "../utils"

import { convertToMillion, styles } from "../constant";


export const getDashboardMatrixDataController = async (start_date: string, end_date: string, platform_mode: string, scacValues: any, companyConnection: any): Promise<any> => {

    if (!start_date) {
        throw new Error("Start date is required");
    }

    const scacArray = Array.isArray(scacValues) ? scacValues : [scacValues];

    // Build where clause
    const where: any = {
        scac: scacArray,
    };

    const payload = [{ is_bev: '1' }, { platform_mode: platform_mode }];

    if (start_date) {
        where[Op.and] = [Sequelize.literal(`date >= '${start_date}'`)];
    }

    if (end_date) {
        where[Op.and] = [...(where[Op.and] || []), Sequelize.literal(`date <= '${end_date}'`)];
    }

    // Add additional conditions from whereClauseFn
    const whereClause = await whereClauseFn(payload);
    where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

    // Perform the query
    const evShipmentData = await companyConnection?.EvEmissions.findAll({
        attributes: [
            'scac', // Group by SCAC
            [Sequelize.literal(`(SELECT round(SUM(ev_emission)/${convertToMillion}, 2))`), 'ev_emission'],
            [Sequelize.literal('(SELECT COUNT(shipment))'), 'shipment'],
            [Sequelize.literal('(SELECT round(SUM(total_ton_miles), 2))'), 'total_ton_miles'],
            [Sequelize.literal('(SELECT round(SUM(loaded_ton_miles), 2))'), 'loaded_ton_miles'],
            [Sequelize.literal('(SELECT round(SUM(loaded_ton_miles), 2) * 2)'), 'kwh'],
            [Sequelize.literal(`(SELECT round(SUM(standard_emission)/${convertToMillion}, 2))`), 'actual_emission'],
            [Sequelize.literal('(SELECT count(DISTINCT name))'), 'lane']
        ],
        where: where,
        group: ['scac'], // Group results by SCAC
        order: [['scac', 'asc']],
        raw: true
    });
    return evShipmentData;
};


export const getEVShipmentByDateGraphDataController = async (start_date: string, end_date: string, platform_mode: string, scac: string, companyConnection: any): Promise<any> => {
    const where: any = {};
    where[Op.and] = [];
    try {
        // Ensure scac is an array
        const scacArray = Array.isArray(scac) ? scac : [scac];

        const payload = [
            { is_bev: '1' },
            { scac: scacArray }, //{ [Op.in]: scacArray } }, // Handle multiple SCACs
            { platform_mode: platform_mode }
        ];

        const whereClause = await buildWhereClause(payload, start_date, end_date, 'date');

        // Calculate date difference for grouping
        let getDaysDifference: any = await getDateDiffrenceInDays(start_date, end_date);
        let groupByDate: any = [];
        let orderBy: any = [];
        let attributes: any = [];

        if (getDaysDifference <= 7) {
            groupByDate = ['date', 'scac']; // Include scac in grouping
            orderBy = ['date'];
            attributes = [
                'scac', // Include scac in attributes
                [Sequelize.fn('COALESCE', Sequelize.fn('COUNT', Sequelize.col('shipment')), 0), 'shipments'],
                'date'
            ];
        } else if (getDaysDifference > 7 && getDaysDifference < 62) {
            groupByDate = [
                [Sequelize.fn('DATEPART', Sequelize.literal('WEEK'), Sequelize.col('date')), 'week'],
                [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
                [Sequelize.fn('YEAR', Sequelize.col('date')), 'year'],
                'scac' // Include scac in grouping
            ];
            orderBy = [['year'], ['month'], ['week']];
            attributes = [
                'scac', // Include scac in attributes
                [Sequelize.fn('COALESCE', Sequelize.fn('COUNT', Sequelize.col('shipment')), 0), 'shipments'],
                [Sequelize.fn('DATEPART', Sequelize.literal('WEEK'), Sequelize.col('date')), 'week'],
                [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
                [Sequelize.fn('YEAR', Sequelize.col('date')), 'year']
            ];
        } else if (getDaysDifference > 61 && getDaysDifference < 366) {
            groupByDate = [
                [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
                [Sequelize.fn('YEAR', Sequelize.col('date')), 'year'],
                'scac' // Include scac in grouping
            ];
            orderBy = [['year'], ['month']];
            attributes = [
                'scac', // Include scac in attributes
                [Sequelize.fn('COALESCE', Sequelize.fn('COUNT', Sequelize.col('shipment')), 0), 'shipments'],
                [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
                [Sequelize.fn('YEAR', Sequelize.col('date')), 'year']
            ];
        } else if (getDaysDifference > 365) {
            groupByDate = [
                [Sequelize.fn('YEAR', Sequelize.col('date')), 'year'],
                'scac' // Include scac in grouping
            ];
            orderBy = [['year']];
            attributes = [
                'scac', // Include scac in attributes
                [Sequelize.fn('COALESCE', Sequelize.fn('COUNT', Sequelize.col('shipment')), 0), 'shipments'],
                [Sequelize.fn('YEAR', Sequelize.col('date')), 'year']
            ];
        }

        // Query to get shipment data
        let getShipmentData = await companyConnection?.EvEmissions.findAll({
            attributes: attributes,
            where: whereClause,
            group: groupByDate,
            order: orderBy
        });

        // Format the output data
        // Call the common function to format the response data
        return formatShipmentData(getDaysDifference, getShipmentData);
    }
    catch (err: any) {
        console.log(err, "err")
        throw new Error(err)
    }
};


function formatShipmentData(getDaysDifference: any, getShipmentData: any) {
    try {
        let responseData = [];

        if (getDaysDifference <= 7) {
            // Date-wise
            responseData = getShipmentData.map((item: any) => {
                const date = item.get('date');
                const shipments = item?.get('shipments');
                return {
                    scac: item?.get('scac'),
                    shipments: shipments,
                    date: moment(date).format('DD MMM YYYY'), // Format date as "17 Feb 2024"
                };
            });
        } else if (getDaysDifference > 7 && getDaysDifference < 62) {
            // Week-wise
            responseData = getShipmentData.map((item: any) => {
                const year = item.get('year');
                const week = item.get('week');
                const shipments = item.get('shipments');

                let dateRange = getWeekDateRange(year, week);

                return {
                    scac: item?.get('scac'),
                    shipments: shipments,
                    date: dateRange,
                    year: year
                };
            });
        } else if (getDaysDifference > 61 && getDaysDifference < 366) {
            // Month-wise
            responseData = getShipmentData.map((item: any) => {
                const month = item.get('month');
                const year = item.get('year');
                const shipments = item.get('shipments');
                return {
                    scac: item?.get('scac'),
                    shipments: shipments,
                    date: moment().year(year).month(month - 1).format('MMM-YYYY'), // Format month as "Feb-2024"
                    year: year
                };
            });
        } else if (getDaysDifference > 365) {
            // Year-wise
            responseData = getShipmentData.map((item: any) => {
                const year = item.get('year');
                const shipments = item.get('shipments');
                return {
                    scac: item?.get('scac'),
                    shipments: shipments,
                    date: `${year}` // Year as is
                };
            });
        }
        return responseData;
    }
    catch (err: any) {
        console.log(err, " err")
        throw new Error(err)
    }
}

export const getTruckShipmentsLaneDataContoller = async (start_date: string, end_date: string, scac: string, connection: any): Promise<any> => {
    try {
        const scacArray = Array.isArray(scac) ? scac : [scac];

        let replacements = {
            start_date: start_date,
            end_date: end_date || new Date,
            is_bev: 1,
            scac_list: scacArray.join(',')
        };

        const query = `EXEC ${connection?.schema}.GetTop5ShipmentsBySCAC 
            @start_date = :start_date,
            @end_date = :end_date,
            @is_bev = :is_bev,
            @scac_list = :scac_list;
    `;

        const result = await callStoredProcedure(replacements, connection[connection.company], query);

        return result
    }
    catch (err: any) {
        console.log(err, " err")
        throw new Error(err)
    }
};


export const createBuffer = (organizedData: any) => {
    const workbook = new Excel.Workbook();

    // Iterate over each tab
    Object.keys(organizedData).forEach(tabName => {
        const worksheet = workbook.addWorksheet(tabName);
        const data: any = organizedData[tabName];
        worksheet.column(1).setWidth(40);
        const headStyle = {
            font: {
                bold: true,
                color: "#FFFFFF", // White color for font
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: styles?.default // Blue background color for headers
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: {
                left: {
                    style: 'thin',
                    color: "#000000"
                },
                right: {
                    style: 'thin',
                    color: "#000000"
                },
                top: {
                    style: 'thin',
                    color: "#000000"
                },
                bottom: {
                    style: 'thin',
                    color: "#000000"
                }
            }
        };

        const commonStyle = {
            alignment: {
                horizontal: 'left',
                vertical: 'center'
            },
            border: {
                left: {
                    style: 'thin',
                    color: "#000000"
                },
                right: {
                    style: 'thin',
                    color: "#000000"
                },
                top: {
                    style: 'thin',
                    color: "#000000"
                },
                bottom: {
                    style: 'thin',
                    color: "#000000"
                }
            }
        }
        // Define style for headers
        const headerStyle = workbook.createStyle(headStyle);
        headStyle.alignment.horizontal = 'left';
        const header2Style = workbook.createStyle(headStyle);
        const dataStyle = workbook.createStyle(commonStyle);
        commonStyle.alignment.horizontal = 'center'
        const noRecordStyle = workbook.createStyle(commonStyle);


        let rowIndex = 1;

        // Write date information
        worksheet.cell(rowIndex, 1).string('Start Date').style(header2Style);
        worksheet.cell(rowIndex, 2).string('End Date').style(header2Style);
        worksheet.cell(rowIndex + 1, 1).date(data.date['start date']).style(dataStyle);
        worksheet.cell(rowIndex + 1, 2).date(data.date['end date']).style(dataStyle);

        rowIndex += 3;

        // Write metrics
        worksheet.cell(rowIndex, 1, rowIndex, 2, true).string('Metrics').style(headerStyle);
        rowIndex += 1;

        if (Object.keys(data?.matrics)?.length > 0) {
            Object.keys(data?.matrics).forEach((key) => {
                if (key !== 'scac') {
                    worksheet.cell(rowIndex, 1).string(key).style(dataStyle);
                    worksheet.cell(rowIndex, 2).number(parseFloat(data?.matrics?.[key]) || 0).style(dataStyle);
                    rowIndex++;
                }
            });
        } else {
            worksheet.cell(rowIndex, 1, rowIndex, 2, true).string('No record found').style(noRecordStyle);
            rowIndex += 1;
        }


        rowIndex++;

        // Write Datewise Shipment
        worksheet.cell(rowIndex, 1, rowIndex, 2, true).string('Datewise Shipment').style(headerStyle);
        rowIndex += 1;

        if (data['Datewise Shipment'].length > 0) {
            worksheet.cell(rowIndex, 1).string("Date").style(header2Style);
            worksheet.cell(rowIndex, 2).string("Shipment").style(header2Style);
            rowIndex += 1;
            data['Datewise Shipment'].forEach((item: any) => {
                worksheet.cell(rowIndex, 1).string(item.date).style(dataStyle);
                worksheet.cell(rowIndex, 2).number(item.shipments || 0).style(dataStyle);
                rowIndex++;
            });
        } else {
            worksheet.cell(rowIndex, 1, rowIndex, 2, true).string('No record found').style(noRecordStyle);
            rowIndex += 1;
        }
        rowIndex++;

        // Write Lanewise Shipment
        worksheet.cell(rowIndex, 1, rowIndex, 2, true).string('Lanewise Shipment').style(headerStyle);
        rowIndex++;

        if (data['Lanewise Shipment'].length > 0) {
            worksheet.cell(rowIndex, 1).string("Lane Name").style(header2Style);
            worksheet.cell(rowIndex, 2).string("Shipments").style(header2Style);
            rowIndex++;
            data['Lanewise Shipment'].forEach((item: any) => {
                worksheet.cell(rowIndex, 1).string(item.name).style(dataStyle); // Assuming each item has a 'name' property
                worksheet.cell(rowIndex, 2).number(item.shipment || 0).style(dataStyle); // Assuming each item has a 'shipment' property
                rowIndex++;
            });
        } else {
            worksheet.cell(rowIndex, 1, rowIndex, 2, true).string('No record found').style(noRecordStyle);
            rowIndex += 1;
        }
    });
    return workbook;
};


export const getEVTTMByDateGraphMasterController = async (start_date: string, end_date: string, scac: string, companyConnection: any): Promise<any> => {

    const payload = [{ is_bev: '1' }, { scac: scac }];
    const where = await buildWhereClause(payload, start_date, end_date, 'date');

    // Calculate date difference for grouping
    let getDaysDifference: any = await getDateDiffrenceInDays(start_date, end_date);
    let groupByDate: any = [];
    let orderBy: any = [];
    if (getDaysDifference <= 7) {
        groupByDate = ['date'];
        orderBy = ['date'];
    } else if (getDaysDifference > 7 && getDaysDifference < 62) {
        groupByDate = [
            [Sequelize.fn('DATEPART', Sequelize.literal('WEEK'), Sequelize.col('date')), 'week'],
            [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
            [Sequelize.fn('YEAR', Sequelize.col('date')), 'year'],
                    // Week Start (Sunday)
            [Sequelize.literal("DATEADD(DAY, -(DATEPART(WEEKDAY, [date]) - 1), [date])"), 'week_start_date'],
            // Week End (Saturday)
            [Sequelize.literal("DATEADD(DAY, 7 - DATEPART(WEEKDAY, [date]), [date])"), 'week_end_date'],
            // Week Range in 'DD MMM - DD MMM' format
            [
                Sequelize.literal(`
                    FORMAT(DATEADD(DAY, -(DATEPART(WEEKDAY, [date]) - 1), [date]), 'dd MMM') 
                    + ' - ' + 
                    FORMAT(DATEADD(DAY, 7 - DATEPART(WEEKDAY, [date]), [date]), 'dd MMM')
                `),
                'week_range'
            ]
        ];
        orderBy = [['year'], ['month'], ['week']];
    } else if (getDaysDifference > 61 && getDaysDifference < 366) {
        groupByDate = [
            [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
            [Sequelize.fn('YEAR', Sequelize.col('date')), 'year']
        ];
        orderBy = [['year'], ['month']];
    } else if (getDaysDifference > 365) {
        groupByDate = [[Sequelize.fn('YEAR', Sequelize.col('date')), 'year']];
        orderBy = [['year']];
    }

    orderBy.push(["scac"])

    // Query to get shipment data
    let getTotalTonMilesData = await companyConnection?.EvEmissions.findAll({
        attributes: [...groupByDate, ['scac', 'scac'], [Sequelize.fn('ROUND', Sequelize.fn('SUM', Sequelize.col('total_ton_miles')), 2), 'total_ton_miles']],
        where: where,
        include: [
            {
                model: companyConnection?.EvCarriers, // Add the EvCarriers model
                attributes: ['name', 'image', 'color'], // Select name and image fields
                as: 'carrier',
                required: true // Ensure only records with a matching carrier are returned
            }
        ],
        group: ['EvEmissions.scac', ...groupByDate, 'carrier.name', 'carrier.image', '[carrier].[id]', 'carrier.color'],
        order: orderBy
    });

    // Format the output data
    // Call the common function to format the response data
    return await formatShipmentDataGraph(getDaysDifference, getTotalTonMilesData ?? [])
};


async function formatShipmentDataGraph(getDaysDifference: any, getTotalTonMilesData: any) {
    const responseData: any = [];
    const datesArray = [];
    const periodsArray: any = [];
    // Process data
    for (let item of getTotalTonMilesData) {
        let periodKey;
        const scac = checkNUllValue(item?.dataValues?.scac);
        const year = checkNUllValue(item?.dataValues?.year);
        const month = checkNUllValue(item?.dataValues?.month);
        const date = checkNUllValue(item?.dataValues?.date);
        const week = checkNUllValue(item?.dataValues?.week);
        const totalTonMiles = checkNUllValue(item?.dataValues?.total_ton_miles);
        const weekRange = checkNUllValue(item?.dataValues?.week_range);
        const dateLabel = await formatDate(getDaysDifference, year, month, week, date, weekRange);
        periodKey = dateLabel?.key;

        if (!responseData[scac]) {
            responseData[scac] = {
                name: item?.dataValues?.carrier?.name || scac, // Fallback to SCAC if no name found
                data: [],
                color: item?.dataValues?.carrier?.color || '#000', // Fallback to black if no color found
            };
        }

        // Track unique periods (dates, weeks, months, or years)
        if (!periodsArray.includes(periodKey)) {
            periodsArray.push(periodKey);
            datesArray.push(dateLabel?.d)
        }

        // Assign the total ton miles to the periodKey for each carrier
        responseData[scac][periodKey] = totalTonMiles;
    };

    // Fill missing periods for each carrier with 0
    for (let scac in responseData) {
        const carrierData = responseData[scac];
        carrierData.data = periodsArray.map((periodKey: any) => {
            return responseData[scac][periodKey] || 0;
        });

        // Now remove the dynamically generated period keys (e.g., "Y2023", "W2_M1_Y2023")
        for (let periodKey of periodsArray) {
            delete responseData[scac][periodKey];
        }
    }

    // Transform responseData into the desired array format
    const finalResponseData = Object.values(responseData);

    // Remove duplicate dates and format the final response
    const uniqueDates = [...new Set(datesArray)];

    return {
        dates: uniqueDates,
        data: finalResponseData,
    };
}

// Helper function to format date strings
async function formatDate(getDaysDifference: any, year: any, month: any, week: any, date: any, weekRange:any) {
    if (getDaysDifference <= 7 && date) {
        // Date-wise
        return { d: moment(date).format('DD MMM YYYY'), key: date, period: 'day' };
    } else if (getDaysDifference > 7 && getDaysDifference < 62) {
        return {
            d: weekRange,
            key: weekRange,
            period: 'week'
        };
    } else if (getDaysDifference > 61 && getDaysDifference < 366) {
        // Month-wise
        return {
            d:moment().year(year).month(month - 1).format('MMM-YYYY'),
            key: `${month - 1}-${year}`,
            period: 'month'
        };
    } else if (getDaysDifference > 365) {
        // Year-wise
        return { d: year, key: `${year}`, period: 'year' };
    }
};
