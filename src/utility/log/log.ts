import log4js from 'log4js';

log4js.configure({
    appenders: {
        std: { type: "stdout", level: "all", layout: { type: "basic", } },
        file: { type: "file", filename: `${__dirname}/log.txt`, encoding: "utf-8" }
    },
    categories: {
        default: { appenders: ["std", "file"], level: "all" }
    }
});

export const log = (className: string) => { return log4js.getLogger(className) };