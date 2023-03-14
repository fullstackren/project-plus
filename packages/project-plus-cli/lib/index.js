/* = package require
--------------------------------------------------------------*/
const { program, Option } = require('commander')
const pkg                 = require('../package.json')
const Log                 = require('./.util/log.js')
const createProjectPlus   = require('./.cmd/create-project-plus.js')
const createItsm          = require('./.cmd/create-itsm.js')
const viewItsm            = require('./.cmd/view-itsm.js')

/* = command receive
--------------------------------------------------------------*/
// 快速生成模板
program
  .usage('<command> [options]')
  .version(`${pkg.name} ${pkg.version}`, '-v, --version', '显示版本号')
  .addHelpCommand(false)
  .helpOption('-h, --help', '显示帮助信息')

program
  .command('create')
  .description('创建配置文件')
  .action(async () => {
    await createProjectPlus()
  })

program
  .command('createItsm')
  .description('创建 itsm 事件，支持团队规范化创建事件')
  .action(async () => {
    await createItsm()
  })

program
  .command('viewItsm')
  .description('查询 itsm 事件，支持时间（周、月、季度、年）和标签（类型、部门、性质和模块）查询')
  .addOption(new Option('-d, --date <type>', '按日期查询').choices(['week', 'standardWeek', 'prevWeek', 'prevStandardWeek', 'month', 'prevMonth', 'quarter', 'prevQuarter', 'year', 'prevYear']).default('week'))
  .addOption(new Option('-t, --tag <type>', '按标签查询').choices(['type', 'department', 'character', 'module']).default('type'))
  .action(async (options) => {
    await viewItsm(options)
  })

program
  .on('--help', () => {
    console.log()
    Log.info('运行 pp <command> --help 获取更多帮助信息\n')
    console.log()
  })

/* = main entrance
-------------------------------------------------------------- */
program.parse(process.argv)