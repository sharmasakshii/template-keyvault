import { Sequelize, DataTypes, Model } from "sequelize";


export default function defineRegionModel(sequelize: Sequelize) {

    class Region extends Model {
        public user_id!: number;
        public name!: string;
        public region!: number;
        public status!: boolean;
    
    }

    Region.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            region: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: "Region",
            tableName: "regions",
        }
    );



    return Region;
}


