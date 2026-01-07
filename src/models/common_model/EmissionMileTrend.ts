import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineEmissionMileTrendModel(sequelize: Sequelize) {
  class EmissionMileTrend extends Model {
    public id!: number;
  }

  EmissionMileTrend.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      tableName: 'emission_mile_trend',
      modelName: 'EmissionMileTrend',
      timestamps: false,
    }
  );

  return EmissionMileTrend;
}
