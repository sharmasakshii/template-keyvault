import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
export const dbConst = {
    'main': {
        database: process.env.DB_MASTER_NAME,
        username: process.env.DB_MASTER_USER,
        password: process.env.DB_MASTER_PASSWORD,
        schema: 'greensight_master',
        modelDir: 'main_models',
        assetContainer: 'appdata'
    },
    'lowes': {
        database: process.env.DB_LOWES_NAME,
        username: process.env.DB_LOWES_USER,
        password: process.env.DB_LOWES_PASSWORD,
        schema: 'greensight_lowes',
        modelDir: 'common_model',
        bucketName: 'lowes-container',
        assetContainer: 'appdata'
    },
    'pepsi': {
        database: process.env.DB_PEPSI_NAME,
        username: process.env.DB_PEPSI_USER,
        password: process.env.DB_PEPSI_PASSWORD,
        schema: 'greensight_pepsi',
        modelDir: 'common_model',
        bucketName: 'pepsi-container',
        assetContainer: 'appdata'
    },
    'adm': {
        database: process.env.DB_ADM_NAME,
        username: process.env.DB_ADM_USER,
        password: process.env.DB_ADM_PASSWORD,
        modelDir: 'common_model',
        assetContainer: 'appdata',
        schema: 'greensight_adm',
        bucketName: 'adm-container',
    },
    'tql': {
        database: process.env.DB_TQL_NAME,
        username: process.env.DB_TQL_USER,
        password: process.env.DB_TQL_PASSWORD,
        modelDir: 'common_model',
        assetContainer: 'appdata',
        schema: 'greensight_tql',
        bucketName: 'tql-container',
    },
    'generic': {
        database: process.env.DB_DEMO_NAME,
        username: process.env.DB_DEMO_USER,
        password: process.env.DB_DEMO_PASSWORD,
        schema: 'greensight_pepsi',
        modelDir: 'common_model',
        bucketName: 'generic-container',
        assetContainer: 'appdata'
    },
    'redbull': {
        database: process.env.DB_REDBULL_NAME,
        username: process.env.DB_REDBULL_USER,
        password: process.env.DB_REDBULL_PASSWORD,
        schema: 'greensight_redbull',
        modelDir: 'common_model',
        bucketName: 'redbull-container',
        assetContainer: 'appdata'
    },
    'brambles': {
        database: process.env.DB_BRAMBLES_NAME,
        username: process.env.DB_BRAMBLES_USER,
        password: process.env.DB_BRAMBLES_PASSWORD,
        schema: 'greensight_brambles',
        modelDir: 'common_model',
        bucketName: 'brambles-container',
        assetContainer: 'appdata'
    },
};