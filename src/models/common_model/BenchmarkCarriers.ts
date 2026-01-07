import { Sequelize, Model } from "sequelize";

export default function defineBenchmarkCarriers(sequelize: Sequelize) {
  class BenchmarkCarriers extends Model {}

  BenchmarkCarriers.init(
    {},
    {
      sequelize,
      modelName: "BenchmarkCarriers",
      tableName: "benchmark_carriers",
      timestamps: false,
    }
  );

  return BenchmarkCarriers;
}
