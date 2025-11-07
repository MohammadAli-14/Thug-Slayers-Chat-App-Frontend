class Logger {
  static log(...args) {
    if (import.meta.env.MODE === 'development') {
      console.log(...args);
    }
  }

  static error(...args) {
    // Always show errors, but with less detail in production
    if (import.meta.env.MODE === 'development') {
      console.error(...args);
    } else {
      console.error('Error:', args[0]); // Only show first argument in production
    }
  }

  static warn(...args) {
    if (import.meta.env.MODE === 'development') {
      console.warn(...args);
    }
  }

  static debug(...args) {
    if (import.meta.env.MODE === 'development') {
      console.debug(...args);
    }
  }
}

export default Logger;