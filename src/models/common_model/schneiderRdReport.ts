import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface SchneiderRDReportAttributes {
id: number;
miles?: number | null;
gallons?: number | null;
bio_gallons?: number | null;
rd_gallons?: number | null;
month?: number | null;
year?: number | null;
is_intermodal: boolean;
}

type SchneiderRDReportCreationAttributes = Optional<
SchneiderRDReportAttributes,
'id' | 'is_intermodal'> ;

export default function defineSchneiderRDReportModel(sequelize: Sequelize) {
class SchneiderRDReport
extends Model<SchneiderRDReportAttributes, SchneiderRDReportCreationAttributes>
implements SchneiderRDReportAttributes
{
public id!: number;
public miles!: number | null;
public gallons!: number | null;
public bio_gallons!: number | null;
public rd_gallons!: number | null;
public month!: number | null;
public year!: number | null;
public is_intermodal!: boolean;
}

SchneiderRDReport.init(
{
id: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true,
},
miles: {
type: DataTypes.FLOAT,
allowNull: true,
},
gallons: {
type: DataTypes.FLOAT,
allowNull: true,
},
bio_gallons: {
type: DataTypes.FLOAT,
allowNull: true,
},
rd_gallons: {
type: DataTypes.FLOAT,
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
is_intermodal: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: false,
},
},
{
sequelize,
modelName: 'SchneiderRDReport',
tableName: 'schneider_rd_report',
timestamps: false,
}
);

return SchneiderRDReport;
}
