/* = package require
--------------------------------------------------------------*/
const axios                  = require("axios").default
const Log                    = require("./log")
const { getProjectInfoJson } = require('../.task/get-json')

/* = variable define
--------------------------------------------------------------*/
// 全局属性
const __Data__ = {}


/* = exports
--------------------------------------------------------------*/
module.exports = async function (url = '', method, params, resolve, reject) {
  __Data__.json = getProjectInfoJson()

  return await axios.request({
    url,
    method,
    headers: {
      cookie: `token=${__Data__.json.itsm.token}`
    },
    data: {...params}
  }).then(res => {
    if(res.data && res.data.error_code === '0') {
      resolve(res.data)
    }
  }).catch(err => {
    if(err.message === 'getaddrinfo ENOTFOUND kfhsitsm.hundsun.com kfhsitsm.hundsun.com:443') {
      Log.error('>> 网络存在问题，请检查')
      process.exit(1)
    }
    if(err.message === 'Request failed with status code 401'){
      Log.error(`>> 当前处理登出状态，请登录${__Data__.json.itsm.api.login}`)
      process.exit(1)
    }
    Log.error(err.message)
    typeof reject === 'function' && reject(err)
  });
}