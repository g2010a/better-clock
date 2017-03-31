(function(exports) {
    "use strict";

    class BetterClock {
        /**
         * A clock that shows the progress of the day as a natural cycle
         * @param {object} args - Arguments object
         * @param {string} args.date - Optional date string in the format 'yyyy-mm-dd'
         * @param {number} args.longitude - Optional longitude in degrees, e.g. `51.5` for London
         * @param {number} args.latitude - Optional latitude in degrees e.g. `-0.1` for London
         * @param {number} args.wakeupAt - Optional wakeup time in military format. Default `630`
         * @param {number} args.sleepAt - Optional sleep time in military format. Default `2230`
         */
        constructor(args) {
            let self = this;
            let logger = self.logger = Logger;
            logger.useDefaults();
            logger.info("Arguments: ", args);
        
            let DEFAULT_ARGS = {
                date: (new Date()).toISOString().slice(0,10),
                longitude: 0,
                latitude: 0,
                wakeupAt: 630,
                sleepAt: 2230,
                openWeatherAPIToken: null
            };
            
            // Validate arguments
            _.defaults(args, DEFAULT_ARGS);
            args.date = args.date || DEFAULT_ARGS.date;
            args.longitude = args.longitude || DEFAULT_ARGS.longitude;
            args.latitude = args.latitude || DEFAULT_ARGS.latitude;
            args.wakeupAt = args.wakeupAt || DEFAULT_ARGS.wakeupAt;
            args.sleepAt = args.sleepAt || DEFAULT_ARGS.sleepAt;
            self.args = args;

            if (self.args.longitude > 90 || self.args.longitude < -90) {
                throw new Error('Longitude exceeds limits [-90,90]');
            }

            if (self.args.latitude > 90 || self.args.latitude < -90) {
                throw new Error('Latitude exceeds limits [-90,90]');
            }

            if (self.args.wakeupAt > 2359 || self.args.wakeupAt < 0) {
                throw new Error('WakeupAt not in 24h time range [0 - 2359]');
            }

            if (self.args.wakeupAt.toString().slice(-2)*1 > 59) {
                throw new Error('WakeupAt contains too many minutes');
            }

            if (self.args.sleepAt > 2359 || self.args.sleepAt < 0) {
                throw new Error('SleepAt not in 24h time range [0 - 2359]');
            }

            if (self.args.sleepAt.toString().slice(-2)*1 > 59) {
                throw new Error('SleepAt contains too many minutes');
            }

            self.args.original_date = self.args.date;
            self.args.date = moment(self.args.date);
            if (self.args.date.inspect().slice(0,14) == 'moment.invalid') {
                throw new Error('date is invalid');
            }


            // set clock milestones
            var dayhours = SunCalc.getTimes(self.args.date, self.args.longitude, self.args.latitude);
            
            let dawnStart = moment(dayhours.dawn),
                dayStart = moment(dayhours.sunrise),
                sunsetStart = moment(dayhours.sunset),
                nightStart = moment(dayhours.night),
                sunriseDuration = moment.duration(dayStart.diff(dawnStart)).asHours(),
                dayDuration = moment.duration(sunsetStart.diff(dayStart)).asHours(),
                sunsetDuration = moment.duration(nightStart.diff(sunsetStart)).asHours(),
                nightDuration = 24 - (sunriseDuration + dayDuration + sunsetDuration);
                
            self.data = [
                { 
                    name: 'sunrise', 
                    start: dawnStart,
                    end: dayStart,
                    duration: sunriseDuration
                },
                { 
                    name: 'day', 
                    start: dayStart,
                    end: sunsetStart,
                    duration: dayDuration
                },
                { 
                    name: 'sunset', 
                    start: sunsetStart,
                    end: nightStart,
                    duration: sunsetDuration
                },
                { 
                    name: 'night', 
                    start: nightStart,
                    end: dawnStart,
                    duration: nightDuration
                }
            ]
            logger.debug(self);
        }
        

        getWeather(args) {
            let self = this;
            let logger = self.logger;

            logger.info("Arguments for Weather: ", args);

            if (!args || !args.openWeatherAPIToken) {
                throw new Error('No openWeatherAPIToken provided');
            }

            if (typeof(args.openWeatherAPIToken) !== "string") {
                throw new Error('openWeatherAPIToken should be a string');
            }

            self.openWeatherAPIToken = args.openWeatherAPIToken;
            
            let baseUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&APPID={token}",
                url = baseUrl.replace("{lat}", self.args.latitude)
                    .replace("{lon}", self.args.longitude)
                    .replace("{token}", self.openWeatherAPIToken);
            d3.json(url, function jsonCallback(error, xhr){
                logger.debug(error, xhr);
            });
             
        }

        render() {
            let self = this;
            let logger = self.logger;

            logger.info("Drawing clock");
            
            var svg = d3.select("svg#clock"),
                width = +svg.attr("width"),
                height = +svg.attr("height"),
                clockRadius = Math.min(width,height) / 2,
                margin = 10,
                clockLineWidth = 10;

            var clockScale = d3.scaleLinear()
                .range([0,354])
                .domain([+self.args.date.startOf('day'), +self.args.date.endOf('day')]);

            var pie = d3.pie()
                    .sort(null)
                    .value((d) => +d.duration);

            var arc = d3.arc()
                    .outerRadius(clockRadius - margin)
                    .innerRadius(clockRadius - margin - clockLineWidth);

            var g = svg.selectAll("g.daybit")
                    .data(pie(self.data))
                    .enter().append("g")
                        .attr("class", (d) => "daybit " + d.data.name)
                        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
                            .append("path")
                                .attr("d", arc);
        }
    }

    exports.BetterClock = BetterClock;
})(this);