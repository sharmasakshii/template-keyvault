import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineProfileModel(sequelize: Sequelize) {
    class Profile extends Model {
        public first_name!: string;
        public last_name!: string;
        public user_id!: number;
        public country_code!: string;
        public phone_number!: string;
        public image!: string;
        public title!: string;
        public profile_image_count!: number;
        public updated_by!: number | null;
        public updatedAt!: Date;
        public createdAt?: Date;
    }

    Profile.init(
        {
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            country_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            profile_image_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Profile",
            tableName: "profile",
            timestamps: true, // Includes createdAt and updatedAt by default
        }
    );

    return Profile;
}
