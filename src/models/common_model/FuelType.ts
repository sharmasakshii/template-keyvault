import {  Model, DataTypes } from "sequelize";
import { commonFields } from "../commonModelAttributes/comonField";

export default function defineFuelTypeModel(sequelize: any, dbName: string) {
  class FuelType extends Model {
  }
  let attributes: any = dbName === "adm" ? {
    ...commonFields.admComon
  } : {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    constant: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }
  FuelType.init(
    attributes,
    {
      sequelize,
      modelName: "FuelType",
      tableName: "fuel_type",
      schema:( dbName === "pepsi" ||  dbName === "generic")? "greensight_scope1" : sequelize.options.schema,
      timestamps: false, // Since the table doesn't have automatic timestamps
    }
  );

  return FuelType;
}
