import { Options } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
export const dbConfig: Options = {
    dialect: "mssql",
    host: process.env.DB_HOST,
    dialectOptions: {
        encrypt: true,
        connectTimeout: process.env.CONNECTION_TIMEOUT,
        requestTimeout: process.env.REQUEST_TIMEOUT
    }
};



