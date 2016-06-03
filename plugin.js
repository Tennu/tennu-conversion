var Qty = require("js-quantities");
var Promise = require("bluebird");
var errors = require("./lib/errors")

const toNoticeResponse = function(msg) {
    noticeResponse.message = msg;
    return noticeResponse;
}

const noticeResponse = {
    intent: 'notice',
    query: true
};

var TennuConversion = {
    init: function(client, imports) {

        const helps = require("./helps.json");

        var router = function(privmsg) {
            var subcommand = privmsg.args[0];

            switch (subcommand) {

                case 'kinds':
                    return processKinds(privmsg);
                    break;
                case 'units':
                    return processUnits(privmsg);
                    break;
                case 'aliases':
                    return getAliases(privmsg);
                    break;
                default:
                    return tryConversion(privmsg);
                    break;

            }
        }

        function processKinds(privmsg) {
            return toNoticeResponse(Qty.getKinds().join(", "));
        }

        function processUnits(privmsg) {
            return Promise.try(function() {

                    if (privmsg.args.length < 2) {
                        throw new errors.missingArgumentError();
                    }

                    var kind = privmsg.args[1];

                    return toNoticeResponse(Qty.getUnits(kind).join(", "));
                })
                .catch(function(err) {
                    return toNoticeResponse("Invalid kinds. Run `!con kinds` to see the different kinds.");
                });
        }

        function getAliases(privmsg) {
            return Promise.try(function() {

                    if (privmsg.args.length < 2) {
                        throw new errors.missingArgumentError();
                    }

                    var alias = privmsg.args[1];

                    return toNoticeResponse(Qty.getAliases(alias).join(", "));
                })
                .catch(function(err) {
                    return toNoticeResponse("Alias not found.");
                });
        }

        function tryConversion(privmsg) {

            return Promise.try(function() {

                    var qtyArgs = /(.+)(to|inverse|base|compare\-\w+)(.*)/.exec(privmsg.args.join(" "));

                    if (qtyArgs === null) {
                        throw new errors.parseConversionError("Unable to parse your conversion statement. At minimum a quanity and action is required. `!help convert`");
                    }

                    var qtyObj = {
                        q1: qtyArgs[1],
                        action: qtyArgs[2],
                        q2: qtyArgs[3] // will be "" when missing.
                    };

                    // If this fails a QtyError is thrown inside the library
                    qtyObj.q1 = new Qty(qtyObj.q1);

                    // Only create a quantity from the second argument if we are comparing
                    if (qtyObj.action.indexOf('compare') > -1 && qtyObj.q2 !== "") {
                        qtyObj.q2 = new Qty(qtyObj.q2);
                        
                        var compareAction = qtyObj.action.split('-');
                        
                        qtyObj.action = compareAction[0];
                        qtyObj.operator = compareAction[1];
                    }

                    switch (qtyObj.action) {
                        case 'to':
                            return qtyObj.q1.to(qtyObj.q2).toString();
                            break;
                        case 'inverse':
                            return qtyObj.q1.inverse().toString();
                            break;
                        case 'base':
                            return qtyObj.q1.toBase().toString();
                            break;
                        case 'compare':
                            return compare(qtyObj);
                            break;
                    }

                })
                .catch(Qty.Error, function(err) {
                    return toNoticeResponse(err.message);
                })
                .catch(errors.conversionError, function(err) {
                    return toNoticeResponse(err.message);
                });

        }

        function compare(qtyObj) {

            var validOperators = ["eq", "same", "lt", "lte", "gt", "gte"];

            if (validOperators.indexOf(qtyObj.operator) === -1) {
                throw new errors.invalidComparisonOperatorError('Valid comparison operators are: ' + validOperators.join(", "));
            }

            return qtyObj.q1[qtyObj.operator](qtyObj.q2).toString();

        }

        return {
            handlers: {
                "!con !convert": router
            },
            help: helps,
            commands: ["con", "convert"]
        }
    }
};

module.exports = TennuConversion;