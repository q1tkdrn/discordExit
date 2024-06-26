const winston = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = winston.format;

const customFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
function logger(message, log) {
    const guild = message.guild.id;
    const Logger = winston.createLogger({
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            customFormat,
        ),
        // 로그에 대한 형식을 정 할 수 있다.
        transports: [
            // new transports.Console(),
    // 날짜별로 파일 관리할 떄 사용가능하다 
            new winston.transports.DailyRotateFile({
                level: 'info',
                datePattern: 'YYYY-MM-DD',
                dirname: `./logs/${guild}`,
                filename: `server_%DATE%.log`,
                maxSize: '20m',
                maxFiles: '7d',
                // maxFiles에서 벗어나서 지워질 파일을 압축파일로 변경할 것인가?
                zippedArchive: true,
            }),
            new winston.transports.DailyRotateFile({
                level: 'error',
                datePattern: 'YYYY-MM-DD',
                dirname: `./logs/${guild}`,
                filename: `server_%DATE%.error.log`,
                maxSize: '20m',
                maxFiles: '7d',
                zippedArchive: true,
            }),
        ],
    });
    Logger.info(log);
}

module.exports = { logger };