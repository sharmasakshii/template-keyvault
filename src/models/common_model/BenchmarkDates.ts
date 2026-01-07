import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBenchmarkDatesModel(sequelize: Sequelize) {
    class BenchmarkDates extends Model {
        public max_date!: Date;
        public min_date!: Date;
        public average_intensity!: number | null;
    }

    BenchmarkDates.init(
        {
            max_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            min_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            average_intensity: {
                type: DataTypes.DECIMAL(35, 10),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'benchmark_dates',
            modelName: 'BenchmarkDates',
            timestamps: false,
        }
    );

    return BenchmarkDates;
}
