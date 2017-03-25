var expect = chai.expect;

describe('Processing the arguments', function() {
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        sandbox.stub(Logger, "useDefaults");
        sandbox.stub(Logger, "debug");
        sandbox.stub(Logger, "info");
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('has default arguments', function() {
        var clock = new BetterClock({});
        expect(clock.args).to.have.property('longitude', 0);
        expect(clock.args).to.have.property('latitude', 0);
        expect(clock.args).to.have.property('wakeupAt', 630);
        expect(clock.args).to.have.property('sleepAt', 2230);
    });

    it('fails if longitude is not within -90 <-> +90', function() {
        expect(() => new BetterClock({ longitude: 91 })).to.throw('Longitude exceeds limits [-90,90]');
        expect(() => new BetterClock({ longitude: -91 })).to.throw('Longitude exceeds limits [-90,90]');
    });

});