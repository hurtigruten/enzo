import { log } from "../deps.ts";

await log.setup({
  handlers: {
    // Set log level of console
    console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: `[{levelName}] {datetime}: {msg}`
    }),
    file: new log.handlers.FileHandler("DEBUG", {
      filename: 'log.txt',
      // you can change format of output message using any keys in `LogRecord`
      formatter: `[{levelName}] {datetime}: {msg}`
    }),
  },

  loggers: {
    // configure default logger available via short-hand methods above
    default: {
      level: "DEBUG",
      handlers: ["console", "file"]
    }
  },
});

// get default logger
const logger = log.getLogger();

export { logger }