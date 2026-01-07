import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineBusinessUnitCarrierEmission(sequelize: Sequelize) {
  class BusinessUnitCarrierEmission extends Model {
    public name?: string;
    public carrier?: string;
    public carrier_name?: string;
    public emission?: string;
    public time_id!: number;
    public total_ton_miles?: string;
    public carrier_logo?: string;
    public shipments?: string;
    public bu_id?: number;
    public region_id?: number;
    public year?: number;
    public quarter?: number;
  }

  BusinessUnitCarrierEmission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      carrier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      carrier_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emission: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      time_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_ton_miles: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      carrier_logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shipments: {
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
      modelName: "BusinessUnitCarrierEmission",
      tableName: "business_unit_carrier_emissions",
      timestamps: false,
    }
  );

  return BusinessUnitCarrierEmission;
}
