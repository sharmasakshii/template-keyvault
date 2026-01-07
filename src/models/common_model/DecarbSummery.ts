import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineDecarbSummery(sequelize: Sequelize) {
  class DecarbSummery extends Model {
    public region_id!: number;
    public emissions!: number;
    public total_ton_miles!: number;
    public emission_intensity!: number;
    public avg_emission!: number;
    public standard_deviation!: number;
    public compare_factor!: number;
    public priority!: string;
    public color!: string;
    public lane_count!: number;
    public carrier_count!: number;
    public factor!: number;
    public operator!: string;
    public status!: boolean;
  }

  DecarbSummery.init(
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
      emission_intensity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      avg_emission: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      standard_deviation: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      compare_factor: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lane_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carrier_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      factor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      operator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DecarbSummery',
      tableName: 'decarb_summary',
      timestamps: false, // No timestamps columns (createdAt, updatedAt)
    }
  );


  return DecarbSummery;
}
