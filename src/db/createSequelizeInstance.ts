import { Sequelize } from 'sequelize';
import { DBConfig } from "../interface/db"

// Function to dynamically create Sequelize instance for SQL Server
const createSequelizeInstance = (dbConfig: DBConfig): Sequelize => {
    return new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        dialectOptions: {
            options: {
                encrypt: true,  // Use encryption with SQL Server
                trustServerCertificate: true  // If you're using self-signed certificates
            }
        },
        logging: false,  // Disable logging (optional)
    });
};

export default createSequelizeInstance;
