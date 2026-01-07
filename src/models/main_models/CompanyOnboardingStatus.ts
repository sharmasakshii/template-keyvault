import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCompanyOnboardingStatusModel(sequelize: Sequelize) {
    class CompanyOnboardingStatus extends Model {
        public scope_id!: number | null;
        public company_id!: number | null;
        public is_onboarded!: boolean;
        public created_on!: Date;
        public updated_on!: Date;

        // Optional association property
        // public scope?: ReturnType<typeof defineScopeModel>;
    }

    CompanyOnboardingStatus.init(
        {
            scope_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            is_onboarded: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_on: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'CompanyOnboardingStatus',
            tableName: 'company_onboarding_status',
            timestamps: false, // As defined in the original code
        }
    );

    return CompanyOnboardingStatus;
}
