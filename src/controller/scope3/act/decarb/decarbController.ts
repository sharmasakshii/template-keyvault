import sequelize, { Sequelize, Op } from "sequelize";
import { generateResponse } from "../../../../services/response";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { isPermissionChecked } from "../../../../services/rolePermissionCheck";
import { comapnyDbAlias, companyAllowedKeys, companyBasedKeyForDecarb, convertToMillion, decarbPriority } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { redisMasterKeyApi } from "../../../../constant/moduleConstant";
import { getHKey, setHKey } from "../../../../redisServices";
import { callStoredProcedure, getConfigConstants, roundToDecimal, whereClauseFn } from "../../../../services/commonServices";
import { getContributorDetractorGraphColor, getProblemLanesCount, getStandardDeviation, isCompanyEnable } from "../../../../utils";

const getCompanyModal = (company: any) => isCompanyEnable(company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN]) ? "BusinessUnitDivision" : "Region"
const getCompanyKey = (company: any) => companyBasedKeyForDecarb[company]
const getAlis = (company: any) => isCompanyEnable(company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN]) ? 'division' : 'region'

class DecarbController {
  private readonly connection: Sequelize;

  // Constructor to initialize the database connection for each instance
  constructor(connectionData: Sequelize) {
    this.connection = connectionData; // Assign the passed Sequelize instance to the private property
  }

