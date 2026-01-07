import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCmsPagesModel(sequelize: Sequelize) {
    class CmsPages extends Model {
        public page_slug!: string;
        public content!: string;
    }

    CmsPages.init(
        {
            page_slug: {
                type: DataTypes.STRING,
                allowNull: false, // Assuming page_slug is a required field
            },
            content: {
                type: DataTypes.STRING,
                allowNull: true, // Assuming content can be null
            },
        },
        {
            sequelize,
            modelName: 'CmsPages',
            tableName: 'CMS_pages',
            timestamps: false, // Disable timestamps if needed
        }
    );

    return CmsPages;
}
