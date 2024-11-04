type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
  debug: (message: string, data?: Record<string, unknown>) => void;
}

class ConsoleLogger implements Logger {
  private formatMessage(level: LogLevel, message: string, data?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${data ? ` ${JSON.stringify(data)}` : ''}`;
  }

  info(message: string, data?: Record<string, unknown>): void {
    console.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, data?: Record<string, unknown>): void {
    console.error(this.formatMessage('error', message, data));
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, data));
    }
  }
}

export const logger = new ConsoleLogger();