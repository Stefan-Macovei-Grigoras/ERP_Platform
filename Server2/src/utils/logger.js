const pc = require('picocolors');

const separator = '-------------------------------';

const logger = {
  log: (...args) => {
    console.log(pc.white(args.join(' ')));
    console.log(separator);
  },
  
  info: (...args) => {
    console.log(pc.blue(args.join(' ')));
    console.log(separator);
  },
  
  error: (...args) => {
    console.error(pc.bold(pc.red(args.join(' '))));
    console.log(separator);
  },
  
  warn: (...args) => {
    console.warn(pc.yellow(args.join(' ')));
    console.log(separator);
  },
  
  success: (...args) => {
    console.log(pc.green(args.join(' ')));
    console.log(separator);
  }
};

module.exports = logger;