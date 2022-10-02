const { createLogger, transports, format } = require('winston')

const activityLogger = createLogger({
    transports: [
        new transports.File({
            filename: 'activity.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.File({
            filename: 'activity-error.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = { activityLogger }
