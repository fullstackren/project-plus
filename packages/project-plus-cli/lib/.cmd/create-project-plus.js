/* = package require
--------------------------------------------------------------*/
const path    = require('path')
const Config  = require('../.constant/config.js')
const DirFile = require('../.util/dir-file.js')
const Log     = require('../.util/log.js')

/* = exports
--------------------------------------------------------------*/
module.exports = async function () {
  // 模版文件路径
  let templateRoot = path.join(Config.template, '/project-plus.json')
  if (!DirFile.checkFileIsExists(templateRoot)) {
      Log.error(`未找到模版文件, 请检查当前文件目录是否正确，path: ${templateRoot}`);
      return;
  }

  // 业务文件夹路径
  let file_root =  path.join(Config.entry, 'project-plus.json');

  // 查看文件是否存在
  let isExists = await DirFile.checkFileIsExists(file_root);
  if (isExists) {
      Log.error(`当前文件已存在，请重新确认, path: ` + file_root);
      return;
  }

  // 复制文件
  await DirFile.copyFile(templateRoot, file_root).then(function() {
    Log.success(`>> 创建成功, path: ` + file_root);
  })
}