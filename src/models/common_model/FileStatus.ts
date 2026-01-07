import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFileStatusModel(sequelize: Sequelize) {
    class FileStatus extends Model {
        public id!: number;
        public status_code!: string | null;
        public created_on!: Date | null;
        public updated_on!: Date | null;
    }

    FileStatus.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            status_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_on: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'), // Use GETDATE() as default
                allowNull: true,
            },
            updated_on: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'FileStatus',
            tableName: 'file_status',
            timestamps: false,
            hasTrigger: true,
        }
    );

    return FileStatus;
}
