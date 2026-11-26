// Small logger: prints to the console, appends to logs/execution.log and keeps
// an in-memory buffer so each test's lines can be attached to the report.
const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const LOG_DIR = path.resolve(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'execution.log');
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
let buffer = [];

function write(level, message) {
  if (LEVELS[level] < LEVELS[env.logLevel]) return;
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`;
  buffer.push(line);
  console.log(line);
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, `${line}\n`);
}

module.exports = {
  debug: (m) => write('debug', m),
  info: (m) => write('info', m),
  warn: (m) => write('warn', m),
  error: (m) => write('error', m),
  /** Returns the buffered lines and empties the buffer. */
  drain() {
    const text = buffer.join('\n');
    buffer = [];
    return text;
  },
  LOG_DIR,
};
