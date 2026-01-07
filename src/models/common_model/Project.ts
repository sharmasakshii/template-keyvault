import { Sequelize, DataTypes, Model } from 'sequelize';
import { isCompanyEnable } from '../../utils';
import { comapnyDbAlias } from '../../constant';

export default function defineProjectModel(sequelize: Sequelize, db?: any) {
  class Project extends Model {
    public project_unique_id!: string;
    public manager_id!: number;
    public project_name!: string;
    public start_date!: Date;
    public end_date!: Date;
    public desc!: string;
    public status!: boolean;
    public type!: 'alternative_fuel' | 'modal_shift' | 'carrier_shift';
    public is_deleted!: number;
    public lane_id!: number;
    public recommendation_id!: number;
    public region_id!: number;
    public division_id?: number;
    public product_type_code!: string;
    public carrier_code!: string;
    public is_alternative!: boolean;
    public is_ev!: boolean;
    public is_rd!: boolean;
    public fuel_type!: string;
    public bio_1_20_radius!: number;
    public ev_radius!: number;
    public rd_radius!: number;
    public bio_21_100_radius!: number;
    public optimus_radius!: number;
    public rng_radius!: number;
    public hydrogen_radius!: number;
    public hvo_radius!: number;
    public b99_radius?: number;
  }

  let projectFields:any = {
    project_unique_id: {
      type: DataTypes.STRING,
    },
    manager_id: {
      type: DataTypes.INTEGER,
    },
    project_name: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    type: {
      type: DataTypes.ENUM('alternative_fuel', 'modal_shift', 'carrier_shift'),
    },
    is_deleted: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    lane_id: {
      type: DataTypes.INTEGER,
    },
    recommendation_id: {
      type: DataTypes.INTEGER,
    },
    region_id: {
      type: DataTypes.INTEGER,
    },
    product_type_code: {
      type: DataTypes.STRING,
    },
    carrier_code: {
      type: DataTypes.STRING,
    },
    is_alternative: {
      type: DataTypes.BOOLEAN,
    },
    is_ev: {
      type: DataTypes.BOOLEAN,
    },
    is_rd: {
      type: DataTypes.BOOLEAN,
    },
    fuel_type: {
      type: DataTypes.STRING,
    },
    bio_1_20_radius: {
      type: DataTypes.INTEGER,
    },
    ev_radius: {
      type: DataTypes.INTEGER,
    },
    rd_radius: {
      type: DataTypes.INTEGER,
    },
    bio_100_radius: {
      type: DataTypes.INTEGER,
    },
    bio_21_99_radius: {
      type: DataTypes.INTEGER,
    },
    optimus_radius: {
      type: DataTypes.INTEGER,
    },
    rng_radius: {
      type: DataTypes.INTEGER,
    },
    hydrogen_radius: {
      type: DataTypes.INTEGER,
    },
    hvo_radius: {
      type: DataTypes.INTEGER,
    },
    threshold_distance: {
      type: DataTypes.INTEGER,
    }
  };

  if(isCompanyEnable(db, [comapnyDbAlias.GEN])){
    projectFields.b99_radius = { type: DataTypes.INTEGER };
  }

  if(isCompanyEnable(db, [comapnyDbAlias.PEP, comapnyDbAlias.GEN])){
    projectFields.division_id = { type: DataTypes.INTEGER };
  }

  Project.init(
    projectFields,

  {
    sequelize,
      modelName: 'Project',
        tableName: 'projects',
    }
  );

  return Project;
}
