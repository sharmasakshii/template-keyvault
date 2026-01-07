import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCountry(sequelize: Sequelize) {
    class Country extends Model {
        public id!: number;
        public country_name!: string;
        public country_code!: string;
    }

    Country.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            country_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },

        },
        {
            sequelize,
            modelName: 'CountryAlternate',
            tableName: 'country',
            timestamps: false,
        }
    );

    return Country;
}
