import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFacilityModel(sequelize: Sequelize) {
    class Facility extends Model {
        public name!: string;
        public state!: string;
        public code!: string;
    }

    Facility.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Facility',
            tableName: 'facilities',
            timestamps: false, // Add this if there are no createdAt/updatedAt columns
        }
    );

    return Facility;
}
