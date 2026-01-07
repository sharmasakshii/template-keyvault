import { Sequelize, DataTypes, Model } from 'sequelize';
import { isCompanyEnable } from '../../utils';
import { comapnyDbAlias } from '../../constant';

export default function defineBidImportModel(sequelize: Sequelize, db?: any) {
  class BidImport extends Model {
    public id!: number;
    public lane_name!: string;
    public scac!: string;
    public rpm!: number;
    public distance!: number;
    public intensity!: number;
    public emissions!: number;
    public cost_impact!: number;
    public emission_impact!: number;
    public file_name!: string;
    public tab_name!: string;
    public is_error!: number;
    public error_message!: string;
    public file_id!: number;
    public fuel_type!: string;
    public row_number!: number;
  }

  let bidImportFields:any = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lane_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scac: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rpm: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    distance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    intensity: {
      type: DataTypes.DECIMAL(35, 15),
      allowNull: false,
    },
    emissions: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cost_impact: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    emission_impact: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tab_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_error: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    error_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fuel_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    row_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }
  
  if(isCompanyEnable(db, [comapnyDbAlias.LW])){
    bidImportFields.volume = { type: DataTypes.INTEGER };
  }

  BidImport.init( 
    bidImportFields,
    {
      sequelize,
      tableName: 'bid_import',
      modelName: 'BidImport',
      timestamps: false,
    }
  );

  return BidImport;
}
