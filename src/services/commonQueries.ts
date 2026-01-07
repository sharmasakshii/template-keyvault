import { Sequelize } from 'sequelize';

// Function to get the max month from the database for a given year
export async function getMaxMonthOfYear(companyModels:any, tableName: string, year: string | number): Promise<number | null> {
    try {
        const result = await companyModels[tableName].findAll({
            attributes: [[Sequelize.fn('MAX', Sequelize.col('month')), 'month']],
            where: { year: year },
            raw: true
        });
        // If result is not empty, return the maximum month, otherwise return null
        if (result && result.length > 0) {
            return result[0].month;
        } else {
            return null; // No data found for the given year
        }
    } catch (error) {
        console.error('Error fetching max month:', error);
        throw error; // Optionally handle the error based on your needs
    }
}