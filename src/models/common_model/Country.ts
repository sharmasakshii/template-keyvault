import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCountry(sequelize: Sequelize) {
  class Country extends Model {
    public id!: number;
    public name!: string;
    public code!: string;
    public created_on!: Date;
    public modified_on!: Date | null;
  }

  Country.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      country_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Country',
      tableName: 'country',
      timestamps: false,
    }
  );

  return Country;
}
