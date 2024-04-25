export default (info: {
  timestamp: string;
  level: string;
  message: string;
}): string => `${info.timestamp} ${info.level}: ${info.message}`;
