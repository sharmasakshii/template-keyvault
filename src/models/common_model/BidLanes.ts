import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBidLanesModel(sequelize: Sequelize) {
  class BidLanes extends Model {
    public id!: number;
    public lane_name!: string | null;
    public distance!: number | null;
    public fuel_type!: string;
    public file_id!: number;
    public is_processed!: number;
    public is_error!: number;
  }

  BidLanes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lane_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      fuel_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_processed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_error: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'bid_lanes',
      modelName: 'BidLanes',
      timestamps: false,
    }
  );

  return BidLanes;
}
