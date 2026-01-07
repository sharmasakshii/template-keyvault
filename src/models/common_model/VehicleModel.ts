import { Sequelize, Model } from "sequelize";
import { commonFields } from "../commonModelAttributes/comonField";

export default function defineVehicleModel(sequelize: Sequelize) {
  class VehicleModel extends Model {
    public id!: number;
    public uuid!: string | null;
    public name!: string | null;
    public description!: string | null;
    public created_on!: Date | null;
    public created_by!: number | null;
    public modified_on!: Date | null;
    public modified_by!: number | null;
    public is_deleted!: boolean | null;
  }


  VehicleModel.init(
    {
      ...commonFields.admComon
    },
    {
      sequelize,
      modelName: "VehicleModel",
      tableName: "vehicle_model",
      timestamps: false, // Since the table doesn't have automatic timestamps
    }
  );

  return VehicleModel;
}
