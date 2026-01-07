import { DataTypes, Sequelize, Model } from "sequelize";

export default function defineEmissionBandsModel(sequelize: Sequelize) {
    class EmissionBands extends Model {
        public industry_emission_ttw!: number;
        public industry_emission_wtw!: number;
        public industry_total_ton_miles!: number;
        public company_emission_ttw!: number;
        public company_emission_wtw!: number;
        public company_total_ton_miles!: number;
        public band_no!: number;
        public quarter!: string;
        public year!: string;
        public type!: 'miles' | 'weight';
    }

    EmissionBands.init(
        {
            industry_emission_ttw: {
              type: DataTypes.FLOAT,
              allowNull: false,
            },
            industry_emission_wtw: {
              type: DataTypes.FLOAT,
              allowNull: false,
            },
            industry_total_ton_miles: {
              type: DataTypes.FLOAT,
              allowNull: false,
            },
            company_emission_ttw: {
              type: DataTypes.FLOAT,
              allowNull: false,
            },
            company_emission_wtw: {
              type: DataTypes.FLOAT,
              allowNull: false,
            },
            company_total_ton_miles: {
              type: DataTypes.FLOAT,
              allowNull: false,
            },
            band_no: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            quarter: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            year: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            type: {
              type: DataTypes.ENUM('miles', 'weight'),
              allowNull: false,
            },
          },
          {
            sequelize,
            modelName: 'EmissionBands',
            tableName: 'emission_bands',
            timestamps: false,
          }
    );


    return EmissionBands;
}