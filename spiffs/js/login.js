const baseurl = 'http://192.168.4.1'
const baseurl = window.location.origin
const CONSTANT = {
    POST_LOGIN_URL: `${baseurl}/login`,
}

var Ajax = {
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

function login() {
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
    Ajax.post(CONSTANT.POST_LOGIN_URL, {ssid: wlanName.value, if_hide_ssid: isSelect, auth_mode: model.value, password: password.value}, function (res) {
        console.log('Basic information saved:', res)
    })
}
