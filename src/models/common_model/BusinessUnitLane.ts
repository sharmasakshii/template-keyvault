import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineBusinessUnitLaneModel(sequelize: Sequelize) {
    class BusinessUnitLane extends Model {
        public name?: string;
        public bu_id?: number;
        public region_id?: number;
        public emission?: number;
        public total_ton_miles?: number;
        public time_id!: number;
        public shipments?: number;
        public year?: number;
        public quarter?: number;
    }

    BusinessUnitLane.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bu_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            region_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            emission: {
                type: DataTypes.DECIMAL(35, 10),
                allowNull: true,
            },
            total_ton_miles: {
                type: DataTypes.DECIMAL(35, 10),
                allowNull: true,
            },
            time_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            shipments: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            year: {
                type: DataTypes.SMALLINT,
                allowNull: true,
            },
            quarter: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "business_unit_lanes",
            modelName: "BusinessUnitLane",
            timestamps: false,
        }
    );

    return BusinessUnitLane;
}
