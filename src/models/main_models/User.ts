import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineUserModel(sequelize: Sequelize) {
 

    class User extends Model {
        public name!: string;
        public email!: string;
        public password!: string;
        public role!: number;
        public status!: number;
        public login_count!: number;
        public region_id!: number;
        public is_blocked!: number;
        public blocked_time!: number | null;
        public blocked_on!: Date | null;
        public is_deleted!: boolean | null;
        public updated_by!: number | null;
        public last_logged_in!: Date | null;
        public chatbot_access!: boolean | null;
        public createdAt!: Date;
        public division_id!: number;
    }

    User.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.INTEGER,
                comment: '0 => substain login, 1 => region login',
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                comment: 'login count of user',
                allowNull: false,
            },
            login_count: {
                type: DataTypes.INTEGER,
                comment: 'login count of user',
                allowNull: false,
            },
            region_id: {
                type: DataTypes.INTEGER,
                comment: 'Region id of the user.',
                allowNull: true,
            },
            division_id: {
                type: DataTypes.INTEGER,
                comment: 'Region id of the user.',
                allowNull: true,
            },
            is_blocked: {
                type: DataTypes.INTEGER,
                comment: '0 => not blocked, 1 => blocked',
                allowNull: false,
                defaultValue: 0,
            },
            blocked_time: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            blocked_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
            
            last_logged_in: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            chatbot_access: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: false,
            hasTrigger: true,
        }
    );
   

    return User;
}
