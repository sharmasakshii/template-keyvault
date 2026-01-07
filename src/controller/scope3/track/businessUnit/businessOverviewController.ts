import sequelize, { Sequelize, Op } from "sequelize"
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { processEmissionReductionData, roundToDecimal, targetValuesFn, targetValuesPeriodWiseFn } from "../../../../services/commonServices";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import {comapnyDbAlias, convertToMillion} from "../../../../constant";
import { isCompanyEnable } from "../../../../utils";

class BusinessOverViewController {

    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData
    }

    async getBusinessEmissionReduction(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection
            const companyConnection = authenticate[authenticate?.company]?.models
            let { bu_id, year, toggel_data, region_id, time_id, division_id } = request.body

            const { where, whereRegion, current_year } = this.buildWhereClauses(bu_id, year, region_id, time_id, division_id);
            let next_year = current_year + 1;
            let commonAttr = []
            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP])) {
            commonAttr = [[sequelize.col("[SummerisedBusinessUnitTimeMapping->TimePeriod].[id]"), "period_id"],
            [sequelize.literal("SummerisedBusinessUnit.year"), "year"]]
            }
            else {
                commonAttr = [sequelize.literal("year"), sequelize.literal("quarter")]
            }

            const baseAttributes: any = [
                [sequelize.literal(`SUM(emissions) / ${convertToMillion}`), 'intensity'],
                ...commonAttr
            ];

            const toggledAttributes: any = [
                [sequelize.literal('SUM(emissions) / NULLIF(SUM(total_ton_miles), 0)'), 'intensity'],
                ...commonAttr
            ];

            const attributeArray = toggel_data === 1 ? toggledAttributes : baseAttributes;
            let group: any[] = [];
            let include: any[] = [];
            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP])) {
                 group = [
                    sequelize.literal("SummerisedBusinessUnit.year"),
                    sequelize.col("[SummerisedBusinessUnitTimeMapping->TimePeriod].[id]")
                ]
                 include = [
                    {
                        model: authenticate[authenticate.company].models.TimeMapping,
                        as: "SummerisedBusinessUnitTimeMapping",
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: authenticate[authenticate.company].models.TimePeriod,
                                as: "TimePeriod",
                                required: true,
                                attributes: []
                            }
                        ]
                    }
                ];
            } else {
                group = [sequelize.literal("year"), sequelize.literal("quarter")];
            }
            const findEmissionsReduction = async (whereCondition: any) => {
                return companyConnection.SummerisedBusinessUnit.findAll({
                    attributes: attributeArray,
                    include,
                    where: whereCondition,
                    group: group,
                    order: group
                });
            };

            const [getRegionEmissionsReduction, regionEmissionsReduction] = await Promise.all([
                findEmissionsReduction(where),
                findEmissionsReduction(whereRegion)
            ]);

            if (getRegionEmissionsReduction.length > 0) {
                let company_level = [];
                let max_array = [];
                let base_level = [];
                let region_data = [];
                for (const property of getRegionEmissionsReduction) {
                    company_level.push(roundToDecimal(property.dataValues.intensity));
                }
                for (const property of regionEmissionsReduction) {
                    region_data.push(roundToDecimal(property.dataValues.intensity));
                    max_array.push(property.dataValues.intensity);
                }
                let requiredData = {
                    year: year,
                    toggel_data: toggel_data,
                    tableName: 'SummerisedBusinessUnit',
                    columnName: 'emissions',
                    dataBaseTable: 'summerised_business_unit'
                }
                 let targetValues = [];
                            if(isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP])){
                                targetValues = await targetValuesPeriodWiseFn(companyConnection, { bu_id: bu_id, region_id: region_id, division_id: division_id }, requiredData, authenticate['schema']);
                            }else{
                                targetValues = await targetValuesFn(companyConnection, { bu_id: bu_id, region_id: region_id, division_id: division_id }, requiredData, authenticate['schema']);
                            }
                let max = Math.max(...max_array);
                let maxData = roundToDecimal(max + (max * 30 / 100));
                base_level.push(maxData);
                let data = processEmissionReductionData({
                    fetchKey: "intensity",
                    current_year: current_year,
                    next_year: next_year,
                    emissionData: getRegionEmissionsReduction,
                    targetValues: targetValues,
                    company_level: company_level,
                    region_level: region_data,
                    base_level: base_level,
                    max_override: roundToDecimal(maxData + (maxData * 20 / 100)),
                    company: authenticate?.company
                });

                return generateResponse(res, 200, true, "Emissions Reduction", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private buildWhereClauses(
        bu_id: number,
        year: string,
        region_id: number,
        time_id: number,
        division_id: number
    ) {
        const whereRegion: any = { [Op.and]: [], [Op.or]: [] };
        const where: any = { [Op.and]: [], [Op.or]: [] };

        let current_year = new Date().getFullYear() - 1;
        let next_year = current_year + 1;

        if (bu_id) whereRegion[Op.and].push({ bu_id });
        if (region_id) {
            whereRegion[Op.and].push({ region_id });
            where[Op.or].push({ region_id });
        }
        if (year) {
            current_year = parseInt(year, 10);
            next_year = current_year + 1;
            const yearConditions = [{ year: current_year }];
            where[Op.or].push(...yearConditions);
            whereRegion[Op.or].push(...yearConditions);
        }
        if (time_id) where[Op.and].push({ time_id });
        if (division_id) {
            const divisionCondition = { division_id };
            where[Op.and].push(divisionCondition);
            whereRegion[Op.and].push(divisionCondition);
        }

        return { where, whereRegion, current_year, next_year, time_id };
    }

}

export default BusinessOverViewController