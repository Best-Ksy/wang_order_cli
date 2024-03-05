/**
 * 网络请求
 */

 const { request } = require("../utils/request.js")
 const { baseUrl, banner, tagInfo, goodsInfo} = require("./base.js")
  
 /**
  * get banner data
  */

function getBanner(data){
  return request( baseUrl + banner, "GET", null)    
}

/**
 * 获取所有的分类标签
 * @param {null} data 
 */
function getAllTagInfo(data) {
  return request(baseUrl + tagInfo.allTag, "GET", null)
}

/**
 * 根据分类id查询商品列表
 * @param {分类id} data 
 */
function getAllGoodsInfoByTagId(data) {
  return request(baseUrl + goodsInfo.allGoodsByTagId, "GET", data)
  
}


module.exports = {
  getBanner,  
  getAllTagInfo,
  getAllGoodsInfoByTagId
}