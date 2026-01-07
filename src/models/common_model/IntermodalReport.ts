import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineIntermodalReportModel(sequelize: Sequelize) {
    class IntermodalReport extends Model {
        public id!: number;
        public origin_city!: string;
        public origin_state!: string;
        public dest_city!: string;
        public dest_state!: string;
        public year!: number;
        public carrier_name!: string;
        public shipments!: number;
        public distance!: number;
        public lane_name!: string;
    }

    IntermodalReport.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            origin_city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            origin_state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dest_city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dest_state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            carrier_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shipments: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            distance: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            lane_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'IntermodalReport',
            tableName: 'intermodal_reports',
            timestamps: false,
        }
    );

    return IntermodalReport;
}
