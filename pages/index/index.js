var city = require("../../city/city.js");

Page({
  data:{
    province: null,     // 省
    city:null,          // 市
    area:null,          // qu
  },
  onLoad:function(opt){
    this.cityinit()
  },
  // 城市联动
  cityinit: function(){
    let _this = this
    city.init({
      self: this,
      isProvince:true,
      isCity: false,
      isCounty: false,
      province: "四川省",
      // city: "自贡市",
      // county: "大安区",
      callback:function(json) {
        _this.setData({
          'province': json.province,
          'city': json.city,
          'area': json.county
        })
      }
    })
  },
  // 城市联动
  citybindChange: function(e) {
    city.change(e)
  },
  // 城市联动
  cityOpen:function(){
    city.open()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})