import { Sequelize, Op } from "sequelize";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { generateResponse } from "../../../services/response";
import HttpStatusMessage from "../../../constant/responseConstant";
import { callStoredProcedure, getRolePermissions, updateUserTokenOnRoleUpdate } from "../../../services/commonServices";

class RoleController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getRoledata(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {

        const authenticate: any = this.connection

        try {
            const companyConnection = authenticate[authenticate.company]
            const { page_size, page, searchText, col_name = 'id', order_by = 'desc' } = request.body

            let name = searchText || null

            let replacement = {
                PageSize: page_size,
                PageNumber: page,
                Name: name,
                col_name: col_name,
                order_by: order_by
            }

            const replacementForCount = {
                PageSize: null,
                PageNumber: null,
                Name: name,
                col_name: col_name,
                order_by: order_by
            }

            const query = `EXEC ${authenticate?.schema}.GetUserDetailsAndCount @PageSize = :PageSize ,@PageNumber=:PageNumber ,
            @Name=:Name,
            @col_name=:col_name,
            @order_by=:order_by
        `

            const [roleUserCounts, RoleDataCount] = await Promise.all([
                callStoredProcedure(replacement, companyConnection, query),
                callStoredProcedure(replacementForCount, companyConnection, query),
            ]);

            if (roleUserCounts?.length > 0) {
                let resData = {
                    roleUserCounts,
                    pagination: {
                        page: page,
                        page_size: page_size,
                        total_count: RoleDataCount.length,
                    }
                };
                return generateResponse(res, 200, true, "Roles data with user counts", resData);
            }
            else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        }
        catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteRole(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection

        try {
            const { role_id } = request.body
            let getrole = await authenticate[authenticate.company].models.Roles.findOne({
                where: {
                    id: role_id,
                    is_deleted: 0,
                }
            });
            if (!getrole) {
                return generateResponse(res, 400, false, "Role not found");
            }
            let checkuser = await authenticate[authenticate.company].models.GetUserDetails.findOne({
                where: { [Op.and]: [{ user_role: getrole.dataValues.id }, { user_is_deleted: 0 }] }
            });
            if (checkuser) {
                return generateResponse(res, 400, false, "This role cannot be deleted as it is currently assigned to one or more users");
            } else {
                let roledeleted = await authenticate[authenticate?.company].models.Roles.update({ is_deleted: 1 },
                    { where: { id: role_id } });
                if (roledeleted) {
                    return generateResponse(res,
                        200,
                        true,
                        `Role deleted successfully`,
                    );
                } else {
                    return generateResponse(res, 400, false, HttpStatusMessage.NOT_FOUND);
                }
            };
        } catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async createRole(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection

        try {
            const { name, description, moduleIds } = request.body
            if (name.length > 50) {
                return generateResponse(res,
                    422,
                    false,
                    "Name exceeds the character limit (50 characters)."
                );
            }
            const loggenInUser = authenticate.userData.id;
            const checkRole = await authenticate[authenticate?.company].models.Roles.findOne({
                where: {
                    name: name,
                    is_deleted: 0,
                },
            });
            if (checkRole) {
                return generateResponse(res,
                    409,
                    false,
                    "Sorry, the role name is already in use. Please enter a different role name."
                );
            }
            const roleData = await authenticate[authenticate.company].models.Roles.create({
                name: name,
                description: description,
                created_by: loggenInUser,
                status: 1,
            });

            if (!roleData) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            const permissionsData = [];
            for (let module of moduleIds) {
                let obj = {
                    role_id: roleData?.dataValues?.id,
                    module_id: module,
                };
                permissionsData.push(obj);
            }
            await authenticate[authenticate.company].models.RoleAccess.bulkCreate(
                permissionsData
            );
            return generateResponse(res,
                200,
                true,
                "Role Created Successfully.",
                roleData
            );
        } catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getRoleDetails(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection
        try {
            const { role_id } = request.body

            if (!role_id) {
                return generateResponse(res, 400, false, 'Payload missing');
            }
            const roleData = await authenticate[authenticate.company].models.Roles.findOne({
                where: { id: role_id },
            });

            if (roleData) {
                let permissionsData = await getRolePermissions(authenticate[authenticate?.company]?.models, role_id);

                let data = { roleData, permissionsData };

                return generateResponse(res, 200, true, "Role Details.", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async editRole(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {

        let authenticate: any = this.connection

        try {
            const { role_id, name, description, moduleIds } = request.body

            let valid = this.validateInput(name, description);

            if (!valid.status) {
                return generateResponse(res,
                    422,
                    false,
                    valid.message
                );
            }
            const checkRole = await authenticate[authenticate.company].models.Roles.findOne({
                where: {
                    id: role_id,
                    is_deleted: 0,
                },
            });

            if (checkRole) {
                this.updateRoleInfo(checkRole, name, description);
                
                const findUserOnThisRole = await authenticate[authenticate.company].models.GetUserDetails.findAll({
                    where: {
                        [Op.and]: [
                            { user_is_deleted: 0 },
                            { user_role: role_id }
                        ]
                    }
                })

                await checkRole.save();
                const where = {
                    role_id: checkRole?.dataValues?.id,
                    is_deleted: 0,
                    module_id: {
                        [Op.notIn]: moduleIds,
                    },
                };
                let qury = { where: where }

                await authenticate[authenticate.company].models.RoleAccess.update({ is_deleted: 1 }, qury);
                const permissionsData = [];
                for (let module of moduleIds) {
                    let where = {
                        role_id: checkRole?.dataValues?.id,
                        module_id: module,
                        is_deleted: 0,
                    };
                    const ifAccessFound = await authenticate[authenticate.company].models.RoleAccess.findOne({ where });
                    if (!ifAccessFound) {
                        let obj = {
                            role_id: checkRole?.dataValues?.id,
                            module_id: module,
                        };
                        permissionsData.push(obj);
                    }
                }
                await authenticate[authenticate.company].models.RoleAccess.bulkCreate(
                    permissionsData
                );
                const payloadData = {
                    userId: findUserOnThisRole?.map((ele: any) => { return ele.user_id }),
                    status: 3,
                    main: authenticate['main']
                }
                await updateUserTokenOnRoleUpdate(payloadData)
                return generateResponse(res, 200, true, "Role Edited Successfully.");
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllModules(_request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection

        try {
            let getAllModules = await authenticate[authenticate?.company].models.Module.findAll({ where: { is_deleted: 0 } });

            if (getAllModules.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            const data = await this.createNestedStructure(getAllModules);
            return generateResponse(res, 200, true, "List of Modules.", data);

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    private readonly validateInput = (name: string, description: string) => {
        if (name.length > 50) {
            return {
                status: false,
                message: "Name exceeds the character limit (50 characters)."
            };
        }
        if (description.length > 250) {
            return {
                status: false,
                message: "Description exceeds the character limit (250 characters)."
            }
        }
        return {
            status: true,
            message: ""
        };
    }

    private readonly updateRoleInfo = (checkRole: any, name: string, description: string) => {
        if (name) {
            checkRole.name = name;
        }
        if (description) {
            checkRole.description = description;
        }
    }

    private readonly createNestedStructure = (data: any) => {
        const result: any = [];

        data.forEach((item: any) => {
            if (item.parent_id === 0) {
                let obj = {
                    title: item.title,
                    parent_id: item.parent_id,
                    slug: item.slug
                } as any
                let child = this.createChildItems(item.id, data);
                obj['child'] = child;
                result.push(obj);
            }
        });

        return result;
    }

    private createChildItems(parentId: any, data: any) {
        const childItems: any = [];

        data.forEach((item: any) => {
            if (item.parent_id === parentId) {
                const childItem = {
                    id: item.id,
                    title: item.title,
                    parent_id: item.parent_id,
                    slug: item.slug,
                    child: this.createChildItems(item.id, data),
                };
                childItems.push(childItem);
            }
        });

        return childItems.length > 0 ? childItems : undefined;
    }
}

export default RoleController