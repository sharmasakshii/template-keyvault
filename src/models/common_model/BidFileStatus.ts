import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBidFileStatusModel(sequelize: Sequelize) {
  class BidFileStatus extends Model {
    public id!: number;
    public status_code!: string | null;
    public created_on!: Date | null;
    public updated_on!: Date | null;
    public status_name!: string | null;
    public is_deleted!: number | null;
  }

  BidFileStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'bid_file_status',
      modelName: 'BidFileStatus',
      timestamps: false,
    }
  );

  return BidFileStatus;
}
