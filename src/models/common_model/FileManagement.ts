import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFileManagementModel(sequelize: Sequelize) {
    class FileManagement extends Model {
        public id!: number;
        public base_path!: string | null;
        public type!: string | null;
        public User_id!: number | null;
        public status_id!: number | null;
        public created_on!: Date;
        public name!: string | null;
        public updated_on!: Date;
        public last_access!: Date;
        public is_deleted!: number | null;
    }

    FileManagement.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            base_path: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            User_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            status_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_on: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            updated_on: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
            },
            last_access: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
            },
            is_deleted: {
                type: DataTypes.TINYINT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'FileManagement',
            tableName: 'file_management',
            timestamps: false,
            hasTrigger: true,
        }
    );


    return FileManagement;
}
