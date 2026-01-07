import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineTimePeriod(sequelize: Sequelize) {
  class TimePeriod extends Model {
    public id!: number;
    public name!: string;
    public year!: number;
    public quarter!: number;
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
      modelName: 'TimePeriod',
      tableName: 'time_period',
      timestamps: false,  // No createdAt/updatedAt fields
    }
  );



  return TimePeriod;
}
