import { DataTypes } from "sequelize";

export const commonFields = {

    commonCarrierEmission: {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emissions: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total_ton_miles: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        carrier_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carrier: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quarter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shipments: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        year: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        region_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    admComon: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_by: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },
        modified_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        modified_by: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },
    },
    productType: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: false,
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
        impact_fraction: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        cost_premium_const: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    trailerFuelVehicle: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        emissions: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        total_ton_miles: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        quarter: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        year: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        shipments: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        region_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },

};