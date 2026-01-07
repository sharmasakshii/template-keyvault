import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineModule(sequelize: Sequelize) {
  class Module extends Model {
    public title!: string | null;
    public parent_id!: number | null;
    public is_deleted!: boolean | null;
    public slug!: string | null;
  }

  Module.init(
    {
      title: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Module',
      tableName: 'module',
      timestamps: false, // No createdAt/updatedAt fields
    }
  );

  return Module;
}
