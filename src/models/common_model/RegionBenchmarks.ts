import { DataTypes, Sequelize, Model } from "sequelize";

export default function defineRegionBenchmarksModel(sequelize: Sequelize) {
    class RegionBenchmarks extends Model {
        public company_emission_ttw!: number;
        public company_emission_wtw!: number;
        public company_total_ton_miles!: number;
        public industry_total_ton_miles!: number;
        public industry_emission_wtw!: number;
        public industry_emission_ttw!: number;
        public industry_shipments!: number;
        public industry_intermodal_shipments!: number;
        public company_shipment!: number;
        public company_intermodal_shipments!: number;
        public bound_type!: string;
        public quarter!: number;
        public year!: string;
        public region!: number;
    }

    RegionBenchmarks.init(
        {
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
            industry_total_ton_miles: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            industry_emission_wtw: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            industry_emission_ttw: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            industry_shipments: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            industry_intermodal_shipments: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            company_shipment: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            company_intermodal_shipments: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            bound_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quarter: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            year: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            region: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "RegionBenchmarks",
            tableName: "region_benchmarks",
            timestamps: false,
        }
    );

    return RegionBenchmarks;
}
