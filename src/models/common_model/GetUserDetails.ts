import { Sequelize, DataTypes, Model } from 'sequelize';
import { isCompanyEnable } from '../../utils';
import { comapnyDbAlias } from '../../constant';

export default function defineGetUserDetailsModel(sequelize: Sequelize, db:any) {
    class GetUserDetails extends Model {
        public user_id!: number;
        public user_name!: string;
        public user_email!: string;
        public user_status!: number;
        public user_createdAt!: Date;
        public user_updatedAt!: Date;
        public user_login_count!: number;
        public user_role!: number;
        public user_region_id!: number;
        public user_is_blocked!: number;
        public user_blocked_time!: number;
        public user_blocked_on!: Date;
        public user_is_deleted!: boolean;
        public user_updated_by!: number;
        public profile_id!: number;
        public p_phone_number!: number;
        public p_first_name!: string;
        public p_last_name!: string;
        public p_country_code!: string;
        public p_image!: string;
        public p_title!: string;
        public p_profile_image_count!: number;
        public c_id!: number;
        public c_name!: string;
        public c_db_alias!: string;
        public c_logo!: string;
        public c_slug!: string;
        public c_status!: boolean;
        public user_division_id?: number;
    }
 
    let userDetailsFields:any = {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        user_updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        user_login_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_role: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_region_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_is_blocked: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_blocked_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_blocked_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        user_is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        user_updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        p_phone_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        p_first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        p_last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        p_country_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        p_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        p_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        p_profile_image_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        c_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        c_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        c_db_alias: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        c_logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        c_slug: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        c_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    }
 
    if(isCompanyEnable(db, [comapnyDbAlias.PEP])){
        userDetailsFields.user_division_id = { type: DataTypes.INTEGER };
    }

    GetUserDetails.init(
        userDetailsFields,
        {
            sequelize,
            modelName: 'GetUserDetails',
            tableName: 'getuserdetails',
            timestamps: false, // Disable timestamps
        }
    );


    return GetUserDetails;
}
