import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineProjectInviteModel(sequelize: Sequelize) {
  class ProjectInvite extends Model {
    public project_invite_id!: number;
    public project_id!: number;
    public user_id!: number;
    public created_on!: Date;
    public updated_on!: Date;
  }

  ProjectInvite.init(
    {
      project_invite_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ProjectInvite",
      tableName: "project_invite",
      timestamps: true,
      createdAt: "created_on",
      updatedAt: "updated_on",
    }
  );


  return ProjectInvite;
}
