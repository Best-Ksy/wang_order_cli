const {
  getBanner
} = require("../../api/index.js")

//没有规格
const typeFlagFlase = "0"
//有规格
const typeFlagTrue = "1"

const testData = {
  //左侧导航bar测试数据
  sidebarArrayTest: [{
      id: 1,
      title: "标签1"
    },
    {
      id: 2,
      title: "标签2"
    },
    {
      id: 3,
      title: "标签3"
    },
    {
      id: 4,
      title: "标签4"
    },
    {
      id: 5,
      title: "标签5"
    },
    {
      id: 6,
      title: "标签6"
    },
    {
      id: 7,
      title: "标签7"
    },
    {
      id: 8,
      title: "标签8"
    },
    {
      id: 9,
      title: "标签9"
    },
  ],
  goodsArrayTest: [{
      id: "10021",
      num: "0",
      tag: "",
      price: "10.23",
      desc: "商品描述商品描述商品描述商品描述商品描述",
      title: "商品名称商品名称商品名称商品名称",
      thumb: "https://img01.yzcdn.cn/vant/ipad.jpeg",
      typeFlag: false,
      typeInfo: []
    },
    {
      id: "10022",
      num: "0",
      tag: "",
      price: "1.23",
      desc: "goodsDesc",
      title: "goodsTitle",
      thumb: "https://img01.yzcdn.cn/vant/ipad.jpeg",
      typeFlag: true,
      typeInfo: [{
          typeId: "1001",
          typeName: "高温",
          typeChildren: [{
            typeId: "10010001",
            typeName: "2*2",
            typeChildren: []
          }, {
            typeId: "10010002",
            typeName: "3*2",
            typeChildren: []
          }]
        },
        {
          typeId: "1002",
          typeName: "普通",
          typeChildren: [{
            typeId: "10020001",
            typeName: "2*2321",
            typeChildren: []
          }, {
            typeId: "10020002",
            typeName: "3*22",
            typeChildren: []
          }, {
            typeId: "10020003",
            typeName: "4*2",
            typeChildren: []
          }, {
            typeId: "10020004",
            typeName: "5*2",
            typeChildren: []
          }]
        },
      ]
    },
    {
      id: "10023",
      num: "0",
      tag: "",
      price: "105.23",
      desc: "goodsDesc",
      title: "goodsTitle",
      thumb: "https://img01.yzcdn.cn/vant/ipad.jpeg",
      typeFlag: false,
      typeInfo: []
    },
    {
      id: "10024",
      num: "0",
      tag: "",
      price: "188.23",
      desc: "goodsDesc",
      title: "goodsTitle",
      thumb: "https://img01.yzcdn.cn/vant/ipad.jpeg",
      typeFlag: false,
      typeInfo: []
    },
    {
      id: "10025",
      num: "0",
      tag: "",
      price: "201.23",
      desc: "goodsDesc",
      title: "goodsTitle",
      thumb: "https://img01.yzcdn.cn/vant/ipad.jpeg",
      typeFlag: false,
      typeInfo: []
    },
    {
      id: "10026",
      num: "0",
      tag: "",
      price: "188.23",
      desc: "goodsDesc",
      title: "goodsTitle",
      thumb: "https://img01.yzcdn.cn/vant/ipad.jpeg"
    },
    {
      id: "10027",
      num: "0",
      tag: "",
      price: "201.23",
      desc: "goodsDesc",
      title: "goodsTitle",
      thumb: "https://img01.yzcdn.cn/vant/ipad.jpeg",
      typeFlag: false,
      typeInfo: []
    },
  ]


}

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
    typeSelectMap: ""


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
    this.setData({
      sidebarArray: testData.sidebarArrayTest
    })
  },
  //右侧商品烂数据
  getGoodsArray() {
    this.setData({
      goodsArray: testData.goodsArrayTest
    })
  },

  //sideBar切换触发
  onsideBarChange(event) {
    //切换到数组第几个 0开始
    console.log(event.detail)

  },

  //进步器触发（无规格情况）
  onSetpperChange(even) {

    const goodsNum = even.detail;
    const goodsId = even.currentTarget.dataset.id;
    const gKey = goodsId + "_" + typeFlagFlase;
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

})