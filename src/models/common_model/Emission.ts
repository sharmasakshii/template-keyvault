import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineEmissionModel(sequelize: Sequelize) {
  class Emission extends Model {
    public name!: string;
    public source!: string;
    public destination!: string;
    public region_name!: string;
    public region_id!: number;
    public bu_id!: number;
    public time_id!: number;
    public division_id!: number;
  }

  Emission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emission: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_ton_miles: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      shipments: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Emission",
      tableName: "emissions",
    }
  );


  return Emission;
}
