/* = package require
--------------------------------------------------------------*/
const fs                     =  require('fs');                           // 文件读取模块

/* = exports
--------------------------------------------------------------*/
module.exports = {
  // 查看文件/文件夹是否存在
  checkFileIsExists(path){
      return fs.existsSync(path);
  },

  // 复制文件
  copyFile(originPath, curPath) {
    return new Promise(resolve => {
        fs.copyFile(originPath, curPath, fs.constants.COPYFILE_EXCL, (err) => {
            if (err) {
                throw err;
            }
            return resolve('copyFile success!!!');
        });
    });
},
}