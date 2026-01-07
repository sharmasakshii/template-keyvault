import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineRoleAccessModel(sequelize: Sequelize) {
  class RoleAccess extends Model {
    public role_id!: number;
    public module_id!: number;
    public created_on!: Date;
    public is_deleted!: boolean;
  }

  RoleAccess.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "RoleAccess",
      tableName: "role_access",
      timestamps: false, // No auto-managed `createdAt` or `updatedAt`
    }
  );


  return RoleAccess;
}
