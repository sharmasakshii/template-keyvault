import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineTimePeriodScope1(sequelize: Sequelize) {
  class TimePeriod extends Model {
    public id!: number;
    public name!: string;
    public year!: number;
  }

  TimePeriod.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'TimePeriodScope1',
      tableName: 'time_period',
      schema: 'greensight_scope1', // Specify the schema
      timestamps: false, // Since there are no createdAt/updatedAt fields
    }
  );

  return TimePeriod;
}
