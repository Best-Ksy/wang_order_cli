// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

const {
  registerUser
} = require("../../api/index.js")

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    phone: "",
    phoneErro: "",
    phoneValid: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    openId: ""
  },

  onLoad: function (options) {
    this.setData({
      openId: options.openId
    })
  },

  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail;
    const {
      nickName
    } = this.data.userInfo;
    const phoneValid = this.data.phoneValid;
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: phoneValid && nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })

  },
  onInputChange(e) {
    const nickName = e.detail.value;
    const {
      avatarUrl
    } = this.data.userInfo;

    const phoneValid = this.data.phoneValid;

    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: phoneValid && nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onPhoneChange(event) {

    // 正则表达式校验手机号格式
    if (!/^1[3456789]\d{9}$/.test(event.detail)) {
      // 手机号格式不正确，提示用户
      this.setData({
        phoneErro: "手机号格式错误",
        phoneValid: false,
      })
    } else {
      this.setData({
        phoneErro: "",
        phone: event.detail,
        phoneValid: true,
      })
    }
    const nickName = this.data.userInfo.nickName;
    const {
      avatarUrl
    } = this.data.userInfo;
    const phoneValid = this.data.phoneValid;
    this.setData({
      hasUserInfo: phoneValid && nickName && avatarUrl && avatarUrl !== defaultAvatarUrl
    })
  },
  commitUserInfo(){
    console.log(this.data.userInfo)
    console.log(this.data.phone)
    console.log(this.data.openId)
    var userParamBody = {
      "openId": this.data.openId,
      "phoneNm": this.data.phone,
      "nkName": this.data.userInfo.nickName,
      "profile": this.data.userInfo.avatarUrl
    }
    registerUser(userParamBody).then(res => {
      if(res.data.code == 200){
        wx.switchTab({  
          url: '/pages/user/user',
        })
      }
    })

  }

})