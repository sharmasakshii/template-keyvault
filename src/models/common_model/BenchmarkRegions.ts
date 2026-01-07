import { DataTypes, Sequelize, Model } from "sequelize";

export default function defineBenchmarkRegionsModel(sequelize: Sequelize) {
    class BenchmarkRegions extends Model {
        public slug!: string;
        public region_name!: string;
    }

    BenchmarkRegions.init(
        {
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            region_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "BenchmarkRegions",
            tableName: "benchmark_regions",
            timestamps: false,
        }
    );

    return BenchmarkRegions;
}
