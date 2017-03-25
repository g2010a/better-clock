var expect = chai.expect;

describe('Functionality', function() {
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



});