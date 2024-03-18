const {
  initUser
} = require("../../api/index.js")

Page({
  data: {
    loginFlag: false,
    userInfo: {},
  },

  onLoad() {

    //初始化用户
    this.initUser();

  },
  //当前用户如果绑定过手机号，直接登陆
  //如果没有绑定过手机号，跳转绑定手机号页面
  initUser() {

    var tempUserInfo = {};
    var tempLoginFlag = false;
    var that = this;
    //用户自动登陆
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          initUser({
            "code": res.code
          }).then(res => {

            var initData = res.data;
            var code = initData.code;
            if (code == 200) {
              var userData = initData.data;
              var status = userData.status;
              if (status == 1) {
                //当前用户未绑定手机号,返回用户openId
                var openId = userData.user;
                //跳转register页面
                //保留当前页面，跳转到应用内的某个页面
                wx.reLaunch({
                  url: '/pages/register/register?openId=' + openId
                })
              } else {
                //返回用户信息
                tempUserInfo = userData.user;
                tempLoginFlag = true;
                console.log(userData)
                wx.setStorageSync('nkName', tempUserInfo.nkName);
                wx.setStorageSync('profile', tempUserInfo.profile);
                wx.setStorageSync('openId', tempUserInfo.openId);
                wx.setStorageSync('phoneNm', tempUserInfo.phoneNm);
                that.setData({
                  userInfo: tempUserInfo,
                  loginFlag: tempLoginFlag
                })
                
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})