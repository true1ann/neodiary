import chalk from 'chalk';

const levels = {
    NONE: 0,
    INFO: 1,
    WARN: 2,
    LOG: 3,
    DEBUG: 4
};

const messages = {};

const messageLogFormat = (message, dateStamp) => `'${message}' at ${dateStamp}`;

const cmsg = (type, message, color) => {
    const dateStamp = new Date().toISOString();
    const formattedMessage = messageLogFormat(message, dateStamp);

    if (!messages[type]) {
        messages[type] = [];
    }
    messages[type].push(formattedMessage);

    if (!chalk[color]) {
        console.error(cmsg('ERROR', `Invalid color: ${color}`, 'red'));
        return
    }

    return chalk[color](chalk.bold(`${type} ${dateStamp}: ${message}`));
};


class Logger {
    constructor() {
        this.currentLevel = levels.INFO;
        this.level = this.level.bind(this);
        this.version = this.version.bind(this);

        this.messages = {
            get: (level) => {
                if (level in messages) {
                    return messages[level];
                } else {
                    console.error(cmsg('ERROR', `Invalid message level: ${level}`, 'red'));
                    return [];
                }
            },
            getAll: () => {
                return messages;
            },
            clear: (level) => {
                if (level in messages) {
                    messages[level] = [];
                } else {
                    console.error(cmsg('ERROR', `Invalid message level: ${level}`, 'red'));
                }
            },
            purge: () => {
                for (const key in messages) {
                    messages[key] = [];
                }
            }
        };
    }

    version() {
        console.log(cmsg('LOGGER', 'Running Logger v1.0.0', 'blue'));
    }

    level(toLevel) {
        if (toLevel in levels) {
            this.currentLevel = levels[toLevel];
        } else {
            console.error(cmsg('ERROR', `Invalid logging level: ${toLevel}. Defaulting to INFO.`, 'red'));
            this.currentLevel = levels.INFO;
        }
    }

    info(message) {
        if (this.currentLevel >= levels.INFO) {
            console.log(cmsg('INFO', message, 'blue'));
        }
    }

    warn(message) {
        if (this.currentLevel >= levels.WARN) {
            console.warn(cmsg('WARN', message, 'yellow'));
        }
    }

    log(message) {
        if (this.currentLevel >= levels.LOG) {
            console.log(cmsg('LOG', message, 'gray'));
        }
    }

    debug(message) {
        if (this.currentLevel >= levels.DEBUG) {
            console.debug(cmsg('DEBUG', message, 'gray'));
        }
    }

    error(message) {
        console.error(cmsg('ERROR', message, 'red'));
    }
}

const logger = new Logger();
export default logger;
export { levels };
