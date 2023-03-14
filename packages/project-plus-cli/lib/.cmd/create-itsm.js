/* = package require
--------------------------------------------------------------*/
const inquirer                         = require('inquirer')                     // 启动交互命令行
const fuzzy                            = require('fuzzy')                        // 模糊查询
const dayjs                            = require('dayjs')                        // 日期
const Log                              =  require('../.util/log.js')             // 控制台输出
const fetchAPI                         = require('../.util/fetch.js')
const { getProjectInfoJson, sortJson } = require('../.task/get-json')
const viewItsm                         = require('./view-itsm.js');

/* = variable define
--------------------------------------------------------------*/
// 全局属性
const __Data__ = {}

// 注册插件
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/* = exports
--------------------------------------------------------------*/
module.exports = async function () {
  // 获取配置文件数据
  __Data__.json = getProjectInfoJson()

  // 录入问题列表
  const date = dayjs().format('YYYY-MM-DD');
  const question = [
    {
      type: 'autocomplete',
      name: 'report_info',
      message: '输入并选择提问者:',
      choices: [],
      suggestOnly: false,
      source(answers, input = '') {
        return new Promise(function(resolve) {
          fetchAPI(__Data__.json.itsm.api.getUserList, 'POST', {
            name: input,
            page_num: 1,
            page_size: 20
          }, data => {
            if(data.data) {
              const fuzzyResult = fuzzy.filter(input, data.data.list.map(item => `${item.customer_staff_name}_${item.email}_${item.id}_${item.report_type}`));
              resolve(fuzzyResult.map(function(el) {
                return el.original;
              }));
            } 
          })
        });
      },
      filter(input) {
        if (input === 'none') {
            return '';
        }
        const inputArr = input.split('_');
        const len = inputArr.length
        return {
          email: inputArr[len - 3],
          report_id: inputArr[len - 2],
          report_type: inputArr[len - 1]
        }
      },
    },
    {
      type: "list",
      name: "department",
      message: "选择提问者所属部门:",
      choices: __Data__.json.itsm.category.department
    },
    {
      type: 'list',
      name: 'time_start',
      message: '选择提问时间:',
      choices: [
        { value: 'define', name: '当前时间或自定义时间' },
        { value: `${date} 09:00:00`, name: '9点（今日）' },
        { value: `${date} 10:00:00`, name: '10点（今日）' },
        { value: `${date} 11:00:00`, name: '11点（今日）' },
        { value: `${date} 12:00:00`, name: '12点（今日）' },
        { value: `${date} 13:00:00`, name: '13点（今日）' },
        { value: `${date} 14:00:00`, name: '14点（今日）' },
        { value: `${date} 15:00:00`, name: '15点（今日）' },
        { value: `${date} 16:00:00`, name: '16点（今日）' },
        { value: `${date} 17:00:00`, name: '17点（今日）' },
        { value: `${date} 18:00:00`, name: '18点（今日）' },
      ]
    },
    {
      type: 'input',
      name: 'time_start_define',
      message: '输入提问时间:',
      default: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      validate(input) {
        let done = this.async()
        // 输入不得为空
        if(input === '') {
          done('提问时间不能为空！')
          return
        }
        done(null, true)
      },
      when(answer) {
        return answer.time_start === "define"
      }
    },
    {
      type: "list",
      name: "type",
      message: "选择问题类型:",
      choices: [
        { value: "1", name: '技术支持' },
        { value: "21", name: '技术攻坚' }
      ],
      filter(input) {
        return {
          event_type: input,
          event_label: input === "1" ? input : "8",
          event_sub_type: input === "1" ? "": "105"
        }
      }
    },
    {
      type: "list",
      name: "character",
      message: "选择问题性质:",
      choices: __Data__.json.itsm.category.character
    },
    {
      type: "list",
      name: "module",
      message: "选择问题所属模块:",
      choices: __Data__.json.itsm.category.module
    },
    {
      type: 'input',
      name: 'titleMeta',
      message: '输入问题标题:',
      validate(input) {
        let done = this.async()
        // 输入不得为空
        if(input === '') {
          done('问题标题不能为空！')
          return
        }
        done(null, true)
      }
    },
    {
      type: 'input',
      name: 'content',
      message: '输入问题详细内容:',
      validate(input) {
        let done = this.async()
        // 输入不得为空
        if(input === '') {
          done('问题详细内容不能为空！')
          return
        }
        done(null, true)
      }
    },
    {
      type: 'input',
      name: 'solution',
      message: '输入问题的解决方案:',
      validate(input) {
        let done = this.async()
        // 输入不得为空
        if(input === '') {
          done('问题的解决方案不能为空！')
          return
        }
        done(null, true)
      }
    },
    {
      type: "list",
      name: "close_flag",
      message: "问题是否解决:",
      choices: [
        { value: "1", name: '已解决' },
        { value: "0", name: '未解决' }
      ],
    },
    {
      type: 'input',
      name: 'timing_consume',
      message: '输入问题解决耗时:',
      default: "0.5",
      validate(input) {
        let done = this.async()
        // 输入不得为空
        if(input === '') {
          done('耗时不能为空！')
          return
        }
        done(null, true)
      },
      when(answer) {
        return answer.close_flag === "1"
      }
    },
  ];

  // 执行问题列表
  await inquirer.prompt(question).then(answsers => {
    // 接口参数聚合
    const params = sortJson({
      title: `${answsers.department && `【${answsers.department}】`}${answsers.character && `【${answsers.character}】`}${answsers.module && `【${answsers.module}】`}${answsers.titleMeta}`,
      accept_time: answsers.time_start !== 'define' ? answsers.time_start : answsers.time_start_define,
      occur_time: answsers.time_start !== 'define' ? answsers.time_start : answsers.time_start_define,
      ...answsers.report_info,
      ...answsers.type,
      ...answsers,
      ...__Data__.json.itsm.createStaticInfo,
      ...__Data__.json.itsm.createDynamicInfo
    });
    delete params.titleMeta
    delete params.report_info
    delete params.department
    delete params.character
    delete params.type
    delete params.module
    delete params.time_start
    params.time_start_define && delete params.time_start_define

    // 请求新增接口
    fetchAPI(__Data__.json.itsm.api.create, 'POST', {
      action_name: "保存",
      action_value: "transition 2",
      next_params: {},
      params: params
    }, function(res) {
      if(res && res.error_code === '0') {
        Log.success(res.error_info)
        console.log()
        viewItsm()
      } else {
        Log.error(res.error_info)
      }
    })
  })

};
