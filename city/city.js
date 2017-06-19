var cityData = require('./cityData.js').cityData;

function City(json,cityData){
    this.self       = json.self;   
    this.cityData   = cityData;             // 数据
    this.callback   = json.callback;        // 回调
    this.key        = [0,0,0];              // key
    this.keys        = [];                  // key

    this.provinces  = [];                   // 省份集合
    this.citys      = [];                   // 城市集合
    this.countys    = [];                   // 区域集合

    this.isp          = json.isProvince;    // is省份
    this.isc          = json.isCity;        // is城市
    this.isa          = json.isCounty;      // is区域

    this.p          = json.province || null;// 省份
    this.c          = json.city || null;    // 城市
    this.a          = json.county || null;  // 区域

    this.init()
}
City.prototype.init = function(){
    if(!this.isp && !this.isc && !this.isa) this.isp = truep;
    this.province();
    this.city(this.p);
    this.county(this.c);
    this.keys = this.iskey(this.keys,true);
    this.setData({'iscity':false,'cityKey':this.keys,'isp':this.isp,'isc':this.isc,'isa':this.isa,'provinces': this.provinces,'citys':this.citys,'countys':this.countys});
    this.callback({province: this.p, city: this.c, county: this.a});
}
// 城市数据加载
// 省
City.prototype.province = function(province){
    let iskey = true
    for(let i=0;i<this.cityData.length;i++){
      this.provinces.push(this.cityData[i].name);
      if(this.p && this.p == this.cityData[i].name){
        if(this.isp) this.keys.push(i);
        this.key[0] = i;
        iskey = false;
      }
    }
    if(iskey && !this.isp) this.isp = true;
    this.p = this.cityData[this.key[0]].name;
}
// 市
City.prototype.city = function(province){
    let iskey = true
    for (let i = 0 ; i < this.cityData[this.key[0]].sub.length; i++) {
      this.citys.push(this.cityData[this.key[0]].sub[i].name);
      if(this.c && this.c == this.cityData[this.key[0]].sub[i].name){
        if(this.isc) this.keys.push(i);
        this.key[1] = i;
         iskey = false;
      } 
    }
    if(iskey && !this.isc) this.isc = true;
    this.c = this.cityData[this.key[0]].sub[this.key[1]].name;
}
// 区
City.prototype.county = function(city){
    let iskey = true
    for (let i = 0 ; i < this.cityData[this.key[0]].sub[this.key[1]].sub.length; i++) {
      this.countys.push(this.cityData[this.key[0]].sub[this.key[1]].sub[i].name);
      if(this.a && this.a == this.cityData[this.key[0]].sub[this.key[1]].sub[i].name){
        if(this.isa) this.keys.push(i);
        this.key[2] = i;
         iskey = false;
      } 
    }
    if(iskey && !this.isa) this.isa = true;
    this.a = this.cityData[this.key[0]].sub[this.key[1]].sub[this.key[2]].name;
}
// 设置数据
City.prototype.setData = function(json){
    this.self.setData(json);
}
 // open 打开/关闭 事件
City.prototype.open = function(){
    this.self.setData({iscity:!this.self.data.iscity});
}
 // change 事件
City.prototype.change = function(newkey){
    this.keys = newkey;
    newkey = this.iskey(newkey);
    if(this.key[0] != newkey[0]){
        this.key[0] = newkey[0];
        this.changeP();
    }
    if(this.key[1] != newkey[1]){
        this.key[1] = newkey[1];
        this.changeC();
    }
    if(this.key[2] != newkey[2]){
        this.key[2] = newkey[2];
        this.a = this.cityData[this.key[0]].sub[this.key[1]].sub[this.key[2]].name;
        this.callback({province: this.p, city: this.c, county: this.a});
    }
    this.self.setData({cityKey:this.keys, citys: this.citys, countys: this.countys});
}
 // change 事件 省
City.prototype.changeP = function(newkey){
    this.p = this.cityData[this.key[0]].name;
    this.citys = [];
    this.countys = [];
    this.city();
    this.county();
    this.callback({province: this.p, city: this.c, county: this.a});
}
 // change 事件 市
City.prototype.changeC = function(newkey){
    this.c = this.cityData[this.key[0]].sub[this.key[1]].name;
    this.countys = [];
    this.county();
    this.callback({province: this.p, city: this.c, county: this.a});
}
// 根据显示设置 key
City.prototype.iskey = function(newkey,iskey){
    let key = []
    key[0] = this.isp?newkey[0]:'false';
    key[1] = key[0] == 'false'?(this.isc?newkey[0]:'false'):(this.isc?newkey[1]:'false');
    if(key[0] == 'false'){
        key[2] = key[1] == 'false'?(this.isa?newkey[0]:'false'):(this.isa?newkey[1]:'false');
    }else{
        key[2] = key[1] == 'false'?(this.isa?newkey[1]:'false'):(this.isa?newkey[2]:'false');
    }
    for(var i=0;i<key.length;i++){
        if(iskey){
            if(key[i] == 'false'||key[i] == undefined) key.splice(i, 1);
        }else{
            if(key[i] == 'false'||key[i] == undefined) key[i] = this.key[i];
        }
    }
    return key;
}

var city = null;
function init(json){
    json.self.cityOpen = open
    json.self.citybindChange = change
    city = new City(json,cityData);
}
function change(e){
    city.change(e.detail.value);
}
function open(e){
    city.open();
}

module.exports = {
    init
}

// city.init({
//   self: this,
//   isProvinces:true,
//   isCitys: true,
//   isCountys: true,
//   provinces:"四川省",
//   citys: "成都市",
//   countys: "武侯区",
//   callback: function(){}
// })