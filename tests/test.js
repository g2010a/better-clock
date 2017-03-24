var expect = chai.expect;

describe('Processing the arguments', function() {
    it('has default arguments', function() {
        var clock = new BetterClock();
        expect (clock.args).to.equal({
				longitude: 0,
				latitude: 0,
				wakeupAt: 630,
				sleepAt: 2230
			});
    });

    it('fails if longitude > 90', function() {
        expect (var clock = new BetterClock({longitude: 91});)
    });
});