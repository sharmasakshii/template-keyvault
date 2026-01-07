import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineTimeMapping(sequelize: Sequelize) {
  class TimeMapping extends Model {
    public id!: number;
    public name!: string;
    public year!: number;
    public quarter!: number;
    public month!: number;
    public start_date!: Date;
    public end_date!: Date;
    public period_id!: number;
  }

  TimeMapping.init(
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
      quarter: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      period_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'TimeMapping',
      tableName: 'time_mapping',
      timestamps: false,  // No createdAt/updatedAt fields
    }
  );


  return TimeMapping;
}
