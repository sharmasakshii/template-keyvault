import { Sequelize, DataTypes, Model } from 'sequelize';


export default function defineEmissionsPPP(sequelize: Sequelize) {
  class EmissionsPPP extends Model {
    public id!: number;
    public bu_id!: number;
    public fuel_id!: number;
    public fuel_consumption!: number;
    public period!: string;
    public sector_id!: number;
    public year!: number;
  }

  EmissionsPPP.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      bu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuel_consumption: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      period: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      sector_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EmissionsPPP',
      tableName: 'emissions_ppp',
      schema: 'greensight_scope1',
      timestamps: false, // No timestamps columns (createdAt, updatedAt)
    }
  );

  // Define associations
 

  return EmissionsPPP;
}
