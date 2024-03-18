
module.exports = {
  baseUrl: "http://169.254.237.216:8000/api/wx/",
  tagInfo: {                          //分类
    allTag: "tag/allTag"              //获取所有分类
  },
  goodsInfo: {
    allGoodsByTagId: "goods/allGoods"  //查询商品
  },
  order: {
    commitOrder: "order/commit"   //提交订单
  },
  user: {
    initUser: "user/initUser",      //初始化用户，获取openid｜｜userinfo
    registerUser: "user/registerUser" //注册用户
  }
}