import { Response } from "express";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { paginate, whereClauseFn } from "../../services/commonServices";
import { convertToMillion } from "../../constant";


class FuelsReportController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getTransactionList(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const authenticate: any = this.connection
            const companyConnection = authenticate[authenticate.company]
            const { year, period, divisionId, transport_id, bu_id, mu_id, company_id, fuel_type_id, location_id, page_size = 10, page = 1, order_by, sortOrder } = req.body

            const payload = [{ business_unit_id: bu_id }, { market_id: mu_id }, { company_id: company_id }, { fuel_type_id: fuel_type_id }, { location_id: location_id }, {
                year: year, period_id: period,
            }, { transport_id: transport_id }, { division_id: divisionId }]

            const where = await whereClauseFn(payload)

            let page_server = page ? parseInt(page) - 1 : 0;

            const transactionList = await companyConnection["models"].FuelReport.findAndCountAll(
                paginate(
                    {
                        attributes: ['transactions', ['gallons', 'total_fuel_consumption'],
                            [Sequelize.col('transactionDivision.name'), 'division'],
                            [Sequelize.col('transactionLocation.name'), 'location'],
                            [Sequelize.col('transactionMarket.name'), 'market'],
                            [Sequelize.col('transactionBusinessUnitScope1.name'), 'business'],
                            [Sequelize.col('transactionCompany.name'), 'company'],
                            [Sequelize.col('pbnaFuelType.name'), 'fuel']
                        ],
                        where: where,
                        include: [
                            {
                                model: companyConnection['models'].Division,
                                attributes: [],
                                as: 'transactionDivision'
                            },
                            {
                                model: companyConnection['models'].Location,
                                attributes: [],
                                as: 'transactionLocation'
                            },
                            {
                                model: companyConnection['models'].Market,
                                attributes: [],
                                as: 'transactionMarket'
                            },
                            {
                                model: companyConnection['models'].BusinessUnitScope1,
                                attributes: [],
                                as: 'transactionBusinessUnitScope1'
                            },
                            {
                                model: companyConnection['models'].Company,
                                attributes: [],
                                as: 'transactionCompany'
                            },
                            {
                                model: companyConnection['models'].FuelType,
                                attributes: [],
                                as: 'pbnaFuelType'
                            },
                        ],
                        order: [[order_by, sortOrder]],
                    }, {
                    page: page_server,
                    pageSize: page_size,
                }));

            if (transactionList?.rows?.length > 0) {
                const responseData = {
                    list: transactionList.rows,
                    pagination: {
                        page: page,
                        page_size: page_size,
                        total_count: transactionList.count
                    },
                };
                return generateResponse(res, 200, true, "Get transaction list", responseData)
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)

        }
        catch (err) {
            console.log(err, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR)

        }
    }

    async getPieChartData(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const authenticate: any = this.connection

            const companyConnection = authenticate[authenticate.company]
            const { year, division, period, transport, type = "fuel" } = req.query

            const payload = [
                { year },
                { period_id: period },
                { division_id: division },
                { transport_id: transport }]

            const where = await whereClauseFn(payload)

            const selectAttr = type == "fuel" ? [Sequelize.fn("SUM", Sequelize.col("gallons")), "fuel_consumption"] : [Sequelize.literal(`sum(emissions)/${convertToMillion}`), "fuel_consumption"]
            const [otherData = [], fetchPieData] = await Promise.all([
                division
                    ? companyConnection['models'].FuelReport.findAll({
                        attributes: [selectAttr]
                    })
                    : Promise.resolve([]), // Return empty array if no division
                companyConnection['models'].FuelReport.findAll({
                    attributes: [
                        selectAttr,
                        'division_id',
                        [Sequelize.col('transactionDivision.name'), 'division'],
                        [Sequelize.col('transactionDivision.color'), 'color']
                    ],
                    where: where,
                    include: [
                        {
                            model: companyConnection['models'].Division,
                            as: "transactionDivision",
                            attributes: [],
                            required: false
                        }
                    ],
                    group: ['FuelReport.division_id', 'transactionDivision.name', 'transactionDivision.color']
                })
            ]);

            if (fetchPieData?.length > 0) {
                const mapData = division ? otherData : fetchPieData

                const totalFuelConsumption = mapData.reduce((total: number, ele: any) => {
                    return total + (ele.dataValues.fuel_consumption || 0);
                }, 0);

                let data = fetchPieData.map((ele: any) => {
                    return ({ name: ele.dataValues.division, value: (ele.dataValues.fuel_consumption / totalFuelConsumption) * 100, color: ele.dataValues.color })
                })
                if (division) {
                    data.push({ name: "Others", value: ((otherData[0].dataValues.fuel_consumption - fetchPieData[0].dataValues.fuel_consumption) / totalFuelConsumption) * 100, color: "#367c90" })
                }

                return generateResponse(res, 200, true, "Get pie chart data  list", data)
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
        }
        catch (err) {
            console.log(err, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR)
        }
    }

}

export default FuelsReportController;
