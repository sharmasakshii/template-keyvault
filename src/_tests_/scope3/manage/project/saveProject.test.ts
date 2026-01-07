import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";

const mockConnection: any = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      Project: {
        create: jest.fn(),
      },
      CarrierLogo: {
        findAll: jest.fn(),
      },
      Lane: {
        findOne: jest.fn(),
      },
      ProjectInvite: {
        bulkCreate: jest.fn(),
      },
      GetUserDetails: {
        findAll: jest.fn(),
      }
    },
    QueryTypes: { Select: jest.fn() },
    query: jest.fn<any>().mockResolvedValue([
      {
        valid: 1
      }
    ]
    )
  },
  userData: {
    id: 1,
  },
  'main': {
    RecommendedKLaneCoordinate: {
      findAll: jest.fn<any>().mockResolvedValue([
        {
          "lane_id": 228367,
          "k_count": 1,
          "distance": 1379.26,
          "fuel_count": 29
        }
      ]),
    }
  }
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Save Project functionality",
  controller: ProjectController,
  moduleName: "saveProject",
  testCases: [
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
            Project: {
              create: jest.fn<any>().mockResolvedValue({
                dataValues: {
                  id: 1,
                  project_name: "Test Project",
                  manager_id: 1,
                },
              }),
            },
            CarrierLogo: {
              findAll: jest.fn<any>().mockResolvedValue([]),
            },
            Lane: {
              findOne: jest.fn<any>().mockResolvedValue({
                dataValues: {
                  name: "Lane Name",
                },
              }),
            },
            ProjectInvite: {
              bulkCreate: jest.fn<any>().mockResolvedValue([]),
            },
            GetUserDetails: {
              findAll: jest.fn<any>().mockResolvedValue([
                {
                  dataValues: {
                    user_email: "test@example.com",
                    user_name: "Test User",
                    user_id: 1,
                  },
                },
              ]),
            },
          },
        },
      },
      testName: "should return a 200 status code and success message when the project is created successfully",
      body: { payload: "U2FsdGVkX19c8rtw26LyQ3HsiAY7sJ6bI4M7QsgnkKia1ux+7yEbpq1B2wM31t4icKLknkhbFOia0XSfbEDzXF4kBXL0nYrXWTPHxLkHKtlhqSmKD3YJREM5k4jpqf1V/fKHjdQhYWFVrFyk9FrCDUi1+3OO+Rz2fTT0okwgdWx4YLaUwg0Or7HBN9nubo6CWcLhmt0sBQXPWBPB/gwOYPwXyQoBFZWypo+xHJmQlpPVAzQd6GvxO5EQ8RTSAL3Hb7yPUElCZ+jNfrLcc6ZqLoS6ExX5ZxBaKA8IhZ16fMbRTPcqP/zJ/vzBEsQY2zczYDI63XXEQMCe6w4uW1myiHobFWg9fTVc7muTQy3Ff6dTy9TmsNiNWBN9D8RnG+YBppZCmlJLwyz7QpO+zOQe75apjT+7/uv3dxXWASrJcwHnobtG7ocXxKacQxsFddJOrkYdf9mysrY6Bjph+ovdWYzD7lMiTuvQAsOog7WeYB7S4iKbe5G+HhHZnAGwJJZA1CKTvxL4BMcRpp7PqfgEmoTZMDTo9dASrxdNcNioyMF6cm6wjkg/LgzA27p3lZdpqW4eGtTX0PvNsPoeU2NztQJcPvldWAL/DFrH/g3iyZl2KPGstlnpTZG++hnweZhz+Gvxp3voopUUxZ1yFyVtK951qKOLJRjWohU+tXfUrDGmcxnl0Pgzv90dZH29oOxELgHyRHFvEXYw6fZQfqyl++Ew6TcgoeZaDB6Mwtu5FBZrvpaBbIzaDCjLiNv7/cyt" },
      responseStatus: 200,
      responseMessage: "Project Created Successfully.",
    },
    {
      status: false,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            Project: {
              create: jest.fn<any>().mockRejectedValue(new Error("Database error")),
            },
          },
        },
      },
      testName: "should return a 500 status code and error message when a database error occurs",
      body: {
        payload: "U2FsdGVkX1+HsuyGwSBBSBVc7Ea77lGpU257bcdSlIpoe39n6Vug82svCq3Tp/pvPZnp4yBS9oEQG4JZm3INd3qsDedoTXqeruwjCBBb91H+EJg94wdGtpB1ajSa7h5fnvBquJ7oud4MfBu/VifHMa2N4+P0Cc0VH//NIDO6oxtPu88MOS7fthRocitNDMkzZJJoX6lo/b9Hvspe9mLiyFXB/PF3OL5zmLvRYivdtCU=",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
    {
      status: false,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
          },
        },
      },
      testName:
        "should return a 422 status code and error message when the project_name exceeds 50 characters",
      body: {
        payload: "U2FsdGVkX1/9W/3KwtOMvEzKmChbdNvzt2Wr9Y+gtl6bkfGDATONVq3Pc404yO92rkaOCjpurXPXjRUi6p+gRODg8Wg4yuuJQ0Xa7I7eHV/EgVvioPK9xxNXd9W/TVqmyZSQSo43Xi1j48lF4BnXxxHRgrInAD46rzfPTWIPZJuWWWFifyRch554YIPDwTZgzA7zcl8amguJqANp1qmVPrwHsPkkwoYTxe8CLKepVTduhF4l8Dv+zUdNVEGaGNI6sbbaw4K7N9G/kpYuN2mNJMNVEPfjqgwtLjAQHCjk9nM=",
      },
      responseStatus: 422,
      responseMessage: "Name exceeds the character limit (50 characters).",
    },
    {
      status: false,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
          },
        },
      },
      testName:
        "should return a 422 status code and error message when the description exceeds 250 characters",
      body: {
        payload: "U2FsdGVkX1/luLkzuovnJ2S9HwCps42i1P2/wxChJRlV9qc5UL2HCPtD9eTN7/kNtzmtoEqLUO6cezEE/wLWiarF37rGmsnnrOTKiiyQItwYSyfLK3GyI655wyhrPLVGYlyEPjWlWGFixTfMU1nZoJU2AozX66hcnefWBI6ImaXL5UVMC0iZRAIN8h1xhAi9MyGOymdtzU24ReVUD/ntm9eBecnGTXg1V5eO0TnGezKyH/9KTw8k3n/z3tLPZhQmhENpzTWo+/d1FTAs9Y+k5tFUrvITaxuFa3ls15NqS6Q1wq4iTPkSPzQj3W01E+NvJsTcp/Vlyk4Pv4dmVb3kzND+8JWe5FV5oKuFrVxKF44SRR4OvC6y1kGnKN5u0YkOss0qRiFCYKSPbe/WGZfgiEA6p4itwuc062fEg53/svf/1fZJ5dmf2ZKI5XDD6XewYEabEaZS+8X/S8epW0wN8KqE4dgfupsZNnX4stXPGolQdDUGz1TShIAsbKkLBbUwcMXdtqIUEIIZCtY6gVi/nG00u7n6yTQks3MnN3rbqzxxrL0xHIPJV5BDzoHXX00al6BOFXkptQnqrRcgMWLnYLHHwklBm11TZ5VE6ZOvKgLl2zS6R7qt6FsbgbdSDBI+",
      },
      responseStatus: 422,
      responseMessage: "Description exceeds the character limit (250 characters).",
    },
  ],
};

jest.mock("../../../../emailSender/emailSentWithAttachment", () => ({
  azurEmailFunction: jest.fn<any>().mockResolvedValue(true),
}));

commonTestFile(payload);
