import Dialog from '@vant/weapp/dialog/dialog'

const {
  getAllTagInfo,
  getAllGoodsInfoByTagId,
  commitOrder
} = require("../../api/index.js")


//没有规格
const typeFlagFlase = "0"
//有规格
const typeFlagTrue = "1"

Page({
  data: {
    //搜索条件
    searchValue: "",
    mainActiveIndex: 0,
    //sideBar 选中key
    activeKey: 0,
    //sideBar data
    sidebarArray: [],
    //goods data
    goodsArray: [],
    //商品总金额
    goodsSumAmt: 0,
    //选规格flag
    popupShow: false,
    //规格选择框展示元素
    typeInfoSelect: [],
    //订单数据
    orderInfo: {
      //商品id
      goodsId: "",
      //gKey(用于标识商品唯一性) goodsId_typeFlag_ChildrenId1_ChildrenId2..
      gKey: "",
      //规格标识
      typeFlag: Boolean,
      //商品规格关系:
      goodsTypeReletion: [],
      // goodsTypeReletion: [{
      //   typeId: "",
      //   typeName: "",
      //   typeChildrenId: "",
      //   typeChildrenName: "",
      // }],
      //商品数量
      num: 0,
    },
    //订单列表
    orderList: [],
    //订单总数
    orderTotalNum: 0,
    //规格选择框中进步器数字
    typeSetpperNum: 0,
    //规格选择框中进步器禁用状态
    typeSetpperDisableFlag: false,
    //当前选择规格的商品
    typeOrder: {},
    //选择规格记录map
    typeSelectMap: "",
    //选中的分类id
    selectTagId: "",
    //订单展示
    orderShow: false,
    //订单展示列表
    goodsShowArray: []


  },
  onLoad() {
    //初始化左侧导航bar
    this.getSideBarArray();
    //初始化右侧商品栏
    this.getGoodsArray();
    // getBanner().then(res => {
    //   console.log(res);
    //   this.data({
    //     indicatorDots: true,
    //   autoplay: true,
    //   interval: 5000,
    //   duration: 500,
    //   swiperData: res.data.data.result
    //   })
    // })
  },

  //左侧导航bar数据初始化方法
  getSideBarArray() {

    getAllTagInfo().then(res => {
      console.log(res.data);
      var returnData = res.data;
      if (200 == returnData.code) {
        var tagInfos = returnData.data;
        var tempSideBarArray = [];
        if (tagInfos.length > 0) {
          for (let i = 0; i < tagInfos.length; i++) {
            var sidebar = new Object();
            sidebar.id = tagInfos[i].id;
            sidebar.title = tagInfos[i].tagName;
            tempSideBarArray.push(sidebar);
          }

          this.setData({
            sidebarArray: tempSideBarArray,
            selectTagId: tempSideBarArray[0].id
          })
        }

      }
    })
  },
  //右侧商品烂数据
  getGoodsArray() {
    //先清空商品栏
    this.setData({
      goodsArray: []
    })
    var tempTagId = this.data.selectTagId;
    getAllGoodsInfoByTagId({
      "tagId": tempTagId
    }).then(res => {
      console.log(res.data);
      var returnData = res.data;
      if (200 == returnData.code) {
        var goodsInfo = returnData.data;
        var tempGoodsInfoArray = [];
        if (goodsInfo.length > 0) {
          for (let i = 0; i < goodsInfo.length; i++) {
            var good = new Object();
            var goodInfo = goodsInfo[i];
            good.id = goodInfo.id;
            good.num = "0";
            good.desc = goodInfo.goodDesc;
            good.title = goodInfo.title;
            good.thumb = goodInfo.thumb;
            if (typeFlagFlase == goodInfo.typeFlag) {
              good.typeFlag = false;
              var tempOrderList = this.data.orderList;
              for (let j = 0; j < tempOrderList.length; j++) {
                console.log(tempOrderList[j])
                if (tempOrderList[j].goodsId == good.id) {
                  good.num = tempOrderList[j].num;
                  break;
                }
              }
            } else {
              good.typeFlag = true;
              good.typeInfo = goodInfo.typeInfo;
            }
            tempGoodsInfoArray.push(good)
          }

          this.setData({
            goodsArray: tempGoodsInfoArray
          })
        }

      }
    })

  },

  //sideBar切换触发
  onsideBarChange(event) {
    //切换到数组第几个 0开始
    console.log(this.data.sidebarArray[event.detail])
    var tempSideBarArray = this.data.sidebarArray;
    var tempTagId = tempSideBarArray[event.detail].id
    this.setData({
      selectTagId: tempTagId
    })
    //右侧商品烂数据
    this.getGoodsArray()
  },

  //进步器触发（无规格情况）
  onSetpperChange(even) {

    const goodsNum = even.detail;
    const item = even.currentTarget.dataset.item;
    console.log(item);
    const goodsId = item.id;
    const gKey = goodsId + "_" + typeFlagFlase;
    const title = item.title;
    const desc = item.desc;
    const thumb = item.thumb;
    var tempOrderList = this.data.orderList;
    if (goodsNum == 0) {
      //当前商品个数为0
      //删除当前商品
      for (let i = 0; i < tempOrderList.length; i++) {
        if (gKey == tempOrderList[i].gKey) {
          tempOrderList.splice(i, 1);
          break;
        }
      }
    } else {
      //判断当前订单有没有该商品,如果有先删除
      for (let i = 0; i < tempOrderList.length; i++) {
        if (gKey == tempOrderList[i].gKey) {
          tempOrderList.splice(i, 1);
          break;
        }
      }

      var tempOrder = new Object();
      //商品id
      tempOrder.goodsId = goodsId;
      //gKey
      tempOrder.gKey = gKey;
      //标识
      tempOrder.typeFlag = false;
      //当前商品个数
      tempOrder.num = goodsNum;
      //商品图片
      tempOrder.thumb = thumb;
      //title
      tempOrder.title = title;
      //desc
      tempOrder.desc = desc;
      //添加商品
      tempOrderList.push(tempOrder)
    }

    //计算商品件数
    var tempOrderTotalNum = 0;
    for (let i = 0; i < tempOrderList.length; i++) {
      tempOrderTotalNum = tempOrderTotalNum + tempOrderList[i].num
    }

    this.setData({
      orderList: tempOrderList,
      orderTotalNum: tempOrderTotalNum * 100
    })


  },
  //展示规格选择弹出窗口
  popupShowClose(even) {
    var good = even.currentTarget.dataset.item;
    this.setData({
      typeOrder: good,
      typeSelectMap: new Map(),
      typeSetpperDisableFlag: false
    })


    var tempTypeInfo = good.typeInfo
    var tempOrderList = this.data.orderList;
    //查看该商品有无已经选择的规格
    // const gKey = goodsId + "_" + typeFlagTrue;
    var order = null;

    var temTypeSelectMap = this.data.typeSelectMap;

    for (let i = 0; i < tempOrderList.length; i++) {
      //存在一个已经选择的就可以
      if (tempOrderList[i].typeFlag && good.id == tempOrderList[i].goodsId) {
        order = tempOrderList[i];
        break;
      }
    }

    //当前商品不存在选中的规格商品
    if (order == null) {
      this.setData({
        typeSetpperNum: 0
      })
    } else {
      this.setData({
        typeSetpperNum: order.num,
        typeSetpperDisableFlag: true
      })
      //获取规格参数
      var goodsTypeReletion = order.goodsTypeReletion;

      for (let i = 0; i < goodsTypeReletion.length; i++) {

        var typeId = goodsTypeReletion[i].typeId;
        var typeChildrenId = goodsTypeReletion[i].typeChildrenId;
        temTypeSelectMap.set(typeId, typeChildrenId);
        for (let j = 0; j < tempTypeInfo.length; j++) {
          //父规格id
          var typeInfoTypeId = tempTypeInfo[j].typeId;
          if (typeId == typeInfoTypeId) {
            tempTypeInfo[j].selectChildId = typeChildrenId;

          }
        }
      }
    }

    this.setData({
      typeInfoSelect: tempTypeInfo,
      typeSelectMap: temTypeSelectMap,
      popupShow: true
    });
  },
  //关闭规格选择弹出窗口
  popupOnClose() {

    this.setData({
      typeInfoSelect: []
    })
    this.setData({
      popupShow: false
    });
  },
  //规格单选框选择触发
  onRadioChange(even) {

    //选中的id
    var selectId = even.detail;
    var pId = even.currentTarget.dataset.pid;
    var temTypeSelectMap = this.data.typeSelectMap;
    //当前操作的商品
    var tempTypeOrder = this.data.typeOrder;
    // var temTypeSelectMap = new Map();

    temTypeSelectMap.set(pId, selectId)
    this.setData({
      typeSelectMap: temTypeSelectMap
    })
    //判断规格是否选择完整
    var allTypeInfo = tempTypeOrder.typeInfo;
    var completeFlag = true;
    for (let i = 0; i < allTypeInfo.length; i++) {
      var type = temTypeSelectMap.get(allTypeInfo[i].typeId);
      if (type == null) {
        completeFlag = false;
        break;
      }
    }
    //check completet 放开进步器disable
    if (completeFlag) {
      var tempOrderList = this.data.orderList;
      var arraySelect = Array.from(temTypeSelectMap);
      //根据大类排序
      arraySelect.sort(function (a, b) {
        return a[0].localeCompare(b[0])
      });
      var typeKey = "";
      for (let i = 0; i < arraySelect.length; i++) {
        var select = arraySelect[i];
        var typeId = select[0];
        var typeChildrenId = select[1];
        if (i != arraySelect.length - 1) {
          typeKey += (typeId + "_" + typeChildrenId + "_");
        } else {
          typeKey += (typeId + "_" + typeChildrenId);
        }
      }
      var tempNum = 0;
      var gKey = tempTypeOrder.id + "_" + typeFlagTrue + "_" + typeKey;
      for (let i = 0; i < tempOrderList.length; i++) {
        var order = tempOrderList[i];
        if (gKey == order.gKey) {
          tempNum = order.num;
        }
      }

      this.setData({
        typeSetpperDisableFlag: true,
        typeSetpperNum: tempNum
      })
    }
  },

  //规格单选框进步器
  onSetpperChangeOfTypeSelect(even) {
    //当前选中的map,这里肯定是完整的typeInfo
    var temTypeSelectMap = this.data.typeSelectMap;
    var tempTypeOrder = this.data.typeOrder;
    //商品数量
    const goodsNum = even.detail;
    //商品id
    const goodsId = tempTypeOrder.id;
    const title = tempTypeOrder.title;
    const desc = tempTypeOrder.desc;
    const thumb = tempTypeOrder.thumb;
    //当前选中商品的所有分类种类
    const typeInfos = tempTypeOrder.typeInfo;

    var tempOrderList = this.data.orderList;
    var arraySelect = Array.from(temTypeSelectMap);
    //根据大类排序
    arraySelect.sort(function (a, b) {
      return a[0].localeCompare(b[0])
    });
    var goodsTypeReletion = [];
    var typeKey = "";
    for (let i = 0; i < arraySelect.length; i++) {
      var select = arraySelect[i];
      var typeId = select[0];
      var typeChildrenId = select[1];
      var typeName = "";
      var typeChildrenName = "";
      for (let j = 0; j < typeInfos.length; j++) {
        var typeInfo = typeInfos[j];
        if (typeId == typeInfo.typeId) {
          typeName = typeInfo.typeName;
          var typeChildren = typeInfo.typeChildren;
          for (let z = 0; z < typeChildren.length; z++) {
            var children = typeChildren[z];
            if (typeChildrenId == children.typeId) {
              typeChildrenName = children.typeName;
              break;
            }
          }
          break;
        }
      }
      var orderTypeInfo = new Object();
      orderTypeInfo.typeId = typeId;
      orderTypeInfo.typeName = typeName;
      orderTypeInfo.typeChildrenId = typeChildrenId;
      orderTypeInfo.typeChildrenName = typeChildrenName;
      goodsTypeReletion.push(orderTypeInfo);

      if (i != arraySelect.length - 1) {
        typeKey += (typeId + "_" + typeChildrenId + "_");
      } else {
        typeKey += (typeId + "_" + typeChildrenId);
      }
    }
    //
    const gKey = goodsId + "_" + typeFlagTrue + "_" + typeKey;

    if (goodsNum == 0) {
      //当前商品个数为0
      //删除当前商品
      for (let i = 0; i < tempOrderList.length; i++) {
        if (gKey == tempOrderList[i].gKey) {
          tempOrderList.splice(i, 1);
          break;
        }
      }
    } else {
      //判断当前订单有没有该商品,如果有先删除
      for (let i = 0; i < tempOrderList.length; i++) {
        if (gKey == tempOrderList[i].gKey) {
          tempOrderList.splice(i, 1);
          break;
        }
      }
      var tempOrder = new Object();
      //商品id
      tempOrder.goodsId = goodsId;
      //gKey
      tempOrder.gKey = gKey;
      //标识
      tempOrder.typeFlag = true;
      //商品规格关系
      tempOrder.goodsTypeReletion = goodsTypeReletion;
      //当前商品个数
      tempOrder.num = goodsNum;
      //商品图片
      tempOrder.thumb = thumb;
      //title
      tempOrder.title = title;
      //desc
      tempOrder.desc = desc;
      //添加商品
      tempOrderList.push(tempOrder);
    }
    //计算商品件数
    var tempOrderTotalNum = 0;
    for (let i = 0; i < tempOrderList.length; i++) {
      tempOrderTotalNum = tempOrderTotalNum + tempOrderList[i].num
    }

    this.setData({
      orderList: tempOrderList,
      orderTotalNum: tempOrderTotalNum * 100
    })

    console.log(this.data.orderList)
  },
  //订单窗口展示
  orderShowOpen() {

    this.initShowOrderList();
    this.setData({
      orderShow: true
    });

    console.log(this.data.goodsShowArray)

  },

  //订单窗口关闭
  orderShowClose() {
    this.setData({
      orderShow: false
    });
  },
  deleteOrderDialog(event) {

    var gkey = event.currentTarget.dataset.gkey;
    var tempOrderInfo = this.data.orderList;
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          for (let i = 0; i < tempOrderInfo.length; i++) {
            if (tempOrderInfo[i].gKey == gkey) {
              tempOrderInfo.splice(i, 1);
              break;
            }
          }
          this.initShowOrderList();

          //计算商品件数
          var tempOrderTotalNum = 0;
          for (let i = 0; i < tempOrderInfo.length; i++) {
            tempOrderTotalNum = tempOrderTotalNum + tempOrderInfo[i].num
          }

          this.setData({
            orderList: tempOrderInfo,
            orderTotalNum: tempOrderTotalNum * 100
          })

          this.getGoodsArray();
          instance.close();
          if (tempOrderInfo.length == 0) {
            this.orderShowClose();
          }
        });
        break;
    }
  },
  initShowOrderList() {
    var tempOrderInfo = this.data.orderList;
    console.log(tempOrderInfo)
    var tempGoodsShowArray = [];
    for (let i = 0; i < tempOrderInfo.length; i++) {
      var order = tempOrderInfo[i];
      var showOrder = new Object();
      showOrder.title = order.title;
      showOrder.gKey = order.gKey;
      showOrder.goodsId = order.goodsId;
      showOrder.num = order.num;
      showOrder.thumb = order.thumb;
      showOrder.desc = order.desc;
      showOrder.typeFlag = order.typeFlag;
      if (order.typeFlag) {
        var tempReletion = order.goodsTypeReletion;
        var typeInfoList = [];
        for (let j = 0; j < tempReletion.length; j++) {
          typeInfoList.push(tempReletion[j].typeChildrenName);
        }
        showOrder.typeInfoList = typeInfoList;
      }
      tempGoodsShowArray.push(showOrder);
    }

    this.setData({
      goodsShowArray: tempGoodsShowArray
    });
  },

  onClickButton(even) {
    var tempOrderInfo = this.data.orderList;
    commitOrder(tempOrderInfo).then(res => {
      console.log(res.data)
    })
    console.log(tempOrderInfo)
  }
})