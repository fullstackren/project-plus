/* = package require
--------------------------------------------------------------*/
const path          = require('path')
const Config        =  require('../.constant/config.js')      // 获取配置项
const Log           =  require('../.util/log.js')             // 控制台输出

// 解析 project-info.json
const getProjectInfoJson = () => {
  let projectJsonDirRoot = path.join(Config.dir_root, 'project-plus.json')
  try {
    return require(projectJsonDirRoot)
  } catch (error) {
    Log.error(`未找到 project-plus.json, 请检查当前文件目录是否正确，path: ${projectJsonDirRoot}`);
    process.exit(1)
  }
}

// 对象排序
function sortJson(data) {
  const newObj = {}
  Object.keys(data).sort().forEach(key => {
     newObj[key] = data[key]; 
  });
  return newObj
}

/* = exports
--------------------------------------------------------------*/
module.exports = {
  getProjectInfoJson,
  sortJson
}