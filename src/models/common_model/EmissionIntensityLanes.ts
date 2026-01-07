import { Sequelize, Model } from "sequelize";

export default function defineEmissionIntensityLanes(sequelize: Sequelize) {
    class EmissionIntensityLanes extends Model {}

    EmissionIntensityLanes.init(
        {},
        {
          sequelize,
          modelName: 'EmissionIntensityLanes',
          tableName: 'emission_intensity_lanes',
          timestamps: false,
        }
  );


  return EmissionIntensityLanes;
}
