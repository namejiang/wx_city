# wx_city
微信三级城市联动

## 初始化
···
city.init({
    self: this,        // 当前对象
    isProvince:false,  // 是否显示省级菜单
    isCity: false,     // 是否显示市级菜单
    isCounty: false,  // 是否显示区域菜单
    province: "四川省",  // 初始省级
    city: "自贡市",      
    county: "大安区",
    callback:function(json) {  // 回调更改显示
       _this.setData({
        'release.province': json.province,
        'release.city': json.city,
        'release.area': json.county
      })
    }
})
···

## change 事件 
```
bindChange: function(e) {
  city.change(e)
}
```  

## 窗口打开事件
```
  open:function(){
    city.open()
  },
```
