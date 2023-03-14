/* = package require
--------------------------------------------------------------*/
const chalk = require('chalk')    // 命令行 log 样式

/* = exports
--------------------------------------------------------------*/
module.exports = {
  success(msg) {
    console.log(chalk.green(`${msg}`))
  },
  error(msg) {
    console.log(chalk.red(`${msg}`))
  },
  info(msg) {
    console.log(chalk.cyan(`${msg}`))
  }
}