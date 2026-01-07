import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCarrierTypeModel(sequelize: Sequelize) {
    class CarrierType extends Model {
        public id!: number;
        public name!: string;
        public created_at!: Date;
        public updated_at!: Date;
    }

    CarrierType.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
                allowNull: false,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('GETDATE'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'CarrierType',
            tableName: 'carrier_type',
            schema: 'greensight_brambles',
            timestamps: false,
        }
    );

    return CarrierType;
}
