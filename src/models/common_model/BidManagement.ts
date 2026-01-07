import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBidManagementModel(sequelize: Sequelize) {
  class BidManagement extends Model {
    public id!: number;
    public name!: string;
    public user_id!: number;
    public type!: string;
    public status_id!: number;
    public is_deleted!: number;
    public base_path!: string;
    public created_on!: Date;
    public updated_on!: Date;
  }

  BidManagement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      base_path: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('GETDATE'),
      },
      updated_on: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('GETDATE'),
      },
    },
    {
      sequelize,
      tableName: 'bid_management',
      modelName: 'BidManagement',
      timestamps: false,
    }
  );

  return BidManagement;
}