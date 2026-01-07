export interface DBConfig {
    database: string;
    username: string;
    password: string;
    host: string;
    dialect: 'mssql';  // Specify dialect as 'mssql' for SQL Server
}
