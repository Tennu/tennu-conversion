var should = require("should");
var Promise = require("bluebird");

var plugin = require('../plugin.js').init();

var toPrivmsg = function(message) {
    return {
        args: message.split(" ")
    };
}

describe('tennu-conversion', function() {

    describe('kinds sub command', function() {
        it('should get kinds.', function() {
            var response = plugin.handlers["!con !convert"](toPrivmsg("kinds"));
            response.message.indexOf("force").should.be.above(-1);
        });

        it('should get units of a specfic kind.', function(done) {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("units force"));
            return responseAsync.then(function(res) {
                res.should.have.property('message');
                res.message.indexOf("newton").should.be.greaterThan(-1);
                done();
            });
        });
    });

    describe('units sub command', function() {
        it('should require a kind', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("units"));
            responseAsync.should.eventually.containEql({
                message: "Invalid kinds. Run `!con kinds` to see the different kinds."
            });
        });

        it('should error gracefully when it cant get units of a fake kind.', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("units fakeunit"));
            responseAsync.should.eventually.containEql({
                message: "Invalid kinds. Run `!con kinds` to see the different kinds."
            });
        });

        it('should get aliases of a specfic unit.', function(done) {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("aliases m"));
            return responseAsync.then(function(res) {
                res.should.have.property('message');
                res.message.indexOf("meter").should.be.greaterThan(-1);
                done();
            });
        });
    });

    describe('aliases sub command', function() {
        it('should error gracefully when it cant get an aliase of a fake unit.', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("aliases fakeunit"));
            responseAsync.should.eventually.containEql({
                message: "Alias not found."
            });
        });

        it('should error gracefully when it cant get an aliase of a missing unit.', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("aliases"));
            responseAsync.should.eventually.containEql({
                message: "Alias not found."
            });
        });
    });

    describe('conversions', function() {

        describe('errors', function() {

            it('should return error notice when invalid action.', function() {
                var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("14 m fakeaction"));
                responseAsync.should.eventually.containEql({
                    message: 'Unable to parse your conversion statement. At minimum a quanity and action is required. `!help convert`'
                });
            });

            it('should return error notice when invalid Qty.', function() {
                var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("14 fakeqty base"));
                responseAsync.should.eventually.containEql({
                    message: 'Unit not recognized'
                });
            });

            it('should return error notice when invalid comparison operator.', function(done) {
                var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("14 m compare-fakeop 10 m"));
                return responseAsync.then(function(res) {
                    res.should.have.property('message');
                    res.message.indexOf('Valid comparison operators are: ').should.be.greaterThan(-1);
                    done()
                });
            });

        });

        it('should toBase.', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("10 cm base"));
            responseAsync.should.eventually.equal('0.1 m');
        });

        it('should inverse.', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("100 m/s inverse"));
            responseAsync.should.eventually.equal('0.01 s/m');
        });

        it('should compare.', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("100 m compare-gt 101 m"));
            responseAsync.should.eventually.equal('false');
        });

        it('should convert.', function() {
            var responseAsync = plugin.handlers["!con !convert"](toPrivmsg("10 feet to meter"));
            responseAsync.should.eventually.equal('3.048 m');
        });
        
    });


});