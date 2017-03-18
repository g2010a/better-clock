/*
 * Draws a better clock
 * Requires 
 *   args.latitude {number} e.g. `51.5` for London
 *   args.longitude {number} e.g. `-0.1` for London
 * Optional
 *   args.wakeupAt {string} Wakeup time in military format. Default `0630`
 *   args.sleepAt {string} Sleep time in military format. Default `2230`
 */
(function main(args) {
	var logger = Logger;
	logger.useDefaults();
	logger.info("Arguments: ", args);
	
	var DEFAULT_ARGS = {
			longitude: 0,
			latitude: 0,
			wakeupAt: 630,
			sleepAt: 2230
	    };
	
	_.defaults(args, DEFAULT_ARGS);
		
	var TODAY = new Date(),
		RADIANS = 0.0174532925, 
		CLOCKRADIUS = 200,
		MARGIN = 50,
		WIDTH = (CLOCKRADIUS+MARGIN)*2,
		HEIGHT = (CLOCKRADIUS+MARGIN)*2
		;
		
	var dayhours = SunCalc.getTimes(TODAY, args.longitude, args.latitude);
	logger.debug(dayhours);
	
	var milestones = {
		
	}
	
	var minuteScale = secondScale = d3.scaleLinear()
			.range([0,354])
			.domain([0,59]);

	function drawClock() {
		Logger.info("Drawing clock");
		var svg = d3.select("body").append("svg")
				.attr("width", WIDTH)
				.attr("height", HEIGHT);
		
		var donut = d3.layout.pie()
				.sort(null)
				.value(function(d){ return d.size})
				
		
	}
	
	
	drawClock();
})({
	longitude: 53.5511,
	latitude: 9.9937,
	wakeup
});