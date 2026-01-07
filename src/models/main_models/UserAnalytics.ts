import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineUserAnalyticsModel(sequelize: Sequelize) {
    class UserAnalytics extends Model {
        public user_id!: number;
        public action!: string;
        public name!: string;
        public action_url!: string;
        public client_ip!: string;
    }

    UserAnalytics.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            action: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            action_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            client_ip: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'UserAnalytics',
            tableName: 'user_analytics',
            timestamps: false,
        }
    );


    return UserAnalytics;
}
