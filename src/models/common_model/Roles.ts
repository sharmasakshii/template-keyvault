import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineRolesModel(sequelize: Sequelize) {
    class Roles extends Model {
        public name!: string;
        public description!: string;
        public status!: number;
        public created_by!: number;
        public is_deleted!: boolean;
        public createdAt!: Date;
        public updatedAt!: Date;
    }

    Roles.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Roles",
            tableName: "roles",
            timestamps: true, // Automatically manages createdAt and updatedAt fields
        }
    );

    return Roles;
}
