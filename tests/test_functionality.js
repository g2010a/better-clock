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

    it('sets clock data correctly', function() {
        let clock = new BetterClock({date: '1999-01-01'});
        expect(clock.data[0].start).to.deep.equal(moment(new Date('1998-12-31T05:38:02.884Z')));
        expect(clock.data[1].start).to.deep.equal(moment(new Date('1998-12-31T06:00:31.482Z')));
        expect(clock.data[2].start).to.deep.equal(moment(new Date('1998-12-31T18:07:46.146Z')));
        expect(clock.data[3].start).to.deep.equal(moment(new Date('1998-12-31T19:22:39.780Z')));
    });

});