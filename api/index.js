/**
 * 网络请求
 */

 const { request } = require("../utils/request.js")
 const { baseUrl, banner } = require("./base.js")
  
 /**
  * get banner data
  */

function getBanner(data){
  return request( baseUrl + banner, "GET", null)    
}


module.exports = {
  getBanner
}