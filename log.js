require('module-alias/register')
const { createLogger, format, transports } = require('winston')

module.exports = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'corpus' },
  transports: [new transports.Console()],
})
