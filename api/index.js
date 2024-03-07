/**
 * 网络请求
 */

 const { request } = require("../utils/request.js")
 const { baseUrl, tagInfo, goodsInfo, order} = require("./base.js")
  

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

function commitOrder(data) {
  return request(baseUrl + order.commitOrder, "POST", data)
}


module.exports = {
  getAllTagInfo,
  getAllGoodsInfoByTagId,
  commitOrder
}