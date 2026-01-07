import { Sequelize, DataTypes, Model } from "sequelize";
import { commonFields } from "../commonModelAttributes/comonField";


export default function defineSummerisedFuelTypeModel(sequelize: Sequelize) {
  class SummerisedFuelType extends Model {
    public id!: number;
    public emissions!: string | null;
    public total_ton_miles!: string | null;
    public fuel_type_id!: number | null;
    public quarter!: string | null;
    public year!: string | null;
    public shipments!: string | null;
    public region_id!: number | null;


  }

  SummerisedFuelType.init(
    {
      ...commonFields.trailerFuelVehicle,

      fuel_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SummerisedFuelType",
      tableName: "summerised_fuel_type",
      timestamps: false, // Since the table doesn't have automatic timestamps
    }
  );


  return SummerisedFuelType;
}
