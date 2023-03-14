/* = package require
--------------------------------------------------------------*/
// 求和任务耗时
const sumTimingConsume = data => {
  return data.reduce((prev, next) => prev + (parseFloat(next.timing_consume) || 0), 0)
}

/* = exports
--------------------------------------------------------------*/
module.exports = {
  sumTimingConsume
}