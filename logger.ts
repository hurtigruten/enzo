import * as log from "https://deno.land/std/log/mod.ts";

// custom configuration with 2 loggers (the default and `tasks` loggers)
await log.setup({
  handlers: {
    // Set log level of console
    console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: `[{levelName}] {datetime}: {msg}`
    }),
/*
    // Set log level of log file
    file: new log.handlers.FileHandler("WARNING", {
      filename: "./log.txt",
      // you can change format of output message using any keys in `LogRecord` Add timestamp
      formatter: `[{levelName}] Date.now(): {msg}`, // How do I get new line? \n does not work. Also add readable timestamp
    }),*/
  },

  loggers: {
    // configure default logger available via short-hand methods above
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },

    /*tasks: {
      level: "ERROR",
      handlers: ["console", "file"],
    },*/
  },
});

// get default logger
let logger = log.getLogger();

export { logger }