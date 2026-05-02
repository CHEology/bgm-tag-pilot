export function createLogger(prefix) {
  return {
    debug(...args) {
      if (isDebugEnabled()) {
        console.debug(prefix, ...args);
      }
    },
    warn(...args) {
      console.warn(prefix, ...args);
    },
  };
}

function isDebugEnabled() {
  try {
    return window.localStorage?.getItem('bangumi-tagpilot-debug') === '1';
  } catch {
    return false;
  }
}
