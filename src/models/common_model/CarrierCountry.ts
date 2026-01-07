import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCarrierCountries(sequelize: Sequelize) {
  class CarrierCountry extends Model {
    public carrier_scac!: string;
    public country_code!: string;
    public scac_priority!: boolean | null;
    public created_at!: Date | null;
    public is_deleted!: boolean | null;
  }

  CarrierCountry.init(
    {
      carrier_scac: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      country_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      scac_priority: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('GETDATE()'), // Default to current timestamp
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'CarrierCountry',
      tableName: 'carrier_countries',
      timestamps: false, // No explicit `createdAt` or `updatedAt`
    }
  );

  return CarrierCountry;
}
