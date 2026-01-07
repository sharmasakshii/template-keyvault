import { Sequelize, DataTypes, Model } from 'sequelize';


export default function defineEmissionsChevron(sequelize: Sequelize) {
  class EmissionsChevron extends Model {
    public id!: number;
    public location_id!: number | null;
    public fuel_id!: number | null;
    public country_id!: number | null;
    public sector_id!: number | null;
    public bu_id!: number | null;
    public fuel_consumption!: number | null;
    public fuel_sub_type_id!: string | null;
    public month!: number | null;
    public year!: number | null;
    public created_on!: Date | null;
    public modified_on!: Date | null;
  }

  EmissionsChevron.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sector_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bu_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fuel_consumption: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fuel_sub_type_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'EmissionsChevron',
      tableName: 'emissions_chevron',
      schema: 'greensight_scope1',
      timestamps: false,
    }
  );



  return EmissionsChevron;
}
