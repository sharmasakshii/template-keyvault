import { Sequelize, DataTypes, Model } from 'sequelize';
import { commonFields } from '../commonModelAttributes/comonField';

export default function defineSummerisedTrailerType(sequelize: Sequelize) {
  class SummerisedTrailerType extends Model {
    public id!: number;
    public emissions!: string;
    public total_ton_miles!: string;
    public trailer_type_id!: number;
    public quarter!: string;
    public year!: string;
    public shipments!: string;
    public region_id!: number;
  }

  SummerisedTrailerType.init(
    {
      ...commonFields.trailerFuelVehicle,


      trailer_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SummerisedTrailerType',
      tableName: 'summerised_trailer_type',
      timestamps: false, // No automatic createdAt/updatedAt fields
    }
  );



  return SummerisedTrailerType;
}
