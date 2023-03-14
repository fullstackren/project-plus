/* = package require
--------------------------------------------------------------*/
const dayjs               = require('dayjs')                        // 日期
const quarterOfYear       =  require('dayjs/plugin/quarterOfYear')
dayjs.extend(quarterOfYear)
require('dayjs/locale/zh-cn')   // 导入本地化语言

/* = variable define
--------------------------------------------------------------*/
// 解析时间字段
const parseTime = (msg, begin, end) => {
  return {
    dateName: `${msg}（${begin} ~ ${end}）客户支持`,
    create_begin_time: begin,
    create_end_time: end
  }
}

// 转换周、月、季度和年
const resolveTime = (time) => {
  const dateFormat = 'YYYY-MM-DD'
  let data = null
  switch(time) {
    case 'standardWeek':
      data = parseTime('上周（周一~周日）', dayjs().startOf('week').add(1, 'day').format(dateFormat), dayjs().endOf('week').add(1, 'day').format(dateFormat));
      break;
    case 'prevStandardWeek':
      data = parseTime('本周（周一~周日）', dayjs().subtract(1, 'week').startOf('week').add(1, 'day').format(dateFormat), dayjs().subtract(1, 'week').endOf('week').add(1, 'day').format(dateFormat));
      break;
    case 'prevWeek':
      data = parseTime('上周（周四~周三）', dayjs().subtract(1, 'week').startOf('week').subtract(3, 'day').format(dateFormat), dayjs().subtract(1, 'week').endOf('week').subtract(3, 'day').format(dateFormat));
      break;
    case 'month':
      data = parseTime('本月', dayjs().startOf('month').format(dateFormat), dayjs().endOf('month').format(dateFormat));
      break;
    case 'prevMonth':
      data = parseTime('上月', dayjs().subtract(1, 'month').startOf('month').format(dateFormat), dayjs().subtract(1, 'month').endOf('month').format(dateFormat));
      break;
    case 'quarter':
      data = parseTime('本季度', dayjs().startOf('quarter').format(dateFormat), dayjs().endOf('quarter').format(dateFormat));
      break;
    case 'prevQuarter':
      data = parseTime('上季度', dayjs().subtract(1, 'quarter').startOf('quarter').format(dateFormat), dayjs().subtract(1, 'quarter').endOf('quarter').format(dateFormat));
      break;
    case 'year':
      data = parseTime('今年', dayjs().startOf('year').format(dateFormat), dayjs().endOf('year').format(dateFormat));
      break;
    case 'prevYear':
      data = parseTime('去年', dayjs().subtract(1, 'year').startOf('year').format(dateFormat), dayjs().subtract(1, 'year').endOf('year').format(dateFormat));
      break;
    default:
      data = parseTime('本周（周四~周三）', dayjs().startOf('week').subtract(3, 'day').format(dateFormat), dayjs().endOf('week').subtract(3, 'day').format(dateFormat));
  }
  return data
}

// 小时转化为人/日
const traverseDay = (hours) => {
  return hours / 8
}

// 小时转化为人/月
const traverseMonth = (hours) => {
  return hours / (8 * 22)
}

/* = exports
--------------------------------------------------------------*/
module.exports = {
  resolveTime,
  traverseDay, traverseMonth
}