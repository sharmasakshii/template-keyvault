import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineDatByLane(sequelize: Sequelize) {
  class DatByLane extends Model {
    public id!: number;
    public uuid!: string;
    public lane_name!: string | null;
    public created_on!: Date | null;
    public created_by!: number | null;
    public modified_on!: Date | null;
    public modified_by!: number | null;
    public is_deleted!: number | null;
    public dollar_per_mile!: number | null;
  }

  DatByLane.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      lane_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      dollar_per_mile: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'DatByLane',
      tableName: 'dat_by_lane',
      timestamps: false, // No createdAt/updatedAt fields
    }
  );

  return DatByLane;
}
