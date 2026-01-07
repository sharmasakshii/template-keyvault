import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineProjectFeedbackModel(sequelize: Sequelize) {
  class ProjectFeedback extends Model {
    public project_id!: number;
    public user_id!: number;
    public rating!: number;
    public desc!: string;
    public status!: boolean;
  }

  ProjectFeedback.init(
    {
      project_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      desc: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'ProjectFeedback',
      tableName: 'project_feedbacks',
    }
  );

  return ProjectFeedback;
}
