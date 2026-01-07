import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineSmartwaydataRanking(sequelize: Sequelize) {
  class SmartwaydataRanking extends Model {
    public carrier_name!: string;
    public carrier_code!: string;
    public year!: number;
    public ranking!: number;
  }

  SmartwaydataRanking.init(
    {
      carrier_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carrier_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ranking: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'smartdataRanking',
      tableName: 'smartdata_ranking',
      timestamps: false, // Assuming no timestamps for this table
    }
  );



  return SmartwaydataRanking;
}
