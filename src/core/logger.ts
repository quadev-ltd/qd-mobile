import crashlytics from '@react-native-firebase/crashlytics';

import { ApplicationEnvironentEnum } from './env';

interface Loggerer {
  logError(error: Error): void;
  logMessage(message: string): void;
}

class CrashlyticsLogger implements Loggerer {
  logError(error: Error) {
    crashlytics().recordError(error);
  }

  logMessage(message: string) {
    crashlytics().log(message);
  }
}

class ConsoleLogger implements Loggerer {
  logError(error: Error) {
    console.error(error);
  }

  logMessage(message: string) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}

class Logger {
  constructor(private logger: Loggerer) {}

  logError(error: Error) {
    this.logger.logError(error);
  }

  logMessage(message: string) {
    this.logger.logMessage(message);
  }
}

let LoggerInstance: Logger | undefined;

export const setUpLogger = (environment: string) => {
  let logger: Loggerer;
  if (environment === ApplicationEnvironentEnum.Enum.prod) {
    logger = new CrashlyticsLogger();
  } else {
    logger = new ConsoleLogger();
  }
  LoggerInstance = new Logger(logger);
};

export default () => {
  if (LoggerInstance === undefined) {
    throw new Error(
      'Logger not initialized. Use setUpLogger to initialize it.',
    );
  }
  return LoggerInstance;
};
