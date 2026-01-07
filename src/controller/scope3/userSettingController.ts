import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { generateResponse, } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { validator, encryptPassword, decryptByPassPhraseColumn, encryptByPassPhrase } from "../../services/commonServices";
import { decryptDataFunction } from "../../services/encryptResponseFunction";
import { validationConstant, passwordRegex } from "../../constant"
import bcrypt = require("bcrypt");
import moment = require("moment");
import { dbConst } from "../../connectionDb/dbconst";
import { BlobServiceClient, ContainerSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from "@azure/storage-blob";
type CompanyKeys = 'lowes' | 'pepsi' | 'adm' | 'tql' | 'generic';
const PROFILE_PATH = process.env.PROFILE_PATH;

class UserSettingController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    /**
     * @description Handles the alternate K shortest path API request.
     * @param {HttpRequest} request - The HTTP request.
     * @param {InvocationContext} context - The Azure Function invocation context.
     * @returns {Promise<HttpResponseInit>} - The HTTP response initialization.
     */

    async userDetail(
        request: MyUserRequest,
        res: Response
    ): Promise<any> {
        try {

            let authenticate: any = this.connection;
            const initMainDbConnection = authenticate['main'];
            const loggenInUser = authenticate?.userData.id;

            let getUser: any = await initMainDbConnection["models"].User.findOne({
                attributes: [[decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'), 'email']],
                where: { id: loggenInUser },
                include: [
                    {
                        model: initMainDbConnection["models"].Profile,
                        attributes: [
                            "first_name",
                            "last_name",
                            "country_code",
                            "image",
                            [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'phone_number'), "phone_number"],
                            "title",
                        ],
                        as: 'profile'
                    },
                    {
                        model: initMainDbConnection["models"].Company,
                        attributes: ["name", "db_alias", "logo", "slug", "is_onboarded"],
                        as: 'companies'
                    },
                ],
            })

            const company_id = getUser?.dataValues?.companies[0]?.dataValues?.UserCompany?.dataValues?.company_id

            const onBoardStatus = await initMainDbConnection["models"].CompanyOnboardingStatus?.findAll({
                where: { company_id: company_id },
                include: [
                    {
                        model: initMainDbConnection[
                            "models"
                        ].Scope,
                        attributes: ["name", "code"],
                        as: 'scope'
                    },
                ],
            })
            const transformedResponse = onBoardStatus.reduce((acc: any, item: any) => {
                if (item.scope.code) {
                    acc[item.scope.code] = item.is_onboarded;
                }
                return acc;
            }, {} as Record<string, boolean>);

            let userData = {
                email: getUser?.dataValues?.email,
                profile: getUser?.dataValues?.profile,
                Company: getUser?.dataValues?.companies[0],
                ...transformedResponse
            };

            if (getUser?.dataValues?.email) {
                return generateResponse(res, 200, true, "User Profile", userData);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @description Handles the alternate K shortest path API request.
     * @param {HttpRequest} request - The HTTP request.
     * @param {InvocationContext} context - The Azure Function invocation context.
     * @returns {Promise<HttpResponseInit>} - The HTTP response initialization.
     */
    async updateProfile(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {

            let authenticate: any = this.connection;

            const initMainDbConnection = authenticate['main'];

            const loggenInUser = authenticate?.userData.id;

            let { first_name, last_name, phone_number, title } = request.body

            let validation = await validator(
                {
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    title: title
                },
                {
                    first_name: `${validationConstant?.Required}|max:20`,
                    last_name: `${validationConstant?.Required}|max:20`,
                    phone_number: 'nullable|max:15', // Assuming phone number max length is 15
                    title: `${validationConstant?.Required}|max:150`
                }
            );
            if (validation.status) {
                return generateResponse(res, 400, false, 'Validation Errors!');
            }

            let getUser: any = await initMainDbConnection["models"].User.findOne({
                where: { id: loggenInUser },
                include: [{
                    model: initMainDbConnection[
                        "models"
                    ].Profile,
                    as: "profile",
                    attributes: ['first_name', 'title', 'last_name', 'country_code', [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'phone_number'), "phone_number"],]
                }]
            })

            if (getUser?.dataValues?.profile) {
                let encryptedProfileData: any = {
                    first_name: first_name,
                    last_name: last_name,
                    updated_by: loggenInUser,
                };
                if (getUser?.dataValues?.profile?.phone_number !== phone_number) {
                    encryptedProfileData["phone_number"] = encryptByPassPhrase(process.env.EMAIL_PHONE_PASSPHRASE, phone_number);
                }
                if (getUser?.dataValues?.profile?.title !== title) {
                    encryptedProfileData["title"] = title
                }
                let userEncryptedData: any = {
                    name: `${first_name} ${last_name}`,
                    updated_by: loggenInUser,
                }
                await getUser.update(userEncryptedData).then((user: any) => {
                    initMainDbConnection[
                        "models"
                    ].Profile.findOne({ where: { user_id: user.id } }).then((profile: any) => {
                        return profile.update(encryptedProfileData)
                    })
                });
                return generateResponse(res, 200, true, 'User Profile Updated.')
            } else {
                return generateResponse(res, 404, false, HttpStatusMessage.NOT_FOUND)
            }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
   * @description Handles the alternate K shortest path API request.
   * @param {HttpRequest} request - The HTTP request.
   * @param {InvocationContext} context - The Azure Function invocation context.
   * @returns {Promise<HttpResponseInit>} - The HTTP response initialization.
   */
    async updateUserPassword(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {


            let authenticate: any = this.connection;
            const initMainDbConnection = authenticate['main'];
            const loggenInUser = authenticate?.userData.id;
            let { old_password, new_password } = request.body

            let validation = await validator({
                old_password: old_password,
                new_password: new_password
            }, {
                old_password: validationConstant?.Required,
                new_password: validationConstant?.Required
            });

            if (validation.status) {
                return generateResponse(res, 400, false, 'Validation Errors!', validation);
            }

            old_password = decryptDataFunction(old_password);
            new_password = decryptDataFunction(new_password);

            // Validate password requirements (at least 8 characters, one special character, and one uppercase character)
            if (!passwordRegex.test(new_password)) {
                return generateResponse(res, 400, false, "Invalid password format");
            }

            let getUser: any = await initMainDbConnection["models"].User.findOne({
                where: { id: loggenInUser },
            })

            //get profile details
            if (!getUser) {
                return generateResponse(res, 200, false, HttpStatusMessage.NOT_FOUND)
            }
            const passwordMatch = await bcrypt.compare(old_password, getUser?.password);
            if (!passwordMatch) {
                return generateResponse(res, 400, false, 'Current Password Is Incorrect!')
            }
            // Get Previous 5 Password to Match
            let UserLog: any = await initMainDbConnection["models"].UserPasswordLog.findAll({
                where: { user_id: loggenInUser },
                limit: 5,
                order: [['created_at', 'DESC']],
            });

            // Mtach the last 5 passwords
            if (UserLog != null) {
                for (const data of UserLog) {
                    const oldPasswordMatch = await bcrypt.compare(new_password, data.old_password);
                    if (oldPasswordMatch) {
                        return generateResponse(res, 400, false, 'Your new password must be different from your previous password.')
                    }
                }
            }
            let generateHash = await encryptPassword(new_password);
            await getUser.update({
                password: generateHash
            })
            // Create User Password Log
            await initMainDbConnection["models"].UserPasswordLog.create({
                user_id: loggenInUser,
                old_password: generateHash
            });

            return generateResponse(res, 200, true, 'Password Updated Successfully.');

        } catch (error) {
            console.error(error);
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
 * Azure Function for getting file management status list.
 * @param {HttpRequest} request - The HTTP request object.
 * @returns {Promise<HttpResponseInit>} - The HTTP response containing the file management status list.
 */
    async getBlobDetail(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const user = authenticate?.userData
            const { isProfile, fileSize, fileMimeType } = request.body;

            const mainConnection = authenticate['main'].models;
            let company: CompanyKeys = authenticate['company'];
            const fileSizeLimit = 5 * 1024 * 1024; // 5 MB
            if (fileSize > fileSizeLimit) {
                return generateResponse(res, 400, false, "Profile picture size exceeds the limit of 5 MB.");
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(fileMimeType)) {
                return generateResponse(res, 400, false, "Invalid file format. Only JPEG, JPG, and PNG formats are allowed.");
            }
            const recentAttempts = await mainConnection.Profile.findOne({
                attributes: [
                    'id', 'user_id', 'profile_image_count',
                    'createdAt', 'updatedAt',
                    [Sequelize.literal(`DATEADD(MINUTE, -60, CURRENT_TIMESTAMP)`), 'oneHourAgo'],
                ],
                where: {
                    user_id: user.id,
                },
            });
            const oneHourAgo: any = recentAttempts?.dataValues?.oneHourAgo ? moment(recentAttempts?.dataValues?.oneHourAgo).utc() : null;

            let updateValues;
            if (recentAttempts) {
                const attempts = recentAttempts?.dataValues?.profile_image_count || 0;
                if ((attempts + 1) > 5 && recentAttempts.dataValues.updatedAt >= oneHourAgo) {
                    return generateResponse(res, 400, false, "Exceeded maximum attempts in the last 60 minutes.");
                } else if ((attempts + 1) > 5 && recentAttempts.dataValues.updatedAt < oneHourAgo) {
                    updateValues = {
                        image_count: 1
                    };
                } else {
                    updateValues = {
                        image_count: attempts + 1,
                    };
                }
            } else {
                // If no recent attempt exists, create a new one
                updateValues = {
                    image_count: 1,
                };
            }

            const constants: any = {
                accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
                accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
            };

            let containerName = dbConst[company].bucketName
            if (isProfile) {
                containerName = dbConst[company].assetContainer
            }
            const connectionString: any = process.env.AZURE_STORAGE_CONNECTION_STRING;
            const blobService = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobService.getContainerClient(containerName);

            const sharedKeyCredential = new StorageSharedKeyCredential(
                constants.accountName,
                constants.accountKey
            );

            const sasOptions = {
                containerName: containerName,
                permissions: ContainerSASPermissions.parse("cw"),
                startsOn: new Date(),
                expiresOn: new Date(new Date().valueOf() + 3600 * 1000)
            };

            const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
            const data = {
                url: containerClient.url,
                sasToken: sasToken,
                profilePath: PROFILE_PATH,
                updateValues: updateValues
            }
            return generateResponse(res, 200, true, "Blob container details", data);
        } catch (error) {
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async updateProfileImage(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection
        try {
            const user_id = authenticate.userData.id
            const { fileName, updateValues } = request.body
            const saveName = `/images/profile/${fileName}`;

            const updateObject = await authenticate["main"]["models"].Profile.findOne({
                where: { user_id: user_id }
            });
            if (updateObject) {
                await updateObject.update({
                    image: saveName,
                    profile_image_count: updateValues?.image_count,
                    updated_by: user_id
                });
                return generateResponse(res, 200, true, 'Profile Image Uploaded Successfully.');
            }
            return generateResponse(res, 400, false, 'Error while Uploading Image!');
        } catch (error) {
            console.log(error, "err");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }
}

export default UserSettingController;