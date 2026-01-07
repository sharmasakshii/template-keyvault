import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import RoleController from "../../../../controller/admin/roleController/roleController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection: any = {
    schema: "testSchema",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    main: {
        models: {
            UserToken: {
                update: jest.fn<any>()
            }
        }
    },
    [comapnyDbAlias?.PEP]: {
        models: {
            Roles: {
                findOne: jest.fn<any>().mockResolvedValue({
                    save: jest.fn<any>(),
                    dataValues: {
                        name: "weqwe",
                        description: "vbjk",
                        id: 2
                    }
                }),
            },
            RoleAccess: {
                findOne: jest.fn<any>().mockResolvedValue([{ title: "fghj", id: 1, parent_id: 1, slug: "dadas" }]),
                update: jest.fn<any>(),
                bulkCreate: jest.fn<any>()
            },
            GetUserDetails: {
                findAll: jest.fn<any>().mockResolvedValue([{ user_id: 1 }])
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Edit role ",
    controller: RoleController,
    moduleName: "editRole",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                role_id: 1, name: "", description: "", moduleIds: [1]
            },
            responseStatus: 200,
            responseMessage: "Role Edited Successfully.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation errorr if name exceed the length",
            body: {
                role_id: 1, name: "djaskjdasd as dkjmas da msd asd jadadadasddasd zdcz asdasdasdads s nasjdasjdasd ja dajsdas jdasmd askjasdas askdas dasjd asjdas jdasj das", description: "", moduleIds: [1]
            },
            responseStatus: 422,
            responseMessage: "Name exceeds the character limit (50 characters).",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation errorr if description exceed the length",
            body: {
                role_id: 1, name: "", description: "djaskjdasd as dkjmas da msd asd jadadadasddasd zdcz asdasdasdads s nasjdasjdasd ja dajsdas jdasmd askjasdas askdas dasjd asjdas jdasj das asdasd aghcdsa dasjd hsdASDJVAaddasdas sdcasdasdghavsdjasdbnmas,dnbmsavndb,dma.sadncbvdsasnm,d.vxbsdasnm,.dsv,mnd,bsmand,.c/vc,cxmnsba dmzc,.vx/c,dsmnab czvnxm,./cds,amnb dcsm,a.mdncbdmas,a./s,dxnv cdsnm,./dsmvfbdnsw,q.d,ms.vnds,.d,fndms,ws./ad/,dnmfs,.ws/d,fdnms,.q/   ;WLD?,.mfnsa,./ad,.mns,.q/,d/avndms,s.dncbsmda,q./s.MDA.NBMDSANQ.,A/.SMncS bXJASA XZCKBZJCZ XCXZ CZBKJC KJ", moduleIds: [1]
            },
            responseStatus: 422,
            responseMessage: "Description exceeds the character limit (250 characters).",
        },
        {
            status: true,
            mockConnection: {
                schema: "testSchema",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Roles: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
            },
            testName: "should return 200 when NOT FOUND ROLE success",
            body: {
                role_id: 1, name: "", description: "", moduleIds: [1]
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                page_size: 10,
                page: 1,
                searchText: "",
                order_by: "asc",
                col_name: "test",
                role_id: 1,

            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
