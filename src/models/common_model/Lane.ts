import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineLaneModel(sequelize: Sequelize) {
  class Lane extends Model {
    public name!: string;
  }

  Lane.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,  // Set to true or false depending on your needs
      },
    },
    {
      sequelize,
      modelName: 'Lane',
      tableName: 'lane',
      timestamps: false,  // Set to true if you need timestamp fields (createdAt/updatedAt)
    }
  );

  return Lane;
}
