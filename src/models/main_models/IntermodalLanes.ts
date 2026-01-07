import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineIntermodalLanesModel(sequelize: Sequelize) {
    class IntermodalLanes extends Model {
        public uuid!: string;
        public name!: string;
        public route_number!: number;
        public created_by!: number;
        public created_on!: string;
        public modified_by!: number;
        public modified_on!: string;
        public is_deleted!: number;
    }

    IntermodalLanes.init(
        {
            uuid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            route_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            modified_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            modified_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_deleted: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'IntermodalLanes',
            tableName: 'intermodal_lane',
            timestamps: false, // Disable timestamps if not required
        }
    );

    return IntermodalLanes;
}

