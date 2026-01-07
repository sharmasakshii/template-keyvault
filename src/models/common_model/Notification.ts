import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineNotificationModel(sequelize: Sequelize) {
  class Notification extends Model {
    public id!: number;
    public sender_id!: number | null;
    public receiver_id!: number | null;
    public description!: string | null;
    public type!: string | null;
    public is_read!: boolean | null;
    public is_deleted!: boolean | null;
    public created_on!: Date;
    public updated_on!: Date;
  }

  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('GETDATE'),
      },
      updated_on: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('GETDATE'),
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notification',
      timestamps: true,
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    }
  );

  return Notification;
}
