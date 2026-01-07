import { DataTypes, Sequelize, Model } from "sequelize";

export default function defineLaneBenchmarksModel(sequelize: Sequelize) {
  class LaneBenchmarks extends Model {
    public industry_shipments!: number;
    public industry_emission_ttw!: number;
    public industry_emission_wtw!: number;
    public industry_total_ton_miles!: number;
    public company_emission_ttw!: number;
    public company_emission_wtw!: number;
    public company_total_ton_miles!: number;
    public industry_intermodal_shipments!: number;
    public company_shipment!: number;
    public company_intermodal_shipments!: number;
    public name!: string;
    public DEST!: string;
    public ORIGIN!: string;
    public quarter!: number;
    public year!: string;
    public month!: number;
  }

  LaneBenchmarks.init(
    {
      industry_shipments: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      industry_emission_ttw: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      industry_emission_wtw: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      industry_total_ton_miles: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      company_emission_ttw: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      company_emission_wtw: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      company_total_ton_miles: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      industry_intermodal_shipments: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      company_shipment: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      company_intermodal_shipments: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      DEST: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ORIGIN: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quarter: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      month: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LaneBenchmarks",
      tableName: "lane_benchmarks",
      timestamps: false, // Add this if timestamps are not needed
    }
  );

  return LaneBenchmarks;
}
