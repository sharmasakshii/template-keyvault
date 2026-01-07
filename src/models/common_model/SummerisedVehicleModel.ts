import { Sequelize, DataTypes, Model } from "sequelize";
import { commonFields } from "../commonModelAttributes/comonField";


export default function defineSummerisedVehicleModel(sequelize: Sequelize) {
  class SummerisedVehicleModel extends Model {
    public id!: number;
    public emissions!: string | null;
    public total_ton_miles!: string | null;
    public vehicle_model_id!: number | null;
    public quarter!: string | null;
    public year!: string | null;
    public shipments!: string | null;
    public region_id!: number | null;

  }

  SummerisedVehicleModel.init(
    {
      ...commonFields.trailerFuelVehicle,

      vehicle_model_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },



    {
      sequelize,
      modelName: "SummerisedVehicleModel",
      tableName: "summerised_vehicle_model",
      timestamps: false, // Since the table doesn't have automatic timestamps
    }
  );



  return SummerisedVehicleModel;
}
