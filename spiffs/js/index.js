// const baseurl = 'http://192.168.4.1'
const baseurl = window.location.origin
console.log(baseurl)
const CONSTANT = {
    wlanName: '',
    GET_STATION_URL: `${baseurl}/system/station_state`,
    POST_CHANGENAME_URL: `${baseurl}/system/station_state/change_name`,
    POST_DELETEDEVICE_URL: `${baseurl}/system/station_state/delete_device`,
}

var getListTime = ''
var per = []

var Ajax = {
    get: function(url,callback){
        // XMLHttpRequest object is used to exchange data with the server in the background
        console.log('4567890')
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url,false);
        xhr.setRequestHeader('Content-Type','application/json')
        // xhr.setRequestHeader('Authorization', 'Basic ZXNwMzI6MTIzNDU2Nzg=')
        xhr.onreadystatechange = function(){
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
            if (xhr.readyState === 4){
                if (xhr.status === 200 || xhr.status === 304){
                    callback(xhr.responseText);
                }
            }
        }
        xhr.send(JSON.stringify(data));
    }
}

function networkStatus() {
    var baseArray1 = document.getElementsByClassName('header-title-one')
    var base1 = baseArray1[0]
    base1.style.color = '#000'
    base1.style.cursor = 'auto'
    var baseArray = document.getElementsByClassName('header-title-two')
    var base = baseArray[0]
    base.style.color = '#888888'
    base.style.cursor = 'pointer'
    var baseShow = document.getElementById('networkShow')
    baseShow.style.display = 'block'
    var highShow = document.getElementById('customerShow')
    highShow.style.display = 'none'
}

function customerList() {
    console.log('Click on the client list')
    var base1 = document.querySelector('.header-title-one')
    base1.style.color = '#888888'
    base1.style.cursor = 'pointer'
    var base = document.querySelector('.header-title-two')
    base.style.color = '#000'
    base.style.cursor = 'auto'
    var baseShow = document.getElementById('networkShow')
    baseShow.style.display = 'none'
    var highShow = document.getElementById('customerShow')
    highShow.style.display = 'block'
}

function deviceStatusUpdate (nowTime, list) {
    console.log('device Status Update')
    var connectTime = document.getElementById('connect-time')
    var remainCount = document.getElementById('remain-count')
    var connectCount = document.getElementById('connect-count')

    var online_time = nowTime / 1000000;
    var h = Math.floor(online_time / 3600 );
    var m = Math.floor((online_time /60 % 60));
    var s = Math.floor((online_time % 60));

    console.log('list: ', list)
    connectTime.innerHTML = h + 'h' + m + 'm' + s + 's'
    remainCount.innerHTML = 10 - list.length + 'pcs'
    connectCount.innerHTML = list.length + 'pcs'

}

function createList (list) {
    var html = []
    var tbody = document.getElementById('tbody')
    for(var i = 0;i < list.length; i++){ //Traverse the json data
        console.log('name: ', list[i].name_str)
        console.log('mac: ', list[i].mac_str)
        console.log('ip:', list[i].ip_str)
        //<td><div data-mac="${list[i].mac_str}" data-value="${list[i].isNetwork}" class="switch-wrap"></div></td>
        var tr = `<tr><td><input value="${list[i].name_str}" disabled class="list-name" data-index="${i}" id="row + ${i}" /></td><td>${list[i].mac_str}</td><td>${list[i].ip_str}</td><td>${list[i].connectTime}</td><td><div class="flex flex-jcc"><input class="edit-btn" type="button" id="edit + ${i}" data-id="row + ${i}" value="edit" /><div class="edit-line"></div><input class="del-btn" type="button" data-index="${i}" id="dle + ${i}" value="delete"/></div></td></tr>`
        html.push(tr)
    }
    tbody.innerHTML = html.join('')
}

function listDataDelete (index) {
    var deleteDeviceDic = per[index]

    console.log('deleteDeviceDic body: ' + JSON.stringify(deleteDeviceDic))
    Ajax.post(CONSTANT.POST_DELETEDEVICE_URL, deleteDeviceDic, function (res) {
        console.log('listDataDelete block: ' + res)
    })
}

function editNameUpdate (index, value) {
    var stationDic = per[index]
    stationDic['name_str'] = value

    console.log('stationDic body: ' + JSON.stringify(stationDic))
    Ajax.post(CONSTANT.POST_CHANGENAME_URL, stationDic, function (res) {
        console.log('editNameUpdate block: ' + res)
    })
}

function updateRouterList () {
    getListTime = setTimeout(updateRouterList,4000)
    Ajax.get(CONSTANT.GET_STATION_URL, function (res) {
        res = JSON. parse(res)
        console.log('Get basic information: ', res)
        console.log('Get basic information: ', res.station_list)
        per = res.station_list
        deviceStatusUpdate(res.now_time, res.station_list)
        for (var i = 0; i < per.length; i++) {
            var stationDic = per[i]
            var online_time = (res.now_time - stationDic.online_time_s)/1000000
            var h = Math.floor(online_time / 3600 )
            var m = Math.floor((online_time /60 % 60))
            var s = Math.floor((online_time % 60))
            let connectTime = h + 'h' + m + 'm' + s + 's'
            stationDic['connectTime'] = connectTime
            per.splice(i, 1, stationDic)
        }
        console.log('Information to be displayed on the page: ', per)

        createList(per)
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

    var highShow = document.getElementById('customerShow')
    highShow.style.display = 'none'

    updateRouterList()
    var dom = document.querySelector('table')
    dom.addEventListener('click', function(e) {
        // if (e.target.className === 'switch-wrap') {
        //     console.log(e.target.getAttribute('data-mac'))
        //     if (e.target.getAttribute('data-value') === 'true') {
        //         e.target.setAttribute('data-value', false)
        //     } else {
        //         e.target.setAttribute('data-value', true)
        //     }
        // }
        if (e.target.className === 'edit-btn') {
            console.log('editBtn')
            clearInterval(getListTime)
            var inputId = e.target.getAttribute('id')
            var inputDataId = e.target.getAttribute('data-id')
            var editBtn = document.getElementById(inputId)
            var listName = document.getElementById(inputDataId)
            // var listName = document.getElementById('list-name-id')
            if (editBtn.value === 'Edit') {
                console.log('editBtn bianji')
                listName.disabled = ''
                listName.style.border = '1px solid #CCCCCC'
                editBtn.value = 'Confirm'
            } else {
                console.log('editBtn queren')
                listName.disabled = 'disabled'
                listName.style.border = '0'
                editBtn.value = 'Edit'
                console.log('listName: ' + listName.value)
                console.log('listName: ' + listName.getAttribute('data-index'))
                editNameUpdate(listName.getAttribute('data-index'), listName.value)
                updateRouterList()
            }
        }

        if (e.target.className === 'del-btn') {
            clearInterval(getListTime)
            console.log('delete')
            var deleteId = e.target.getAttribute('id')
            var deleteBtn = document.getElementById(deleteId)
            var target = e.target
            console.log(target.parentNode.parentNode.parentNode)
            console.log('delete index: ' + deleteBtn.getAttribute('data-index'))

            var msg = 'Are you sure you want to delete this data? '
            if (confirm(msg) === true) {
                if (e.target.className === 'del-btn') {
                    tbody.removeChild(target.parentNode.parentNode.parentNode)
                    listDataDelete(deleteBtn.getAttribute('data-index'))
                }
                updateRouterList()
            } else {
                console.log('Cancel deletion of data')
                updateRouterList()
            }
        }
    })
    // createList(per)
}
