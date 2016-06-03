var createError = require("create-error");

var missingArgumentError = createError('missingArgumentError');

var conversionError = createError('conversionError');

    var parseConversionError = createError(conversionError, 'parseConversionError');

    var invalidComparisonOperatorError = createError(conversionError, 'invalidComparisonOperatorError');

module.exports = {
    missingArgumentError: missingArgumentError,
    
    conversionError: conversionError,
        parseConversionError: parseConversionError,
        invalidComparisonOperatorError: invalidComparisonOperatorError
};