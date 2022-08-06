const winston = require('winston');

const { format } = winston;

const options = {
    file: {
        format: format.combine(
            format.splat(), 
            format.json()
        ),
    },
    console: {
        format: format.combine(
            format.splat(),
            format.json()
        ),
    }
};
const logger = new winston.createLogger({
    transports: [
        // new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false // do not exit on handled exceptions
});

module.exports = logger;