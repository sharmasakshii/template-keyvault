import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineSummarisedFuelBoard(sequelize: Sequelize) {
    class SummarisedFuelBoard extends Model {
        public id!: number;
        public carrier_scac!: string | null;
        public carrier_type!: string | null;
        public standard_emissions!: number | null;
        public fuel_emissions!: number | null;
        public shipments!: number | null;
        public year!: number | null;
        public time_id!: number | null;
        public country!: string | null;
    }

    SummarisedFuelBoard.init(
        {
        
            carrier_scac: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            carrier_type: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            standard_emissions: {
                type: DataTypes.DECIMAL(35, 10),
                allowNull: true,
            },
            fuel_emissions: {
                type: DataTypes.DECIMAL(35, 10),
                allowNull: true,
            },
            fuel_consumption: {
                type: DataTypes.DECIMAL(35, 10),
                allowNull: true,
            },
            shipments: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            time_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'SummarisedFuelBoard',
            tableName: 'summarised_fuel_board',
            timestamps: false,
            schema: 'greensight_pepsi', // if you're using schema in SQL Server
        }
    );

    return SummarisedFuelBoard;
}
