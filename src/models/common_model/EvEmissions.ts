import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineEvEmissions(sequelize: Sequelize) {
  class EvEmissions extends Model {
    public order_id!: string | null;
    public asset_id!: string | null;
    public name!: string | null;
    public origin!: string | null;
    public destination!: string | null;
    public standard_emission!: number | null;
    public standard_intensity!: number | null;
    public sni_emission!: number | null;
    public sni_intensity!: number | null;
    public ev_emission!: number | null;
    public ev_intensity!: number | null;
    public total_ton_miles!: number | null;
    public loaded_ton_miles!: number | null;
    public shipment!: string | null;
    public shipment_weight!: string | null;
    public platform_mode!: string | null;
    public calculation_accuracy!: string | null;
    public is_bev!: string | null;
    public scac!: string | null;
    public date!: Date | null;
    public status!: number | null;
    public createdAt!: Date | null;
    public updatedAt!: Date | null;
  }

  EvEmissions.init(
    {
      order_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      asset_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      standard_emission: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      standard_intensity: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      sni_emission: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      sni_intensity: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      ev_emission: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      ev_intensity: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      total_ton_miles: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      loaded_ton_miles: {
        type: DataTypes.DECIMAL(35, 15),
        allowNull: true,
      },
      shipment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shipment_weight: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      platform_mode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      calculation_accuracy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_bev: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      scac: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'EvEmissions',
      tableName: 'ev_emissions',
      schema: 'greensight_pepsi',
      timestamps: true, // If the table has createdAt and updatedAt columns
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  return EvEmissions;
}
