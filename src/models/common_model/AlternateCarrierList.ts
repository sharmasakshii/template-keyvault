import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineAlternateFueltypeCarrierModel(sequelize: Sequelize) {
    class AlternateFueltypeCarrier extends Model {
        public name!: string | null;
        public scac!: string | null;
        public image!: string | null;
        public color!: string | null;
    }

    AlternateFueltypeCarrier.init(
        {
            name: {
                type: DataTypes.STRING(250),
                allowNull: true,
            },
            scac: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            color: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "AlternateFueltypeCarrier",
            tableName: "alternate_fueltype_carriers",
            timestamps: false,
        }
    );

    return AlternateFueltypeCarrier;
}
