/* = package require
--------------------------------------------------------------*/
const { getProjectInfoJson, sortJson }            = require('../.task/get-json')
const fetchAPI                                    = require('../.util/fetch.js')
const Log                                         = require('../.util/log.js')
const { sumTimingConsume }                        = require('../.util/sum')
const { resolveTime, traverseDay, traverseMonth } = require('../.util/time')

/* = variable define
--------------------------------------------------------------*/
// 全局属性
const __Data__ = {
  tagMap: {
    type: '所属类型',
    character: '所属性质',
    department: '所属部门',
    module: '所属模块'
  }
}

/* = exports
--------------------------------------------------------------*/
module.exports = async function (opts = {}) {
  // 获取配置文件数据
  __Data__.json = getProjectInfoJson()

  // 获取命令选项数据
  const { date = 'week', tag = 'type' } = opts;
  const { dateName, ...dateTail } = resolveTime(date);

  // 接口参数聚合
  const params = {
    query_req: sortJson({
      ...__Data__.json.itsm.viewStaticInfo,
      ...__Data__.json.itsm.viewDynamicInfo,
      ...dateTail
    })
  }

  // 请求查询接口
  await fetchAPI(__Data__.json.itsm.api.getList, 'POST', params, function(res) {
    if(res && res.error_code === '0') {
      const { list } = res.data
      // 客户支持总数
      const total = list.length
      // 客户支持总数的耗时求和
      const totalTime = sumTimingConsume(list)
      // 打印客户支持信息
      Log.info(`>> ${dateName}新增 ${total} 项，共耗时 ${totalTime} 小时，${traverseDay(totalTime)} 人/日，${traverseMonth(totalTime)} 人/月`)

      if(Array.isArray(list) && list.length > 0) {
        // 类型单独处理，涉及到字段（event_sub_type）判断
        if(tag === 'type') {
          const support = []
          const difficulty = []
          list.forEach(item => {
            if(item.event_sub_type === '105') {
              difficulty.push(item)
            } else {
              support.push(item)
            }
          })
          const supportTotalTime = sumTimingConsume(support)
          const difficultyTotalTime = sumTimingConsume(difficulty)
          Log.info(`   >> 按${__Data__.tagMap[tag]}分：`)
          Log.info(`      >> 技术支持 ${support.length} 项，共耗时 ${supportTotalTime} 小时，${traverseDay(supportTotalTime)} 人/日，${traverseMonth(supportTotalTime)} 人/月`)
          Log.info(`      >> 技术攻坚 ${difficulty.length} 项，共耗时 ${difficultyTotalTime} 小时，${traverseDay(difficultyTotalTime)} 人/日，${traverseMonth(difficultyTotalTime)} 人/月`)
        } else {
          // 获取配置文件的分类数据
          const tags = __Data__.json.itsm.category[tag]
          const tagsLen = tags.length
          // 创建数组，动态生成二维数组，二维数组内容是按 tag（部门、性质和模块）顺序聚合
          const categoryByTag = []
          // 历史数据不规范（标题不含标签），所以将这些数据聚合下
          const category = []
          const categoryTime = []

          list.forEach(item => {
            for(let i = 0; i < tagsLen; i++) {
              if(item['title'].includes(tags[i])) {
                if(!categoryByTag[i]) {
                  categoryByTag[i] = []
                }
                categoryByTag[i].push(item)
                break
              }
            }
          })

          Log.info(`   >> 按${__Data__.tagMap[tag]}分：`)

          // 打印类别信息
          categoryByTag.forEach((v, i) => {
            const tagTotalTime = sumTimingConsume(categoryByTag[i])
            category.push(categoryByTag[i].length)
            categoryTime.push(tagTotalTime)
            Log.info(`      >> ${tags[i]} ${categoryByTag[i].length} 项，共耗时 ${tagTotalTime} 小时，${traverseDay(tagTotalTime)} 人/日，${traverseMonth(tagTotalTime)} 人/月`)
          })

          // 不按规范填写的数据统计
          const otherTotal = total - (category.reduce((prev, next) => prev + next, 0))
          const otherTotalTime = totalTime - (categoryTime.reduce((prev, next) => prev + next, 0))
          Log.info(`      >> 未分类项 ${otherTotal} 项，共耗时 ${otherTotalTime} 小时，${traverseDay(otherTotalTime)} 人/日，${traverseMonth(otherTotalTime)} 人/月`)
        }

        // 打印客户支持内容，周统计
        if(['week', 'prevWeek', 'standardWeek', 'prevStandardWeek'].includes(date)) {
          Log.info(`   >> 内容包含：`);
          list.forEach(item => {
            Log.info(`      >> ${item.create_name}:${item.report_name}/${item.title} ${item.create_time}`);
          })
        }
      }
    } else {
      Log.error(res.error_info)
    }
  })
}