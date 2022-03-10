var repository = {};
var path = window.location.search.substring(1);

window.onload = function() {
    ajaxGet('source/repository.json').onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            repository = JSON.parse(this.responseText);
            loadPage(findPath(path));
        }
        else {
            loadPage({
                param: {
                    name: "没有找到索引文件",
                    path: ""
                },
                parent: []
            });
        }
    }
}

function ajaxGet(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    return xhr;
}

function findPath(path) {
    var pathArray = path.split('/');
    var data = repository;
    var parent = [];
    for(var i = 0; i < pathArray.length; i++) {
        pathArray[i] = decodeURIComponent(pathArray[i]);
        if(pathArray[i] == '') continue;
        if(data['children'] != undefined) {
            for(var j = 0; j < data['children'].length; j++) {
                if(data['children'][j]['param']['name'] == pathArray[i]) {
                    parent.push(data['param']);
                    data = data['children'][j];
                    break;
                }
            }
        }
        else {
            break;
        }
    }
    data.parent = parent;
    return data;
}

function loadPage(data) {
    var header = document.getElementById('header');
    var main = document.getElementById('main');
    var footer = document.getElementById('footer');
    var headerInnerHTML = '';
    var mainInnerHTML = '';
    var footerInnerHTML = '';
    headerInnerHTML += '<div class="path">';
    for(var i = 0; i < data.parent.length; i++) {
        headerInnerHTML += '<a href="?' + data.parent[i].path + '">' + data.parent[i].name + '</a>';
    }
    headerInnerHTML += '<a href="?' + data.param.path + '">' + data.param.name + '</a>';
    headerInnerHTML += '</div>';
    if(data.children != undefined) {
        for(var i = 0; i < data.children.length; i++) {
            mainInnerHTML += '<a class="item ' + (data.children[i].children == undefined ? 'file' : 'folder' ) + '" href="?' + data.children[i].param.path + '" title="' + data.children[i].param.name + '">';
            mainInnerHTML += '<div class="name">' + data.children[i].param.name + '</div>';
            mainInnerHTML += '</a>';
        }
        footerInnerHTML += '共存在 ' + data.children.length + ' 个项目';
    }
    else {
        mainInnerHTML += '<a class="item no_icons">';
        mainInnerHTML += '<div class="name">暂不支持预览该项目</div>';
        mainInnerHTML += '</a>'; 
    }
    header.innerHTML = headerInnerHTML;
    main.innerHTML = mainInnerHTML;
    footer.innerHTML = footerInnerHTML;
}

function loadCss(url) {
    return loadNode('link', [['rel', 'stylesheet'], ['href', url]]);
}

function loadJavascript(url) {
    return loadNode('script', [['src', url]]);
}

function loadNode(name = 'div', params = [], innerHTML = '', parent = document.head) {
    var el = document.createElement(name);
    for(var i = 0; i < params.length; i++) {
        el[params[i][0]] = params[i][1];
    }
    el.innerHTML = innerHTML;
    parent.append(el);
    return el;
}