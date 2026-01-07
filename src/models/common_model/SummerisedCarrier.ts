import { Sequelize, DataTypes, Model} from 'sequelize';

export default function defineSummerisedCarrier(sequelize: Sequelize) {
  class SummerisedCarrier extends Model {
    public region_id!: number;
    public emissions!: number;
    public total_ton_miles!: number;
    public shipments!: string;
    public carrier_name!: string;
    public carrier!: string;
    public data_strength!: string;
    public carrier_logo!: string;
    public quarter!: number;
    public year!: number;
    public division_id!: number;
  }

  SummerisedCarrier.init(
    {
      region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      emissions: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_ton_miles: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      shipments: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carrier_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carrier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data_strength: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carrier_logo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quarter: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      year: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SummerisedCarrier',
      tableName: 'summerised_carriers',
      timestamps: false, // Assuming no createdAt/updatedAt fields
    }
  );


  return SummerisedCarrier;
}
