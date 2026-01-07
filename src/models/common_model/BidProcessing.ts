import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBidProcessingModel(sequelize: Sequelize) {
  class BidProcessing extends Model {
    public id!: number;
    public file_name!: string;
    public start_time!: Date | null;
    public expected_time!: Date | null;
    public end_time!: Date | null;
    public processed_by!: number | null;
    public download_path!: string | null;
    public file_id!: number | null;
  }

  BidProcessing.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expected_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      processed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      download_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'bid_processing',
      modelName: 'BidProcessing',
      timestamps: false,
    }
  );

  return BidProcessing;
}
