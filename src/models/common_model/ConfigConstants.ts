import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineConfigConstantsModel(sequelize: Sequelize) {
    class ConfigConstants extends Model {
        public config_key!: string;
        public config_value!: string;
        public status!: number;
        public createdAt!: Date;
        public updatedAt!: Date;
    }

    ConfigConstants.init(
        {
            config_key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            config_value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'ConfigConstants',
            tableName: 'config_constants',
            timestamps: true, // Enables automatic `createdAt` and `updatedAt` management.
        }
    );

    return ConfigConstants;
}
