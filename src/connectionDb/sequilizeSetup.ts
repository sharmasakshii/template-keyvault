import { Sequelize } from "sequelize-typescript";
import { dbConfig } from "./config";
import { dbConst } from "./dbconst";
import * as fs from 'fs';
import * as path from 'path';
import { associations } from "../models/association";


const dbConnectionConstants: any = {};
const setupSequelize = async (dbName: string): Promise<Sequelize> => {
    try {
        let dbConst1: any = dbConst
        if (dbConnectionConstants[dbName]) {
            try {
                await dbConnectionConstants[dbName].authenticate();
                return dbConnectionConstants[dbName];
            } catch (error) {
                console.warn(`Connection to ${dbName} was lost. Reconnecting...`);
                delete dbConnectionConstants[dbName];
                throw new Error("Database is currently down! please contact admistartion")
            }
        }

        const getLoggingOption = (envValue: string | undefined) => {
            if (envValue === 'true') return console.log; // Use console.log for logging
            return false; // Default to disabled logging
        };

        const option = {
            ...dbConfig,
            database: dbConst1[dbName]['database'],
            username: dbConst1[dbName]['username'],
            password: dbConst1[dbName]['password'],
            schema: dbConst1[dbName]['schema'],
            pool: {
                max: 100, // Maximum number of connections in the pool
                min: 0, // Minimum number of connections in the pool
                acquire: 30000, // Maximum time to wait for connection (ms)
                idle: 10000, // Maximum idle time (ms)
                evict: 10000
            },
            dialectOptions: {
                connectTimeout: 20000 // Query timeout in milliseconds (60 seconds)
            },

            logging: getLoggingOption(process.env.SEQUILIZE_LOGGING)
        };

        const sequelize = new Sequelize(option);

        const modelDir = path.join(__dirname, '../models', dbConst1[dbName]['modelDir']);

        const modelFiles = fs.readdirSync(modelDir);

        modelFiles.forEach((file) => {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                const modelPath = path.join(modelDir, file);
                const defineModel = require(modelPath).default;

                defineModel(sequelize, dbName);
            }
        });

        const association: any = associations

        await association[dbConst1[dbName]['modelDir']].forEach((associate: any) => {
            let { model1, model2, associationType, options }: any = associate
            model1 = sequelize.models[model1]
            model2 = sequelize.models[model2]

            model1[associationType](model2, options);
        });

        await sequelize.authenticate()
        dbConnectionConstants[dbName] = sequelize
        return dbConnectionConstants[dbName]

    } catch (err: any) {
        console.log('err', err);
        throw new Error(err)
    }
};


export default setupSequelize;