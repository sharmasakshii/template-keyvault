import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineRoutePointModel(sequelize: Sequelize) {
class RoutePoint extends Model {
public id!: number;
public uuid!: string;
public route_point_type_id!: number;
public name!: string;
public latitude!: number;
public longitude!: number;
public address_line_1!: string;
public city!: string;
public state_abbr!: string;
public postal_code!: string;
public country!: string;
public created_on!: Date;
public created_by!: string;
public modified_on!: Date;
public modified_by!: string;
public is_deleted!: boolean;
public is_new!: boolean;
}

RoutePoint.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        route_point_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        address_line_1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state_abbr: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        modified_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        modified_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_new: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "RoutePoint",
        tableName: "route_point",
        timestamps: false, 
    }
);

return RoutePoint;

}
