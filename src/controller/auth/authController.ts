import sequelize, { Op, Sequelize } from "sequelize";
import setupSequelize from "../../connectionDb/sequilizeSetup";
import HttpStatusMessage from "../../constant/responseConstant";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { decryptByPassPhraseColumn, generateUniqueAlphanumeric, getRolePermissions, otpAttempts } from "../../services/commonServices";
import { decryptDataFunction } from "../../services/encryptResponseFunction";
import { generateResponse } from "../../services/response";
import { valueConstant } from "../../constant/moduleConstant";
import moment from "moment";
import bcrypt = require("bcrypt");
import { azureSmsFunction } from "../../services/azureSms";
const crypto = require("crypto");
import { generateToken } from "../../utils";
import jwt, { SignOptions } from "jsonwebtoken";


class AuthController {

    async login(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            let { email = "", password = "" } = req.body;

            if (!email || !password) {
                return generateResponse(res,
                    400,
                    false,
                    "Email and Password both are required"
                );
            }

            const sequelizeInstances: any = await setupSequelize("main");

            password = decryptDataFunction(password);

            const attributes: any = [
                'id',
                'name',
                [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'), 'email'],
                'password',
                'role',
                'status',
                'login_count',
                'region_id',
                'is_blocked',
                'blocked_time',
                'blocked_on',
                'is_deleted',
                'updated_by',
                'last_logged_in',
                'chatbot_access',
                'createdAt',
                'updatedAt',
                'division_id'
            ];

            let user: any = await sequelizeInstances.models.User.findOne({
                attributes: attributes,
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'),
                            email
                        ),
                        { role: { [Op.notIn]: [valueConstant.BLOB_ROLE] } },
                        { is_deleted: 0 }
                    ]
                },
                include: [
                    {
                        model: sequelizeInstances.models.Profile,
                        attributes: [
                            "first_name",
                            "last_name",
                            "country_code",
                            "image",
                            [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'phone_number'), "phone_number"],

                        ],
                        as: "profile"
                    },
                    {
                        model: sequelizeInstances.models.Company,
                        attributes: ["name", "db_alias", "logo", "slug", "is_onboarded"],
                        as: "companies"
                    },
                ],
            });
            if (!user) {
                return generateResponse(res, 404, false, "User not found");
            }

            if (user.is_blocked) {
                let currentUtc = moment.utc();
                let blocked_time = moment
                    .utc(user.blocked_on)
                    .add(user.blocked_time, "minutes")
                    .unix();

                let current = moment.utc().unix();

                let blockedTime = moment.utc(user.blocked_on);

                blockedTime.add(user.blocked_time, "minutes");

                let minutesDifference = blockedTime.diff(currentUtc, "minutes");

                let unblock_time = this.GetTime(minutesDifference);

                if (current < blocked_time) {
                    return generateResponse(res,
                        400,
                        false,
                        `Your account is blocked for next ${unblock_time} `
                    );
                }
            }
            if (user.status == 2) {
                return generateResponse(res,
                    400,
                    false,
                    `Your account has been deactivated, please contact administrator for assistance`
                );
            }
            if (user.is_deleted) {
                return generateResponse(res,
                    400,
                    false,
                    `Your account has been deleted, please contact administrator for assistance`
                );
            }

            let company = user['dataValues']['companies'][0].db_alias;

            const sequelizeInstancesCompany = await setupSequelize(company);
            const origin = req.get('origin');

            const payload = {
                origin: origin,
                res: res,
                user: user,
                sequelizeInstances: sequelizeInstances,
                password: password,
                sequelizeInstancesCompany: sequelizeInstancesCompany,
                is_otp: !!user.profile.phone_number
            }
            return this.userUpdate(payload)

        } catch (error) {
            console.log(error, "errr");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }

    }

    async logout(req: MyUserRequest, res: any): Promise<Response> {
        try {
            const token = req?.cookies?.token
            if (!token) {
                return generateResponse(res, 400, false, 'Token not provided');
            }

            const setupSequlizeInstance: any = await setupSequelize("main");

            await setupSequlizeInstance.models.UserToken.destroy({
                where: {
                    ut_id: token
                }
            });
            await res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });

            return generateResponse(res, 200, true, "User Logout Successfully.");
        } catch (error: any) {
            console.log(error);
            // Handle errors and return a response
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR, error);
        }
    };

    async resendOtp(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            let { email = "" } = req.body;

            if (!email) {
                return generateResponse(res, 400, false, "Email is required.")
            }

            const sequelizeInstances: any = await setupSequelize('main');

            let user: any = await sequelizeInstances.models.User.findOne({
                where: {
                    [Op.and]: [
                        sequelize.where(
                            decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'),
                            email
                        ),
                        { role: { [Op.notIn]: [valueConstant?.BLOB_ROLE] } },
                        { is_deleted: 0 }
                    ]
                },
                include: [
                    {
                        model: sequelizeInstances.models.Profile,
                        attributes: [
                            "first_name",
                            "last_name",
                            "country_code",
                            "image",
                            [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'phone_number'), "phone_number"],
                        ],
                        as: "profile"
                    },
                    {
                        model: sequelizeInstances.models.Company,
                        attributes: ["name", "db_alias", "logo"],
                        as: "companies"
                    },
                ],
            });

            if (!user?.profile?.phone_number) {
                return generateResponse(res, 400, false, "User does not have a registered phone number.");
            }
            let code = crypto.randomInt(100000, 1000000);

            const recentAttempts = await sequelizeInstances.models.UserOtp.findOne({
                attributes: [
                    'id', 'user_id', 'otp', 'status', 'attempts', 'createdAt', 'updatedAt',
                    [sequelizeInstances.Sequelize.literal(`DATEADD(MINUTE, -30, CURRENT_TIMESTAMP)`), 'thirtyMinutesAgo'],
                ],
                where: { user_id: user.id },
            });

            const thirtyMinutesAgo: any = recentAttempts?.dataValues?.thirtyMinutesAgo
                ? moment(recentAttempts.dataValues.thirtyMinutesAgo).utc()
                : null;

            const attempts = recentAttempts?.dataValues?.attempts || 0;
            const isWithin30Minutes = recentAttempts?.dataValues?.updatedAt >= thirtyMinutesAgo;
            const isMaxAttemptsExceeded = attempts + 1 > 5;
            if (isMaxAttemptsExceeded && isWithin30Minutes) {
                return generateResponse(res, 400, false, 'Exceeded maximum attempts in the last 30 minutes.');
            }

            const updateValues = {
                user_id: user.id,
                otp: code,
                status: 0,
                attempts: isMaxAttemptsExceeded && !isWithin30Minutes ? 1 : attempts + 1,
            };

            let whereCondition = {
                user_id: user.id,
            };

            this.createOrUpdateUser(updateValues, whereCondition, sequelizeInstances);

            let messageData = {
                message: 'Your verification code is :' + code,
                phone_number: [`${user.profile.country_code}${user.profile.phone_number}`]
            }
            let sendMessage = await azureSmsFunction(messageData)

            if (sendMessage) {
                const result = {
                    otp: true,
                    email: user.email,
                    phone_number: user.profile.phone_number
                };
                return generateResponse(res, 200, true, "Verification code send to registered phone number.", result);
            }
            return generateResponse(res, 400, false, "Error while sending verification code to registered phone number.");
        } catch (error) {
            console.log(error);
            // Handle errors and return a response
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private readonly GetTime = (minutesDifference: any) => {
        let unblock_time;
        if (minutesDifference > 60) {
            let hours = Math.floor(minutesDifference / 60);
            let remainingMinutes = minutesDifference % 60;

            let hoursString = hours > 1 ? "hours" : "hour";
            let minutesString = remainingMinutes > 1 ? "minutes" : "minute";
            unblock_time = `${hours} ${hoursString} and ${remainingMinutes} ${minutesString}`;
        } else {
            let minutesString = minutesDifference > 1 ? "minutes" : "minute";
            unblock_time = `${minutesDifference} ${minutesString}`;
        }
        return unblock_time;
    };

    private readonly userUpdate = async (prop: any) => {
        try {
            const { password, user, sequelizeInstances, sequelizeInstancesCompany, res, is_otp, origin } = prop

            const passwordMatch = await bcrypt.compare(password, user.password);
            let key = 'valid_credential'
            if (!passwordMatch) {
                key = 'invalid_credential'
            }
            try {
                await this.bruteForceCheck(
                    sequelizeInstances,
                    user,
                    key,
                    res
                );
            }
            catch (err: any) {
                console.log(err, "err")
                return generateResponse(res, 400, false, err.message);
            }
            if (is_otp) {
                const payload = {
                    user: user,
                    sequelizeInstances: sequelizeInstances,
                    res: res
                }
                return await this.withOtpFn(payload)
            }
            const payloadWithoutOtp = {
                origin: origin,
                user: user,
                sequelizeInstances: sequelizeInstances,
                res: res,
                sequelizeInstancesCompany: sequelizeInstancesCompany
            }
            return await this.withoutOtpFn(payloadWithoutOtp)

        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

    private async withOtpFn(prop: any) {
        try {
            const { user, sequelizeInstances, res } = prop
            let whereCondition = {
                user_id: user.id,
            };

            let code = crypto.randomInt(100000, 1000000);

            let updateValues: any = await otpAttempts(sequelizeInstances, user?.id, code);

            if (!updateValues.isRequest) {
                return generateResponse(res, updateValues.statusCode, false, updateValues.message);
            }

            await this.createOrUpdateUser(updateValues, whereCondition, sequelizeInstances);
            let messageData = {
                message: "Your verification code is :" + code,
                phone_number: [
                    `${user.profile.country_code}${user.profile.phone_number}`,
                ],
            };

            let sendMessage = await azureSmsFunction(messageData);

            if (!sendMessage) {
                return generateResponse(
                    res,
                    400,
                    false,
                    "Error while sending verification code to registered phone number."
                );
            }

            const data = {
                otp: true,
                email: user.email,
                chatbot_access: user.chatbot_access,
                role: user.role,
                login_count: user.login_count,
                phone_number: user.profile.phone_number,
                region_id: user.region_id,
                Company: user.companies[0]
            };

            return generateResponse(
                res,
                200,
                true,
                "Verification code send to registered phone number.",
                data
            );
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

    private async withoutOtpFn(prop: any) {
        try {
            const { user, sequelizeInstances, res, sequelizeInstancesCompany, origin } = prop
            let update_user_status = user?.status === 0 ? 1 : ""

            await sequelizeInstances.models.User.update({
                login_count: user.login_count + 1,
                last_logged_in: new Date(),
                [update_user_status && "status"]: update_user_status,
                [update_user_status && "updated_by"]: user.id
            }, { where: { id: user.id } });

            let permissionsData = await getRolePermissions(sequelizeInstancesCompany["models"], user.role);
            let payload = {
                data: {
                    ...user.dataValues,
                    permissionsData: permissionsData,
                },
            };
            const secretKey: string = process.env.JWT_TOKEN ?? "";

            const expireTime: any = process.env.JWT_EXPIRE_TIME ?? undefined;

            const options: SignOptions = {
                expiresIn: expireTime
            };

            if (!secretKey) {
                throw new Error("JWT secret key is missing.");
            }

            let token = jwt.sign(payload, secretKey, options);

            let tokenUniqueId = generateUniqueAlphanumeric(20)

            await sequelizeInstances.models.UserToken.create({
                user_id: user.id,
                token: token,
                status: 1,
                ut_id: tokenUniqueId,
                is_logout: 0,
                logout_reason: 0
            });

            const data = {
                id: user.id,
                email: user.email,
                chatbot_access: user.chatbot_access,
                token: tokenUniqueId,
                name: user.name,
                role: user.role,
                login_count: user.login_count + 1,
                profile: { ...user.profile.dataValues },
                region_id: user.region_id,
                division_id: user.division_id,
                Company: { ...user.companies[0].dataValues },
                permissionsData: permissionsData
            };

            await sequelizeInstances.models.UserActivity.create({
                user_id: user.id
            });

            const days = parseInt(process.env.COOKIE_MAX_AGE_DAYS ?? '1', 10);

            const maxAgeMs = days * 24 * 60 * 60 * 1000;


            const isCrossSite = origin?.includes(process.env.ALLOW_ORIGIN);


            await res.cookie('token', tokenUniqueId, {
                httpOnly: true,
                secure: true,
                sameSite: isCrossSite ? 'none' : 'strict',
                maxAge: maxAgeMs,
            });

            return generateResponse(res,
                200,
                true,
                "User Logged In Successfully.",
                data
            );
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

    private readonly createOrUpdateUser = async (
        values: { [x: string]: any },
        condition: { user_id: any },
        sequelizeInstances: any
    ) => {
        try {
            await sequelizeInstances.models.UserOtp.findOne({ where: condition }).then(
                function (obj: { update: (arg0: { [x: string]: any }) => any }) {
                    if (obj) return obj.update(values);
                    return sequelizeInstances.models.UserOtp.create(values);
                }
            );
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    };

    private readonly bruteForceCheck = async (request: any, user: any, type: any, res: any) => {
        try {
            const currentUTCTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");

            const thirtyMinutesAgo = moment
                .utc()
                .subtract(30, "minutes")
                .format("YYYY-MM-DD HH:mm:ss");
            if (type == "valid_credential") {
                if (user.is_blocked) {
                    await request.models.User.update(
                        { blocked_time: null, blocked_on: null, is_blocked: 0 },
                        { where: { id: user?.id } }
                    );
                    await request.models.FailedLoginAttempt.destroy({ where: { UserID: user.id } })
                }
            }

            if (type == "invalid_credential") {
                const result = await request.models.FailedLoginAttempt.count({
                    where: {
                        [Op.and]: [
                            { UserID: user?.id },
                            {
                                Last_Failure_Time: {
                                    [Op.gte]: Sequelize.literal(
                                        `TRY_CAST('${thirtyMinutesAgo}' AS DATETIMEOFFSET)`
                                    ),
                                    [Op.lte]: Sequelize.literal(
                                        `TRY_CAST('${currentUTCTime}' AS DATETIMEOFFSET)`
                                    ),
                                },
                            },
                        ],
                    },
                });
                await request.models.FailedLoginAttempt.create({
                    UserID: user.id,
                });
                if (user.is_blocked) {
                    let increaseTime = user.blocked_time + 15;
                    let unblock_time = this.GetTime(increaseTime);
                    await request.models.User.update(
                        {
                            blocked_time: increaseTime,
                            blocked_on: Sequelize.literal("CURRENT_TIMESTAMP"),
                        },
                        { where: { id: user?.id } }
                    );
                    throw new Error(`Your account has been blocked for  ${unblock_time} because you entered invalid credential`)

                }
                if (result >= 4) {
                    await request.models.User.update(
                        {
                            is_blocked: 1,
                            blocked_time: 30,
                            blocked_on: Sequelize.literal("CURRENT_TIMESTAMP"),
                        },
                        { where: { id: user.id } }
                    );
                    throw new Error("Invalid credentials. Please check your username and password and try again.")
                }
                throw new Error("Invalid credentials. Please check your username and password and try again.")
            }
        }
        catch (err: any) {
            console.log(err, " err")
            throw new Error(err.message ? err.message : HttpStatusMessage.INTERNAL_SERVER_ERROR)
        }
    };

    async verifyOTP(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const { email = '', otp = '' } = request.body;
            if (!email || !otp) {
                return generateResponse(res, 400, false, "Email and OTP both are required");
            }

            const sequelizeInstances = await setupSequelize('main');

            const user = await this.getUserByEmail(email, sequelizeInstances);
            if (user?.profile?.phone_number) {

                const otpData = await this.getUserOTP(user.id, sequelizeInstances);
                if (otpData) {
                    const optVarification = await this.validateOTP(otpData, otp);
                    if (optVarification.status) {
                        let company = user['dataValues']['companies'][0]?.db_alias;
                        const sequelizeInstancesCompany = await setupSequelize(company);

                        const origin = request.get('origin');

                        const payloadDataOtp = {
                            origin: origin,
                            sequelizeInstancesCompany: sequelizeInstancesCompany,
                            user: user,
                            sequelizeInstances: sequelizeInstances,
                            optVarification: optVarification
                        }
                        return this.otpVerificationFn(res, payloadDataOtp)
                    }
                    return generateResponse(res, 400, false, optVarification.message);
                }
                return generateResponse(res, 200, false, "Verification code is not found");
            }
            // User not found or phone not provided
            return generateResponse(res, 200, false, "User not found or phone not provided");

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async getUserByEmail(email: string, sequelizeInstances: any) {
        return sequelizeInstances.models.User.findOne({
            attributes: [
                'id',
                [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'), 'email'],
                'name',
                'role',
                'login_count',
                'region_id',
                "status",
                "chatbot_access",
                "division_id"
            ],
            where: {
                [Op.and]: [
                    sequelizeInstances.where(
                        decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'),
                        email // Compares the decrypted value with the email
                    ),
                    { is_deleted: 0 }
                ]
            },
            include: [
                {
                    model: sequelizeInstances.models.Profile,
                    attributes: [
                        "first_name",
                        "last_name",
                        "country_code",
                        "image",
                        [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'phone_number'), "phone_number"],
                    ],
                    as: "profile"
                },
                {
                    model: sequelizeInstances.models.Company,
                    attributes: [
                        "name",
                        "db_alias",
                        "logo",
                        "slug"
                    ],
                    as: "companies"
                },
            ],
        });
    }

    private async getUserOTP(userId: number, sequelizeInstances: any) {

        const condition = { user_id: userId };
        let data = await sequelizeInstances.models.UserOtp.findOne({
            attributes: ['otp', 'updatedAt'],
            where: condition,
        });

        return data
    }

    private async validateOTP(otpData: any, otp: any) {
        const currentTimeUtc = moment.utc();
        // OTP expiration time in UTC
        const otpExpirationTimeUtc = moment.utc(otpData.updatedAt).add(1, 'minutes');
        // Get UNIX timestamp for current time
        const currentTimeTimestamp = currentTimeUtc.unix();
        // Get UNIX timestamp for OTP expiration time
        const otpExpirationTimeTimestamp = otpExpirationTimeUtc.unix();
        if (currentTimeTimestamp > otpExpirationTimeTimestamp) {
            return { status: false, message: 'OTP has expired. Please request a new OTP.' };
        }

        return (otpData.otp == otp) ? { status: true, message: 'User Logged In Successfully.' } : { status: false, message: 'Verification code is not valid!' };
    }

    private async otpVerificationFn(res: any, prop: any) {
        const { sequelizeInstancesCompany, user, sequelizeInstances, optVarification, origin } = prop
        let permissionsData = await getRolePermissions(sequelizeInstancesCompany["models"], user.role);
        let jwtData = {
            ...user.dataValues,
            permissionsData: permissionsData
        }
        const jwtExpireTime: any = process.env.JWT_EXPIRE_TIME ?? 0;

        let token = await generateToken(jwtData, jwtExpireTime);
        let update_user_status = user.dataValues.status === 0 ? 1 : ""
        let tokenUniqueId = generateUniqueAlphanumeric(20);

        await Promise.all([
            sequelizeInstances.models.UserToken.create({
                user_id: user.id,
                token: token,
                status: 1,
                ut_id: tokenUniqueId,
                is_logout: 0,
                logout_reason: 0
            }),
            user.update({
                login_count: user.login_count + 1,
                last_logged_in: new Date(),
                [update_user_status && "status"]: update_user_status,
                [update_user_status && "updated_by"]: user.id
            }),
            sequelizeInstances.models.UserActivity.create({
                user_id: user.id
            })
        ]);

        const result = {
            id: user.id,
            email: user.email,
            token: tokenUniqueId,
            chatbot_access: user.chatbot_access,
            name: user.name,
            role: user.role,
            login_count: user.login_count,
            profile: user.profile,
            region_id: user?.region_id,
            division_id: user?.division_id,
            Company: user.companies[0],
            permissionsData: permissionsData
        };
        const days = parseInt(process.env.COOKIE_MAX_AGE_DAYS ?? '1', 10);

        const maxAgeMs = days * 24 * 60 * 60 * 1000;

        const isCrossSite = origin?.includes(process.env.ALLOW_ORIGIN);

        await res.cookie('token', tokenUniqueId, {
            httpOnly: true,
            secure: true,
            sameSite: isCrossSite ? 'none' : 'strict',
            maxAge: maxAgeMs,
        });

        return generateResponse(res, 200, true, optVarification.message, result);
    }
}

export default AuthController