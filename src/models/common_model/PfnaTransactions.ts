import { Sequelize, DataTypes, Model } from "sequelize";

export default function definePfnaTransactionsModel(sequelize: Sequelize) {
    class PfnaTransactions extends Model {
        public id!: number;
        public parent_slug!: string | null;
        public fuel_type_id!: number | null;
        public gallons!: number | null;
        public emissions!: number | null;
        public year!: number | null;
        public period_id!: number | null;
        public supplier!: string | null;
        public location_id!: number | null;
        public date!: Date | null;
        public invoice!: string | null;
    }

    PfnaTransactions.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            parent_slug: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            fuel_type_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            gallons: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            emissions: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            period_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            supplier: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            location_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            invoice:{
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "PfnaTransactions",
            tableName: "pfna_transactions",
            schema: 'greensight_scope1',
            timestamps: false,
        }
    );

    return PfnaTransactions;
}
