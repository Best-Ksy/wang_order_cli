/**
 * 网络请求
 */

 const { request } = require("../utils/request.js")
 const { baseUrl, tagInfo, goodsInfo, order, user} = require("./base.js")
  

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
/**
 * 提交订单
 * @param {订单信息} data 
 */
function commitOrder(data) {
  return request(baseUrl + order.commitOrder, "POST", data)
}
/**
 * 初始化用户信息
 * @param {code} data 
 */
function initUser(data) {
  return request(baseUrl + user.initUser, "GET", data)
}
/**
 * 注册用户
 * @param {用户信息} data 
 */
function registerUser(data) {
  return request(baseUrl + user.registerUser, "POST", data)
}


module.exports = {
  getAllTagInfo,
  getAllGoodsInfoByTagId,
  commitOrder,
  initUser,
  registerUser
}