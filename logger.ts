import { log, Logger } from "./deps.ts";

// custom configuration with 2 loggers (the default and `tasks` loggers)
await log.setup({
  handlers: {
    // Set log level of console
    console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: `[{levelName}] {datetime}: {msg}`
    }),
    /*file: new log.handlers.FileHandler("DEBUG", {
      filename: "./log.txt",
      // you can change format of output message using any keys in `LogRecord`
      formatter: `[{levelName}] {datetime}: {msg}`
    }),*/
  },

  loggers: {
    // configure default logger available via short-hand methods above
    default: {
      level: "DEBUG",
      handlers: ["console"],
      //handlers: ["console", "file"]
    }
  },
});

// get default logger
export const logger : Logger = log.getLogger();