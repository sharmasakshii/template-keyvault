import { Sequelize, DataTypes, Model } from 'sequelize';


export default function defineEmissionsScope1(sequelize: Sequelize) {
  class EmissionsScope1 extends Model {
    public id!: number;
    public fuel_type!: string;
    public fuel_consumption!: number;
    public emission!: number;
    public year!: number;
    public period!: string | null;
    public created_at!: Date;
    public updated_at!: Date;
  }

  EmissionsScope1.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fuel_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fuel_consumption: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      emission: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      period: {
        type: DataTypes.STRING,
        allowNull: true,
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
    {
      sequelize,
      modelName: 'EmissionsScope1',
      tableName: 'emissions_scope1',
      schema: 'greensight_scope1',
      timestamps: false,
    }
  );



  return EmissionsScope1;
}
