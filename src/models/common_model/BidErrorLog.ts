import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBidErrorLogModel(sequelize: Sequelize) {
  class BidErrorLog extends Model {
    public id!: number;
    public status_id!: number | null;
    public file_id!: number | null;
    public error_code!: string | null;
    public error_message!: string | null;
    public error!: string | null;
    public created_on!: Date;
  }

  BidErrorLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      file_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      error_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('GETDATE'),
      },
    },
    {
      sequelize,
      tableName: 'bid_error_logs',
      modelName: 'BidErrorLog',
      timestamps: false,
    }
  );

  return BidErrorLog;
}
