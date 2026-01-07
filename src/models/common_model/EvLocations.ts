import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineEvLocationsModel(sequelize: Sequelize) {

    class EvLocations extends Model {
        public year!: number;
        public name!: string;
        public latitude!: number;
        public longitude!: number;
    }

    EvLocations.init(
        {
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            longitude: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'EvLocations',
            tableName: 'ev_locations',
            timestamps: false,
            hasTrigger: true,
        }
    );


    return EvLocations;
}
