import { Sequelize, Op } from "sequelize";
import { Response } from "express";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { decryptDataFunction } from "../../../services/encryptResponseFunction";
import { generateResponse } from "../../../services/response";
import { callStoredProcedure, decryptByPassPhraseColumn, emailVerification, encryptByPassPhrase, encryptPassword, getRolePermissions, paginate, updateUserTokenOnRoleUpdate, validatePassword, validator } from "../../../services/commonServices";
import HttpStatusMessage from "../../../constant/responseConstant";
import { updateUserPassword } from "../../../services/passwordLogic";
import moment from "moment";
import { comapnyDbAlias } from "../../../constant";
import { isCompanyEnable } from "../../../utils";
import { logoutStatus } from "../../../constant/moduleConstant";

class AdmiUserController {
    private readonly connection: Sequelize;
    attrGetUserDetail: any[];
    constructor(connectionData: Sequelize) {
        this.connection = connectionData;

        this.attrGetUserDetail = [
            [Sequelize.literal('user_id'), 'id'],
            [Sequelize.literal('user_name'), 'name'],
            [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'user_email'), 'email'],
            [Sequelize.literal('user_createdAt'), 'createdAt'],
            [Sequelize.literal('user_updatedAt'), 'updatedAt'],
            [Sequelize.literal('user_role'), 'role'],
            [Sequelize.literal('user_region_id'), 'region_id'],
            [Sequelize.literal('user_status'), 'status'],
            [Sequelize.literal('p_first_name'), 'first_name'],
            [Sequelize.literal('p_last_name'), 'last_name'],
            [Sequelize.literal('p_country_code'), 'country_code'],
            [Sequelize.literal('p_image'), 'image'],
            [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'p_phone_number'), 'phone_number'],
            "c_name", "c_db_alias", "c_logo", "c_slug", [Sequelize.literal('user_last_logged_in'), 'last_logged_in']
        ];
    }


    async addUser(request: MyUserRequest, response: Response): Promise<Response> {
        const authenticate: any = this.connection

        try {
            const { firstName, lastName, phone, email, roleId, regionId, password, divisionId } = request.body
            const decryptPassword = decryptDataFunction(password);
            let validation = await validator(
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    region_id: regionId,
                    roleId: roleId,
                    phone: phone,
                    division_id: divisionId
                },
                {
                    first_name: "required|string|max:20",
                    last_name: "required|string|max:20",
                    region_id: "nullable|integer",
                    email: "required|string|email",
                    roleId: "integer",
                    phone: "nullable|max:15",
                    division_id: "nullable|integer",
                }
            )
            if (validation.status) {
                return generateResponse(response, 400, false, "Validation Errors!");
            }
            let companyDto = await authenticate.main.models.Company.findOne({
                where: {
                    slug: authenticate.userData['companies'][0].slug
                },
            });
            const userDetail = await authenticate.main.models.User.findOne({
                atrributes: ['id'],
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'),
                            email
                        ),
                        { is_deleted: 0 }
                    ]
                },
            });

            if (!validatePassword(decryptPassword)) {
                return generateResponse(response, 400, false, "Invalid password format");
            }
            if (userDetail) {
                return generateResponse(response, 400, false, "User already exists with this email address");
            }

            let generateHash = await encryptPassword(decryptPassword);

            let userDetailPayload: any = {
                name: firstName + " " + lastName,
                email: encryptByPassPhrase(process.env.EMAIL_PHONE_PASSPHRASE, email),
                role: Number.parseInt(roleId.toString()),
                password: generateHash,
                status: 0,
                login_count: 0,
                updated_by: authenticate.userData.id,
                division_id: 0
            }

            if (regionId) {
                userDetailPayload["region_id"] = regionId;
            }

            if (divisionId) {
                userDetailPayload["division_id"] = divisionId;
            }

            const user = await authenticate.main.models.User.create(userDetailPayload);

            if (!user) {
                return generateResponse(response, 400, false, "User creation failed");
            }
            const userId = user.id;

            await Promise.all([
                authenticate.main.models.Profile.create({
                    user_id: userId,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: encryptByPassPhrase(process.env.EMAIL_PHONE_PASSPHRASE, phone),
                }),

                authenticate.main.models.UserCompany.create({
                    user_id: userId,
                    company_id: companyDto.dataValues?.id,
                }),

                authenticate.main.models.UserPasswordLog.create({
                    user_id: userId,
                    old_password: generateHash,
                })
            ]);

            return generateResponse(
                response,
                200,
                true,
                `User created successfully`,
                user
            );

        } catch (error) {
            console.log(error, " error ");
            return generateResponse(response, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUser(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        const authenticate: any = this.connection
        try {
            let {
                user_id,
                first_name,
                last_name,
                email,
                password,
                regionId = "",
                phone_number,
                role_id,
                divisionId = ""
            } = request.body

            let validation = await validator(
                {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    region_id: regionId,
                    roleId: role_id,
                    phone: phone_number,
                    division_id: divisionId
                },
                {
                    first_name: "required|string|max:20",
                    last_name: "required|string|max:20",
                    region_id: "integer|nullable",
                    email: "required|string|email",
                    roleId: "integer",
                    phone: "nullable|max:15",
                    division_id: "integer|nullable"
                }
            )
            if (validation.status) {
                return generateResponse(res, 400, false, "Validation Errors!");
            }
            let getUser = await this.validateUserAsPerCompany({ authenticate, user_id })

            if (getUser?.length == 0) {
                return generateResponse(res, 404, false, "No User Found!");
            }

            const emailCheck = await emailVerification(authenticate.main, email, user_id)

            if (!emailCheck) {
                return generateResponse(res, 400, false, "Email already exists!");
            }

            const updates: any = {
                isEmailUpdate: getUser[0].dataValues.email !== email,
                isPhoneUpdate: getUser[0]?.dataValues?.profile?.dataValues?.phone_number !== phone_number,
            };
            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP])) {
                updates["isDivisionUpdate"] = getUser[0].dataValues.division_id != divisionId;
            } else {
                updates["isRegionUpdate"] = getUser[0].dataValues.region_id != regionId;
            }

            const { isRegionUpdate, isEmailUpdate, isDivisionUpdate, isPhoneUpdate } = updates

            const payload = {
                res: res, getUser: getUser[0], phone_number, isPhoneUpdate, region_id: regionId, division_id: divisionId,
                role_id: role_id, authenticate: authenticate, first_name: first_name,
                last_name: last_name, email: isEmailUpdate && email, user_id: user_id, password: password, isRegionUpdate: isRegionUpdate, isDivisionUpdate
            }
            return this.updateUserAdditionalFunction(payload)
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {

        try {
            const { user_id } = request.body;
            const authenticate: any = this.connection

            const validUsers = await authenticate.main.models.UserCompany.findAll({
                attributes: ['user_id'],
                where: {
                    user_id: { [Op.in]: user_id },
                    company_id: authenticate.userData['companies'][0]?.UserCompany?.company_id
                }
            });

            if (validUsers?.length !== user_id?.length) {
                return generateResponse(
                    res,
                    403,
                    false,
                    "One or more users do not belong to your company"
                );
            }

            await authenticate.main.models.User.update(
                { is_deleted: 1 },
                {
                    where: {
                        id: {
                            [Op.in]: user_id,
                        },
                    },
                }
            );
            const payloadData = {
                main: authenticate["main"],
                userId: user_id,
                status: 2
            }
            await updateUserTokenOnRoleUpdate(payloadData)
            return generateResponse(res, 200, true, `User deleted successfully`);
        } catch (error) {
            console.log(error, " error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserListing(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {

        try {
            let {
                page_size = 10,
                page,
                searchText,
                order_by,
                col_name,
                role_id,
                start_date,
                end_date,
                email,
                status,
                name,
            } = request.body;

            const authenticate: any = this.connection;

            let page_server = page ? parseInt(page) - 1 : 0;
            let searchValue = name || searchText;

            const payload = {
                searchValue: searchValue,
                role_id: role_id,
                status: status,
                email: email
            }
            const userFilter = this.getUserListingFilter(payload)

            const dateFilter = (start_date || end_date) && Sequelize.literal(`CONVERT(date,[GetUserDetails].[user_createdAt]) BETWEEN CONVERT(date,'${start_date}') AND CONVERT(date,'${end_date || moment(new Date()).format('YYYY-MM-DD')}')`)

            const where = {
                [Op.and]: [
                    { user_id: { [Op.not]: authenticate.userData.id } },
                    { user_is_deleted: 0 },
                    userFilter?.is_filter && userFilter?.filterData ? [...userFilter.filterData] : [],
                    dateFilter
                ],
            }

            let coldata = [col_name || "id", order_by || "desc"]
            if (col_name == "role") {
                let data = "userDetailsRole.name"
                let check = data.split(".")
                coldata = [check[0], check[1], order_by || "desc"]
            }

            const userList = await authenticate[authenticate.company].models.GetUserDetails.findAndCountAll(
                paginate(
                    {
                        attributes: this.attrGetUserDetail,
                        order: [coldata],
                        where: where,
                        include: [{
                            model: authenticate[authenticate.company].models.Roles,
                            as: "userDetailsRole",
                            attributes: ["name"],
                            where: { is_deleted: 0 }
                        }],
                    },
                    {
                        page: page_server,
                        pageSize: page_size,
                    }
                )
            );
            const { rows, count } = userList
            if (rows?.length > 0) {
                const responseData = {
                    list: rows,
                    pagination: {
                        page: page_server,
                        page_size: page_size,
                        total_count: count
                    },
                };
                return generateResponse(res, 200, true, `User listed`, responseData);
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);

        } catch (error) {
            console.log(error, " error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserDetailById(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const { user_id } = request.body;
            const authenticate: any = this.connection;
            let attr = [...this.attrGetUserDetail];
            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP])) {
                attr.push([Sequelize.literal('user_division_id'), 'division_id'])
            }
            const userDetail = await authenticate[authenticate.company].models.GetUserDetails.findOne(
                {
                    attributes: attr,
                    where: {
                        'user_id': user_id,
                    },
                    include: [{
                        model: authenticate[authenticate.company].models.Roles,
                        as: "userDetailsRole",
                        attributes: ["name"],
                        where: { is_deleted: 0 }
                    }],
                }
            );
            if (userDetail) {
                let permisionData = await getRolePermissions(authenticate[authenticate.company].models, userDetail.dataValues.role)

                return generateResponse(res, 200, true, `User detail`, {
                    userDetail: userDetail,
                    userPermission: permisionData,
                });

            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, " error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserActivityDetail(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {

        try {
            const authenticate: any = this.connection

            let { user_id, page_size = 10, page_number = 0 } = request.body;

            const replacements = {
                updated_by: user_id,
                user_id: user_id,
                page_size: page_size,
                page_number: page_number,
            };
            const checkUser = await this.validateUserAsPerCompany({ authenticate, user_id })
            if (checkUser?.length == 0) {
                return generateResponse(res, 404, false, "No User Found!");
            }
            
            const query = `EXEC ${authenticate?.schema}.useractivitylog @updated_by = :updated_by, @user_id = :user_id, @page_size = :page_size, @page_number = :page_number`;

            const totalActivityReplacement = {
                updated_by: user_id,
                user_id: user_id,
            };

            const activityTotalquery = `EXEC ${authenticate?.schema}.useractivitylog @updated_by = :updated_by, @user_id = :user_id`;

            const [activityData, activityDataTotal] = await Promise.all([
                callStoredProcedure(replacements, authenticate[authenticate?.company], query),
                callStoredProcedure(totalActivityReplacement, authenticate[authenticate?.company], activityTotalquery),
            ]);

            if (activityData?.length > 0) {
                const activityDataRes = {
                    activityData: activityData,
                    pagination: {
                        page: page_number,
                        page_size: page_size,
                        total_count: activityDataTotal?.length
                    }
                }
                return generateResponse(res, 200, true, "Audit user activity", activityDataRes)
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async userStatusUpdate(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {

        try {

            const { user_id, status } = request.body

            const authenticate: any = this.connection

            const checkUser = await this.validateUserAsPerCompany({ authenticate, user_id })
            if (checkUser?.length == 0) {
                return generateResponse(res, 404, false, "No User Found!");
            }

            let userDto = await authenticate.main.models.User.update(
                {
                    status: status,
                    updated_by: authenticate?.userData?.id
                },
                {
                    where: {
                        id: {
                            [Op.in]: user_id,
                        },
                    },
                }
            );
            if (userDto) {
                if (status === 2) {
                    const payloadData = {
                        main: authenticate["main"],
                        userId: user_id,
                        status: 1
                    }
                    updateUserTokenOnRoleUpdate(payloadData)
                }
                return generateResponse(res, 200, true, `User updated successfully`);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, " error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserFileListDetail(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const { user_id } = request.body;
            const authenticate: any = this.connection

            const userDetail = await authenticate[authenticate?.company].models.FileManagement.findAll({
                attributes: ["name", "id", "created_on", "base_path"],
                where: {
                    [Op.and]: [
                        { user_id: user_id },
                        { status_id: { [Op.not]: 4 } },
                        { type: "file" },
                        { is_deleted: 0 },
                    ],
                },
            });
            if (userDetail.length > 0) {
                return generateResponse(res, 200, true, `User detail`, userDetail);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.log(error, " error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllRoles(_request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const authenticate: any = this.connection
            let getAllRotes = await authenticate[authenticate.company].models.Roles.findAll({
                where: { is_deleted: 0 }
            });
            if (getAllRotes.length > 0) {
                return generateResponse(res, 200, true, "List of roles.", getAllRotes);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async getUserLoginActivity(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const authenticate: any = this.connection
            const { user_id } = request.query

            if (!user_id) {
                return generateResponse(res, 400, false, 'Missing user_id parameter');
            }

            const checkUser = await this.validateUserAsPerCompany({ authenticate, user_id })
            if (checkUser?.length == 0) {
                return generateResponse(res, 404, false, "No User Found!");
            }

            const currentDate = new Date();
            const startDate7DaysAgo = new Date();
            startDate7DaysAgo.setDate(currentDate.getDate() - 7);

            const startDate30DaysAgo = new Date();
            startDate30DaysAgo.setDate(currentDate.getDate() - 30);

            const [lastLogin, weeklyLoginCount, monthlyLoginCount] = await Promise.all([
                authenticate["main"].models.UserActivity.findOne({
                    where: { user_id },
                    order: [["login_at", "DESC"]],
                }),
                authenticate["main"].models.UserActivity.count({
                    where: {
                        user_id,
                        login_at: { [Op.between]: [startDate7DaysAgo, currentDate] },
                    },
                }),
                authenticate["main"].models.UserActivity.count({
                    where: {
                        user_id,
                        login_at: { [Op.between]: [startDate30DaysAgo, currentDate] },
                    },
                }),
            ]);

            const response = {
                lastLogin: lastLogin ? lastLogin.dataValues.login_at : null,
                weeklyLoginCount: {
                    count: weeklyLoginCount,
                    startDate: startDate7DaysAgo,
                    endDate: currentDate
                },
                monthlyLoginCount: {
                    count: monthlyLoginCount,
                    startDate: startDate30DaysAgo,
                    endDate: currentDate
                }
            };

            return generateResponse(res, 200, true, 'User login activity retrieved successfully', response);

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private readonly updateUserAdditionalFunction = async (prop: any) => {
        try {
            const { res, getUser, phone_number, isPhoneUpdate, region_id, division_id, role_id, authenticate, first_name, last_name, email, user_id, password, isRegionUpdate, isDivisionUpdate } = prop

            if (getUser.dataValues.role !== role_id) {
                const payloadData = {
                    main: authenticate["main"],
                    userId: [user_id],
                    status: 4
                }
                await updateUserTokenOnRoleUpdate(payloadData)
            }
            else if (isDivisionUpdate || isRegionUpdate) {
                let status = isDivisionUpdate ? logoutStatus.DIV_UPD : logoutStatus.REG_UPD

                const payloadData = {
                    main: authenticate["main"],
                    userId: [user_id],
                    status: status
                }
                await updateUserTokenOnRoleUpdate(payloadData)
            }

            let encryptedProfileData: any = {
                first_name: first_name,
                last_name: last_name,
                updated_by: authenticate["userData"]?.id,
            };

            if (isPhoneUpdate) {
                encryptedProfileData["phone_number"] = encryptByPassPhrase(process.env.EMAIL_PHONE_PASSPHRASE, phone_number);
            }

            let userEncryptedData: any = {
                name: `${first_name} ${last_name}`,
                role: role_id,
                updated_by: authenticate.userData?.id,
                ...(email && { email: encryptByPassPhrase(process.env.EMAIL_PHONE_PASSPHRASE, email) }),
                ...(isRegionUpdate && { region_id }),
                ...(isDivisionUpdate && { division_id }),
            };

            const payload = { res: res, password: password, getUser: getUser, user_id: user_id, authenticate: authenticate, userEncryptedData: userEncryptedData, encryptedProfileData: encryptedProfileData }
            return this.updateUserPwdAndProfile(payload)
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

    private readonly updateUserPwdAndProfile = async (prop: any) => {
        try {
            const { res, password, getUser, user_id, authenticate, userEncryptedData, encryptedProfileData } = prop
            if (password) {
                let message = "User profile updated successfully.";
                const payload = {
                    res: res,
                    old_password: getUser.dataValues.password, new_password: password, user_id: user_id, req: authenticate.main, type: "", encryptedProfileData: encryptedProfileData, userEncryptedData: userEncryptedData, message: message, company: authenticate.company, getUser: getUser
                }
                return await updateUserPassword(payload);
            }
            else {
                await authenticate.main.models.User.update(userEncryptedData, {
                    where: { id: user_id }
                });

                const profile = await authenticate.main.models.Profile.findOne({
                    where: { user_id: user_id },

                });

                await profile.update(encryptedProfileData);

                return generateResponse(res, 200, true, "User Profile Updated.");
            }

        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

    private readonly getUserListingFilter = (prop: any) => {
        const { searchValue, role_id, email, status } = prop
        const filterData = [
            searchValue && {
                user_name: { [Op.like]: "%" + searchValue + "%" },
            },
            role_id && { user_role: role_id },
            (status == 0 || status) && { "user_status": status },
            email && Sequelize.where(
                decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, "user_email"),
                { [Op.like]: `%${email}%` }
            ),
        ].filter(Boolean)
        let is_filter: boolean = false
        filterData.some(obj => {
            if (obj && Object.keys(obj)?.length) {
                is_filter = true
            }
        });
        return {
            is_filter: is_filter,
            filterData: filterData
        }
    }

    private readonly validateUserAsPerCompany = async (prop: any) => {
        try {
            const { authenticate, user_id } = prop

            return await authenticate.main.models.User.findAll({
                attributes: ['id', 'role', 'password', [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'), "email"], 'region_id', 'division_id'],
                where: { [Op.and]: [{ id: user_id }, { is_deleted: 0 }] },
                include: [
                    {
                        model: authenticate.main.models.Profile,
                        attributes: [
                            "first_name",
                            "last_name",
                            "country_code",
                            [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'phone_number'), "phone_number"],
                        ],
                        as: "profile"
                    },
                    {
                        model: authenticate.main.models.UserCompany,
                        as: 'userCompany',
                        attributes: ['company_id'],
                        where: {
                            company_id: authenticate.userData['companies'][0]?.UserCompany?.company_id
                        },
                        required: true
                    }
                ],
            });
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

}

export default AdmiUserController