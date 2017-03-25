var expect = chai.expect;

describe('Validate arguments', function() {
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

    it('throws error if longitude is not within -90 <-> +90', function() {
        expect(() => new BetterClock({ longitude: 91 })).to.throw('Longitude exceeds limits [-90,90]');
        expect(() => new BetterClock({ longitude: -91 })).to.throw('Longitude exceeds limits [-90,90]');
    });

    it('throws error if latitude is not within -90 <-> +90', function() {
        expect(() => new BetterClock({ latitude: 91 })).to.throw('Latitude exceeds limits [-90,90]');
        expect(() => new BetterClock({ latitude: -91 })).to.throw('Latitude exceeds limits [-90,90]');
    });

    it('throws error if wakeupAt is not within 0 <-> 2359', function() {
        expect(() => new BetterClock({ wakeupAt: -1 })).to.throw('WakeupAt not in 24h time range [0 - 2359]');
        expect(() => new BetterClock({ wakeupAt: 2360 })).to.throw('WakeupAt not in 24h time range [0 - 2359]');
    });

    it('throws error if wakeupAt time minutes exceed 59 (there is no such time as 01:60)', function() {
        expect(() => new BetterClock({ wakeupAt: 160 })).to.throw('WakeupAt contains too many minutes');
        expect(() => new BetterClock({ wakeupAt: 2275 })).to.throw('WakeupAt contains too many minutes');
    });

    it('throws error if sleepAt is not within 0 <-> 2359', function() {
        expect(() => new BetterClock({ sleepAt: -1 })).to.throw('SleepAt not in 24h time range [0 - 2359]');
        expect(() => new BetterClock({ sleepAt: 2360 })).to.throw('SleepAt not in 24h time range [0 - 2359]');
    });

    it('throws error if sleepAt time minutes exceed 59 (there is no such time as 01:60)', function() {
        expect(() => new BetterClock({ sleepAt: 160 })).to.throw('SleepAt contains too many minutes');
        expect(() => new BetterClock({ sleepAt: 2275 })).to.throw('SleepAt contains too many minutes');
    });
});