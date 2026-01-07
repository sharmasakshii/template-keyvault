import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import {
  getConfigConstants,
  roundToDecimal,
  whereClauseFn,
  updateColors,
  calculateAverage
} from "../../../../services/commonServices";
import { getContributorDetractorGraphColor } from "../../../../utils";
import { convertToMillion } from "../../../../constant";
const sequelize = require("sequelize");
const Op = sequelize.Op;

class FacilityController {
  private readonly connection: Sequelize;

  constructor(connectionData: Sequelize) {
    this.connection = connectionData;
  }

  // API handler function
  async fetchFacilityTableData(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      let authenticate: any = this.connection;
      const { region_id, year, quarter, col_name, order_by } = request.body;

      const where: any = {};
      where[Op.and] = []
      const payload = [{ region_id: region_id }, { year: year }, { quarter: quarter }]
      const whereClause = await whereClauseFn(payload)

      where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

      let facilityData = await this.fetchFacilityData(
        authenticate[authenticate.company].models,
        where,
        col_name,
        order_by
      );

      if (facilityData.length > 0) {
        // Fetch configuration constants
        let configData = await getConfigConstants(
          authenticate[authenticate.company].models
        );

        // Process the data to calculate intensity and emission
        facilityData = this.processData(facilityData, configData);

        // Send success response with the processed data
        return generateResponse(
          res,
          200,
          true,
          "Get Facility Table Data.",
          facilityData
        );
      } else {
        // No data found
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getFacilityEmissionData(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      let authenticate: any = this.connection;
      let companyConnection = authenticate[authenticate.company]
      let { region_id, year, quarter, toggel_data } = request.body;
      const where: any = {};

      if (region_id || year || quarter) {
        where[Op.and] = [];
        if (region_id) {
          where[Op.and].push({
            region_id: region_id
          });
        }
        if (year) {
          where[Op.and].push({ 'year': year });
        }
        if (quarter) {
          where[Op.and].push({ 'quarter': quarter });
        }
      }
      let column = toggel_data == 1 ? 'emission' : 'intensity';
      let getFacilityEmissions = await companyConnection.models.SummerisedFacilities.findAll({
        attributes: [
          [sequelize.literal('ROUND(SUM(CAST(emission AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1) '), 'intensity'],
          [sequelize.literal('SUM(CAST(emission AS FLOAT))'), 'emission']
        ],
        where: where,
        include: [
          {
            model: companyConnection["models"].Region,
            attributes: [],
            as: 'region'
          }, {
            model: companyConnection["models"].Facility,
            attributes: ['name'],
            as: 'facility'
          }
        ],
        group: ['facility.id', 'facility.name'],
        order: [[column, 'desc']],
        raw: true
      });
      if (getFacilityEmissions.length > 0) {
        let configData = await getConfigConstants(authenticate[authenticate.company].models)
        return this.processFacilityEmissions(getFacilityEmissions, toggel_data, configData, res);
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  // Helper function to fetch facility data from the database
  private async fetchFacilityData(
    initDbConnection: any,
    where: any,
    col_name: string,
    order_by: string
  ) {
    const data = await initDbConnection.SummerisedFacilities.findAll({
      attributes: [
        [
          sequelize.literal(
            "ROUND(SUM(TRY_CAST(emission AS FLOAT)) / NULLIF(SUM(TRY_CAST(total_ton_miles AS FLOAT)), 0), 1)"
          ),
          "intensity",
        ],
        [sequelize.literal("SUM(TRY_CAST(emission as FLOAT))"), "emission"],
        [
          sequelize.literal("SUM(TRY_CAST(total_ton_miles AS FLOAT))"),
          "total_ton_miles",
        ],
        [sequelize.literal("SUM(TRY_CAST(shipments AS FLOAT))"), "shipments"],
      ],
      where,
      include: [
        { model: initDbConnection.Facility, attributes: ["id", "name"], as: "facility" },
      ],
      group: ["facility.name", "facility.id"],
      order: [[col_name || "intensity", order_by || "desc"]],
      raw: true,
    });
    return data
  }
  // Helper function to process facility data (calculate intensity, emissions, apply color coding)
  private processData(facilityData: any, configData: any) {
    let totalIntensity: number[] = [];
    let totalEmission: number[] = [];
    let intensityArray: number[] = [];
    let emissionArray: number[] = [];

    const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")

    // Iterate over facility data and calculate totals
    for (const property of facilityData) {
      let intensity = property.intensity;
      let emission = property.emission / convertToMillion;
      totalIntensity.push(intensity);
      totalEmission.push(emission);
    }

    const averageIntensity = calculateAverage(totalIntensity);
    const averageEmission = calculateAverage(totalEmission);

    // Apply color coding based on intensity and emission values
    for (const property of facilityData) {
      property["Facility.name"] = property["facility.name"] || null;
      property["Facility.id"] = property["facility.id"] || null;

      let intensity = property.intensity;
      let emission = property.emission / convertToMillion;

      property["intensity"] =
        intensity < averageIntensity
          ? { value: intensity, color: contributorColor }
          : { value: intensity, color: detractorColor };

      property["emission"] =
        emission <= averageEmission
          ? { value: emission, color: contributorColor }
          : { value: emission, color: detractorColor };

      intensityArray.push(intensity);
      emissionArray.push(emission);
    }

    // Sort arrays and find closest values
    intensityArray = intensityArray.sort((a, b) => a - b);
    emissionArray = emissionArray.sort((a, b) => a - b);

    updateColors(facilityData, intensityArray, averageIntensity, 'intensity', mediumColor);
    updateColors(facilityData, emissionArray, averageEmission, 'emission', mediumColor);

    return facilityData;
  }
  // Function to process facility emissions data
  private readonly processFacilityEmissions = (getFacilityEmissions: any, toggel_data: any, configData: any, res: any) => {
    let unit = 'g';
    let total = [];

    if (toggel_data == 1) {
      unit = 'tCO2e';
    }

    for (const property of getFacilityEmissions) {
      let intensity = property.intensity;
      if (toggel_data == 1) {
        intensity = property.emission / convertToMillion;
      }
      total.push(roundToDecimal(intensity));
    }

    const average = calculateAverage(total);

    const result = this.processEmissionsData(getFacilityEmissions, average, toggel_data, configData);
    const { contributor, detractor } = result;

    const data = {
      contributor: contributor,
      detractor: detractor,
      unit: unit,
      average: roundToDecimal(average)
    };

    return generateResponse(res, 200, true, 'Facility Emissions Data.', data);
  };

  private processEmissionsData(getEmissions: any, average: any, toggel_data: any, configData: any) {
    const contributor = [];
    const detractor = [];
    const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData)

    for (const property of getEmissions) {
      let difference = roundToDecimal(property.intensity - average);
      let compareValue = property.intensity;

      if (toggel_data == 1) {
        compareValue = property.emission / convertToMillion;
        difference = roundToDecimal((property.emission / convertToMillion) - average);
      }

      const facilityData = {
        name: property["facility.name"],
        value: Math.abs(difference)
      };

      if (compareValue > average) {
        contributor.push({
          ...facilityData,
          color: detractorColor
        });
      } else {
        detractor.push({
          ...facilityData,
          color: contributorColor
        });
      }
    }

    if (contributor.length > 0) {
      contributor[contributor.length - 1]['color'] = mediumColor;
    }

    if (detractor.length > 0) {
      detractor[0]['color'] = mediumColor;
    }

    return { contributor, detractor };
  }


}


export default FacilityController;
