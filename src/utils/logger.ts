import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const logDir = path.join(process.cwd(), 'reports', 'logs');

// Custom log format
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  return msg;
});

// Create the logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    customFormat
  ),

  transports: [
    // Console output with colors
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat)
    }),

    // Daily rotating file - All logs
    new DailyRotateFile({
      dirname: logDir,
      filename: 'test-execution-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'debug'
    }),

    // Daily rotating file - Errors only
    new DailyRotateFile({
      dirname: logDir,
      filename: 'errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error'
    })
  ]
});

// Helper methods for common logging patterns
export const log = {
  info: (message: string, meta?: any) => logger.info(message, meta),
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // Test execution specific logs
  scenario: {
    start: (name: string) => logger.info(`===== Starting Scenario: ${name} =====`),
    end: (name: string, status: string) =>
      logger.info(`===== Scenario ${status}: ${name} =====`)
  },

  step: {
    start: (step: string) => logger.info(`Step: ${step}`),
    end: (step: string) => logger.debug(`Step completed: ${step}`)
  },

  page: {
    navigate: (url: string) => logger.info(`Navigating to: ${url}`),
    click: (selector: string) => logger.debug(`Clicking element: ${selector}`),
    fill: (selector: string, value: string) =>
      logger.debug(`Filling ${selector} with: ${value}`)
  },

  api: {
    request: (method: string, url: string) => logger.info(`API ${method}: ${url}`),
    response: (status: number, url: string) =>
      logger.info(`API Response [${status}]: ${url}`)
  }
};

export default logger;
