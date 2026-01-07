import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineEvCarriers(sequelize: Sequelize) {
  class EvCarriers extends Model {
    public name!: string | null;
    public scac!: string | null;
    public image!: string | null;
    public color!: string | null;
  }

  EvCarriers.init(
    {
      name: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      scac: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'EvCarriers',
      tableName: 'ev_carriers',
      schema: 'greensight_pepsi',
      timestamps: false,
    }
  );
  return EvCarriers;
}
