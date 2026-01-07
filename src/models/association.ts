

const associationList = require('../../associationList.json');

export const associations = (() => {

    return {
        main_models: associationList["main_model"],
        common_model: associationList["common_model"],
    };
})();