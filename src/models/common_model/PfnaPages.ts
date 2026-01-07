import { Sequelize, DataTypes, Model } from 'sequelize';

export default function definePfnaPagesModel(sequelize: Sequelize) {
  class PfnaPages extends Model {
    public id!: number;
    public name!: string;
    public slug!: string;
    public created_at!: Date;
    public is_deleted!: boolean;
  }

  PfnaPages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'PfnaPages',
      tableName: 'pfna_pages',
      schema: 'greensight_scope1',
      timestamps: false, // Set to true if createdAt/updatedAt are needed
    }
  );

  return PfnaPages;
}