  async getRegionProblemLane(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection

      let { region_id, division_id, page_size, page, order_by, col_name, carrier_shift,
        modal_shift, origin, destination, is_rd, is_ev, is_bio_1_20, is_bio_100, is_bio_21_99,
        rd_radius, bio_1_20_radius, bio_100_radius, bio_21_99_radius, ev_radius, optimus, rng, hydrogen,
        optimus_radius, rng_radius, hydrogen_radius, hvo_radius, is_hvo, b99_radius, is_b99, state_abbr, in_out_bound, is_less_than_150 = null
      } = request.body

      const masterKey = { company: authenticate.company, key: redisMasterKeyApi.getRegionProblemLane }

      const childKey = request.body

      const cachedData = await getHKey({ masterKey: masterKey, childKey: childKey });

      if (cachedData) {
        return generateResponse(res, 200, true, "Problem lane by regions.", cachedData);
      }

      const loggenInUser = authenticate['userData'];
      const CASPermission = isPermissionChecked(loggenInUser?.permissionsData, "CAS")?.isChecked;
      //Alternative
      const AMSPermission = isPermissionChecked(loggenInUser?.permissionsData, "AMS")?.isChecked;

      let page_server_size = page_size ? parseInt(page_size) : 10;
      let page_server = page ? parseInt(page) - 1 : 1;

      const sorting_column_name = col_name || 'priority';
      const sorting_order_by = order_by || 'asc';

      if (!CASPermission) {
        carrier_shift = null;
      }

      if (!AMSPermission) {
        is_ev = null;
        is_rd = null;
        is_bio_1_20 = null;
        is_bio_100 = null
      }

      let replacements: any = {
        bio_1_20_threshold_distance: bio_1_20_radius,
        bio_21_99_threshold_distance: bio_21_99_radius,
        carrier_shift: carrier_shift,
        modal_shift: modal_shift,
        bio_1_20: is_bio_1_20,
        bio_21_99: is_bio_21_99,
        PageSize: page_server_size,
        PageNumber: page,
        origin: origin || null,
        destination: destination || null,
        OrderByColumn: sorting_column_name,
        OrderByDirection: sorting_order_by
      };


      const allParams = {
        division_id,
        region_id,
        bio_100: is_bio_100,
        bio_100_threshold_distance: bio_100_radius,
        rd: is_rd,
        rd_threshold_distance: rd_radius,
        rng,
        rng_threshold_distance: rng_radius,
        hydrogen,
        hydrogen_threshold_distance: hydrogen_radius,
        hvo: is_hvo,
        hvo_threshold_distance: hvo_radius,
        optimus,
        optimus_threshold_distance: optimus_radius,
        ev: is_ev,
        ev_threshold_distance: ev_radius,
        b99: is_b99,
        b99_threshold_distance: b99_radius,
        state_abbr: state_abbr,
        is_inbound: Number(in_out_bound),
        is_less_than_150: is_less_than_150
      };

      const getCompanyParams = (company: string) => {
        const keys = companyAllowedKeys[company] || companyAllowedKeys.DEFAULT;
        return Object.fromEntries(
          Object.entries(allParams).filter(([key]) => keys.includes(key))
        );
      };

      replacements = { ...replacements, ...getCompanyParams(authenticate.company) }

      function buildStoredProcedureQuery(schema: string, params: any) {
        const paramString = Object.keys(params)
          .map(key => `@${key} = :${key}`)
          .join(", ");

        return `EXEC ${schema}.[GetProblemLanes] ${paramString}`;
      }
      const query = buildStoredProcedureQuery(authenticate.schema, replacements);
      const getProblemLanes = await callStoredProcedure(replacements, authenticate[authenticate.company], query);

      replacements['PageSize'] = null;
      replacements['PageNumber'] = null;

      const getProblemLanesCount = await callStoredProcedure(replacements, authenticate[authenticate.company], query);

      if (getProblemLanes?.length > 0) {
        const result = {
          getDecarbSummary: getProblemLanes,
          pagination: {
            page: page_server,
            page_size: page_server_size,
            total_count: getProblemLanesCount.length,
          }
        }

        await setHKey({ masterKey: masterKey, childKey: childKey, value: result, expTime: 300 })

        return generateResponse(res, 200, true, "Problem lane by regions.", result);
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }

    } catch (error) {
      console.log(error, "error");
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  /**
* @description Azure function to get decarb recommendation for regions
* @param {number} region_id 
* @param {number} year 
* @param {number} quarter
* @returns {Object} Object containing decarb recommendations
*/
  async getRecommendedLevers(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      let company = authenticate.company;
      let { region_id, in_out_bound } = request.body;  // 0 for inbound and 1 for outbound only for chep
      const where: any = {};
      where[Op.and] = [];

      const payload = [{ region_id: region_id }, { division_id: authenticate.userData?.division_id }, { in_out_bound: in_out_bound }]

      const whereClause = await whereClauseFn(payload)

      where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

      let include: any = [];

      const attri = [
        [Sequelize.literal(`ROUND(emission_intensity, 1)`), 'intensity'],
        ['emissions', 'emission'],
        'lane_count',
        'carrier_count',
        getCompanyKey(company),
        'factor',
        'operator',
        company === comapnyDbAlias.BMB && 'problem_lanes_count',
      ].filter(Boolean)

      let enableLoop: boolean = false

      if (company !== comapnyDbAlias.BMB) {
        include.push({
          model: authenticate[authenticate.company].models?.[getCompanyModal(company)],
          attributes: [],
          as: getAlis(company)
        });
        attri.push([Sequelize.col(`${getAlis(company)}.name`), 'name'])
        enableLoop = true
      }

      const getDecarbSummary: any = await authenticate[authenticate.company].models.DecarbSummery.findAll({
        attributes: attri,
        where: where,
        include: include,
        order: [["emission", "desc"]],
        raw: true
      });

      if (getDecarbSummary.length === 0) {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
      }

      const configData = await getConfigConstants(authenticate[authenticate?.company]?.models);

      let filterArray = [];
      const totalEmission = getDecarbSummary.map((i: { emission: number; }) => i.emission);

      const standardDeviationData: any = await getStandardDeviation(totalEmission, getDecarbSummary[0].factor, getDecarbSummary[0].operator);

      filterArray = await processDecarbSummary({
        decarbSummary: getDecarbSummary,
        configData,
        standardDeviationData,
        authenticate,
        company,
        enableLoop
      });
      return generateResponse(res, 200, true, "Decarb recommendation for regions.", filterArray);

    } catch (error) {
      console.error('error', error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  /**
 * Azure function to get decarb recommendation for regions
 * @param {number} region_id 
 * @param {number} year 
 * @param {number} quarter
 * @returns {Object} Object containing decarb recommendations
 */
  async searchOriginDestProblemLanes(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      // Authenticate the request using JWT middleware
      let authenticate: any = this.connection;
      // Read the request body
      let { region_id, carrier_shift, modal_shift, source,
        dest, type, keyword, ev_radius, rd_radius, bio_1_20_radius, bio_100_radius, bio_21_99_radius,
        is_ev, is_rd, is_bio_1_20, is_bio_100, is_bio_21_99,
        optimus, rng, hydrogen, is_hvo, hvo_radius, is_b99,
        optimus_radius, rng_radius, hydrogen_radius, b99_radius, division_id, state_abbr = "CA", in_out_bound = 0, is_less_than_150 = null } = request.body;

      let replacements: any = {
        bio_1_20_threshold_distance: bio_1_20_radius,
        bio_21_99_threshold_distance: bio_21_99_radius,
        carrier_shift: carrier_shift,
        modal_shift: modal_shift,
        bio_1_20: is_bio_1_20,
        bio_21_99: is_bio_21_99,
        PageSize: null,
        PageNumber: null,
        dest: dest || null,
        type: type,
        source: source || null,
        keyword: keyword || null
      };

      const allParams = {
        division_id,
        region_id,
        bio_100: is_bio_100,
        bio_100_threshold_distance: bio_100_radius,
        rd: is_rd,
        rd_threshold_distance: rd_radius,
        rng,
        rng_threshold_distance: rng_radius,
        hydrogen,
        hydrogen_threshold_distance: hydrogen_radius,
        hvo: is_hvo,
        hvo_threshold_distance: hvo_radius,
        optimus,
        optimus_threshold_distance: optimus_radius,
        ev: is_ev,
        ev_threshold_distance: ev_radius,
        b99: is_b99,
        b99_threshold_distance: b99_radius,
        state_abbr: state_abbr,
        is_inbound: Number(in_out_bound),
        is_less_than_150: is_less_than_150
      };

      const getCompanyParams = (company: string) => {
        const keys = companyAllowedKeys[company] || companyAllowedKeys.DEFAULT;
        return Object.fromEntries(
          Object.entries(allParams).filter(([key]) => keys.includes(key))
        );
      };

      replacements = { ...replacements, ...getCompanyParams(authenticate.company) }

      function buildStoredProcedureQuery(schema: string, params: any) {
        const paramString = Object.keys(params)
          .map(key => `@${key} = :${key}`)
          .join(", ");

        return `EXEC ${schema}.[getProblemLaneNameSearch] ${paramString}`;
      }

      const query = buildStoredProcedureQuery(authenticate.schema, replacements);


      const getProblemLanes = await authenticate[
        authenticate.company
      ].query(
        query,
        {
          replacements: replacements,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return generateResponse(res, 200, true, "Problem lane by regions origin destinations.", getProblemLanes);
    } catch (error) {
      // Log any errors that occur
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }
}

async function processDecarbSummary({
  decarbSummary,
  configData,
  standardDeviationData,
  authenticate,
  company,
  enableLoop
}: {
  decarbSummary: any[];
  configData: any;
  standardDeviationData: any;
  authenticate: any;
  company: string;
  enableLoop: boolean;
}) {
  const result: any[] = [];

  for (const property of decarbSummary) {
    const { contributorColor, detractorColor, mediumColor } =
      getContributorDetractorGraphColor(configData, "graph");

    let problemLanesCount = 0;

    if (property[getCompanyKey(company)] && enableLoop) {
      problemLanesCount = await getProblemLanesCount(
        property[getCompanyKey(company)] || null,
        authenticate[authenticate.company],
        authenticate.schema,
        company
      );
    }

    const keyToFetchLane = enableLoop
      ? problemLanesCount
      : property?.problem_lanes_count;

    property.problem_lanes = keyToFetchLane;

    if (keyToFetchLane > 0) {
      if (property.emission > standardDeviationData.to) {
        property.type = decarbPriority.high;
        property.priority = 1;
        property.color = detractorColor;
      } else if (
        property.emission >= standardDeviationData.from &&
        property.emission <= standardDeviationData.to
      ) {
        property.type = decarbPriority.med;
        property.priority = 2;
        property.color = mediumColor;
      } else {
        property.type = decarbPriority.low;
        property.priority = 3;
        property.color = contributorColor;
      }
      property.emission = roundToDecimal(
        property.emission / convertToMillion
      );

      result.push(property);
    }
  }

  return result;
}

export default DecarbController