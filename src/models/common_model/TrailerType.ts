import { Sequelize, Model } from 'sequelize';
import { commonFields } from '../commonModelAttributes/comonField';

export default function defineTrailerType(sequelize: Sequelize) {
  class TrailerType extends Model {
    public id!: number;
    public uuid!: string;
    public name!: string;
    public description!: string;
    public created_on!: Date;
    public created_by!: number;
    public modified_on!: Date;
    public modified_by!: number;
    public is_deleted!: boolean;
  }

  TrailerType.init(
    {
      ...commonFields.admComon
    },
    {
      sequelize,
      modelName: 'TrailerType',
      tableName: 'trailer_type',
      timestamps: false, // Since there are no automatic timestamps
    }
  );

  return TrailerType;
}
