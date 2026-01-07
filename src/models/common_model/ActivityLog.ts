import { Sequelize, DataTypes, Model } from 'sequelize';
import FileManagement from './FileManagement'; // Correct the import if needed
import FileStatus from './FileStatus'; // Correct the import if needed

export default function defineActivityLogModel(sequelize: Sequelize) {
    class ActivityLog extends Model {
        public id!: number;
        public status_id!: number;
        public file_management_id!: number;
        public created_on!: Date;
        public updated_on!: Date;
    }

    ActivityLog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            status_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            file_management_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_on: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
                allowNull: false,
            },
            updated_on: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'ActivityLog',
            tableName: 'activity_log',
            timestamps: false,
        }
    );

  

    return ActivityLog;
}
