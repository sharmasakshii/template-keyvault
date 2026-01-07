import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBusinessUnit(sequelize: Sequelize) {
  class BusinessUnit extends Model {
    public id!: number;
    public name!: string;
    public description!: string | null;
    public sector_id!: number;
    public created_on!: Date;
    public modified_on!: Date | null;

  }

  BusinessUnit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'BusinessUnitScope1',
      tableName: 'business_unit',
      schema: "greensight_scope1",
      timestamps: false,
    }
  );



  return BusinessUnit;
}
