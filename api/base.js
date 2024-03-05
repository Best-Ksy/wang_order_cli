
module.exports = {
  baseUrl: "http://127.0.0.1:8000/api/wx/",
  // banner: "/api/wx/",              //轮毂图
  tagInfo: {                          //分类
    allTag: "tag/allTag"      //获取所有分类
  },
  goodsInfo: {
    allGoodsByTagId: "goods/allGoods"  //查询商品
  }    
}