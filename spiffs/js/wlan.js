// const baseurl = 'http://192.168.4.1'
const baseurl = window.location.origin
console.log(baseurl)
const CONSTANT = {
  wlanName: '',
  GET_BASE_URL: `${baseurl}/wlan_general`,
  GET_HIGH_URL: `${baseurl}/wlan_advance`,
}

var Ajax = {
  get: function(url,callback){
    // XMLHttpRequest object is used to exchange data with the server in the background
    console.log('456789')
    var xhr=new XMLHttpRequest();
    xhr.open('GET', url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onreadystatechange=function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200 || xhr.status === 304){
          console.log(xhr.responseText);
          callback(xhr.responseText);
        } else {
          console.log(xhr.responseText);
        }
      }
    }
    xhr.send();
  },
  put: function(url, data, callback) {
    var xhr=new XMLHttpRequest();
    xhr.open('put', url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onreadystatechange=function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200 || xhr.status === 304){
          console.log(xhr.responseText);
          callback(xhr.responseText);
        } else {
          console.log(xhr.responseText);
        }
      }
    }
    xhr.send(JSON.stringify(data));
  },
  post: function(url, data, callback){
    var xhr=new XMLHttpRequest();
    xhr.open('POST', url,true);
    // Add http header, content encoding type when sending information to the server
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onreadystatechange=function(){
      console.log('1: ', xhr.readyState)
      console.log('2: ', xhr.status)
      console.log('3: ', xhr.responseText)
      if (xhr.readyState === 4){
        if (xhr.status === 200 || xhr.status === 304){
          callback(xhr.responseText);
        }
      }
    }
    xhr.send(JSON.stringify(data));
  }
}

function baseSetting() {
  var baseArray1 = document.getElementsByClassName('header-title-one')
  var base1 = baseArray1[0]
  base1.style.color = '#000'
  base1.style.cursor = 'auto'
  var baseArray = document.getElementsByClassName('header-title-two')
  var base = baseArray[0]
  base.style.color = '#888888'
  base.style.cursor = 'pointer'
  var baseShow = document.getElementById('baseShow')
  baseShow.style.display = 'block'
  var highShow = document.getElementById('highShow')
  highShow.style.display = 'none'
}

function advanceSetting() {
  console.log('Click Advanced Settings')
  var base1 = document.querySelector('.header-title-one')
  base1.style.color = '#888888'
  base1.style.cursor = 'pointer'
  var base = document.querySelector('.header-title-two')
  base.style.color = '#000'
  base.style.cursor = 'auto'
  var baseShow = document.getElementById('baseShow')
  baseShow.style.display = 'none'
  var highShow = document.getElementById('highShow')
  highShow.style.display = 'block'
}

function baseSave() {
  var wlanName = document.getElementById('wlanName')
  console.log('wlan name:', wlanName.value)
  var model = document.getElementById('model')
  console.log('Safety mode:', model.value)
  var password = document.getElementById('password')
  console.log('Password:', password.value)
  var select = document.getElementById('select')
  console.log('wlan invisible:', select.checked)
  var isSelect = 'false'
  if (select.checked) {
    isSelect = 'true'
  }
  Ajax.post(CONSTANT.GET_BASE_URL, {ssid: wlanName.value, if_hide_ssid: isSelect, auth_mode: model.value, password: password.value}, function (res) {
    console.log('Basic information saved:', res)
  })
}

function highSave() {
  var broadband = document.getElementById('broadband')
  console.log('Broadband:', broadband.value)
  var channel = document.getElementById('channel')
  console.log('channel:', channel.value)
  Ajax.post(CONSTANT.GET_HIGH_URL, {bandwidth: broadband.value, channel: channel.value}, function (res) {
    console.log('Advanced information saved:', res)
  })
}

function menuClick (e) {
  console.log('e: ', e.classList)
  var menuView = document.getElementById('leftMenu')
  if (e.classList.contains('delMenu')) {
    menuView.style.display = 'none'
    e.classList.remove('delMenu')
  } else {
    e.classList.add('delMenu')
    menuView.style.display = 'block'
  }

}

function initHash () {
  console.log('Page first loaded')

  var highShow = document.getElementById('highShow')
  highShow.style.display = 'none'

  Ajax.get(CONSTANT.GET_BASE_URL, function (res) {
    console.log('Get basic information: ', res)
    res = JSON. parse(res)
    var wlanName = document.getElementById('wlanName')
    var model = document.getElementById('model')
    var password = document.getElementById('password')
    var select = document.getElementById('select')
    wlanName.value = res.ssid
    for (i = 0; i < model.length; i ++) {
      if (res.auth_mode === model.options[i].value) {
        model.options[i].selected = true
      }
    }
    password.value = res.password
    select.checked = res.if_hide_ssid === 'true'
  })
  Ajax.get(CONSTANT.GET_HIGH_URL, function (res) {
    console.log('Get advanced information', res)
    res = JSON. parse(res)
    var broadband = document.getElementById('broadband')
    var channel = document.getElementById('channel')

    for (i = 0; i < broadband.length; i ++) {
      if (res.bandwidth === broadband.options[i].value) {
        broadband.options[i].selected = true
      }
    }
    for (i = 0; i < channel.length; i ++) {
      if (res.channel === channel.options[i].value) {
        channel.options[i].selected = true
      }
    }
  })
}
