import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineScopeModel(sequelize: Sequelize) {
    class Scope extends Model {
        public id!: number;
        public name!: string | null;
        public code!: string | null;
    }

    Scope.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            code: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Scope',
            tableName: 'scope',
            timestamps: false,
        }
    );

    return Scope;
}
