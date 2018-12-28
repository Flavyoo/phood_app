'use strict';

module.exports = async function(ctx, validator, successFunction) {
    const validateResult = validator(ctx.request);

    if (validateResult) {
        ctx.body = {errors: validateResult};
        ctx['status'] = 400;
    } else {
        await successFunction();
    }
};