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
        let clock = new BetterClock({});
        expect(clock.args).to.have.property('longitude', 0);
        expect(clock.args).to.have.property('latitude', 0);
        expect(clock.args).to.have.property('wakeupAt', 630);
        expect(clock.args).to.have.property('sleepAt', 2230);
    });

    it('sets milestones correctly', function() {
        let timeMachine = sinon.useFakeTimers(new Date(1999, 1, 1, 8, 0, 0, 0).getTime());
        let clock = new BetterClock({});
        expect(clock.milestones.dayStart).to.deep.equal(moment(new Date('1999-02-01T06:11:19.242Z')));
        expect(clock.milestones.sunsetStart).to.deep.equal(moment(new Date('1999-02-01T18:18:17.662Z')));
        expect(clock.milestones.nightStart).to.deep.equal(moment(new Date('1999-02-01T19:30:16.568Z')));
        expect(clock.milestones.dawnStart).to.deep.equal(moment(new Date('1999-02-01T05:49:41.282Z')));
        expect(clock.milestones.wakeupAt).to.deep.equal(clock.args.wakeupAt);
        expect(clock.milestones.sleepAt).to.deep.equal(clock.args.sleepAt);

        timeMachine.restore();
    });

});