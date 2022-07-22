//開發階段
function GetApiUrl() {
    return "https://web1-05.i-me-i.com";
}

$(document).on("click", "a", function () {
    if ($(this).find('span').length > 0) {
        if ($(this).find('span')[0].innerHTML.toUpperCase().indexOf("PDF") >= 0) {
            window.open($(this)[0].href);
            return false;
        }
    }
    else if (!($(this).attr('href').startsWith('/') || $(this).attr('href').startsWith(location.hostname) || $(this).attr('href').startsWith('#') || $(this).attr('href').startsWith('javascript:;')))
    {
        var flag = confirm("是否要連結至非本網站頁面？ \n Are you sure you want to visit this website? \n" + $(this).attr('href'));
        if (!flag) {
            return false;
        }
    }
});

function gooSearch(lan, webSiteId) {
    var _lan = lan == "zh-tw" ? "" :  lan + "/" ;
    var _webSiteId = webSiteId == "MODA" ? "" :  webSiteId+"/";
    var _txt = $(".searchAreaIpt").val();
    if (window.location.hostname.indexOf("web1-04") > -1) {
        lan = lan == "zh-tw" ? "" :   lan+ "/";
        location.href = "/".concat(_lan, _webSiteId, "home/", "search.html", "?q=", _txt);
    } else {
        location.href = "/".concat(webSiteId, "/", lan,"/" , "home/", "search", "?q=", _txt);
    }
}
function gooSearch(lan, webSiteId, txt) {
    var _lan = lan == "zh-tw" ? "" : lan + "/";
    var _webSiteId = webSiteId == "MODA" ? "" :   webSiteId+"/";
    var _txt = txt;
    if (window.location.hostname.indexOf("web1-04") > -1) {
		
        location.href = "/".concat(_lan, _webSiteId, "home/", "search.html", "?q=", _txt);
    } else {
        location.href = "/".concat(webSiteId, "/", lan, "/", "home/", "search", "?q=", _txt);
    }
}
function webSiteLange(lan, webSiteId) {
    if (window.location.hostname.indexOf("web1-04") > -1) {
        if (lan != null) {
            var lan = lan == "zh-tw" ? "" : "/" + lan;
            var webSiteId = webSiteId == "MODA" ? "" : "/" + webSiteId;
            $(".header").load(lan + webSiteId + "/home/Header.html", function () { FECommon.headerNavSet(); });
            $(".footer").load(lan + webSiteId + "/home/Footer.html", function () { FECommon.footerFtSubNavStyle();});
        }
    }
}

//search
function NewList(sqn) {
    var obj = getCookie("SearchObj".concat(sqn));
    if (obj != "") {
        RemoveCookie("SearchObj".concat(sqn));
        var objJson = JSON.parse(obj);
        $("#QryDateS").val(objJson.str);
        $("#QryDateE").val(objJson.end);
        $("#QryKeyword").val(objJson.txt);
        if ($("#QryDateS").val() != "" || $("#QryDateE").val() != "" || $("#QryKeyword").val() != "") {
            $(".searchSwitch").click();
        }
        SearchObj(objJson);
    } else {
        Search(1);
    }
}


function Search(p) {
    var displaycount = 15;
    var key = $("#sqn").val();
    if ($("#perPageShow").length > 0) {
        displaycount = $("#perPageShow").find(':selected').val();
    }
    var obj = {
        key: key,
        str: $("#QryDateS").val(),
        end: $("#QryDateE").val(),
        txt: $("#QryKeyword").val(),
        displaycount: displaycount,
        p: p
    };
    SetCookie("SearchObj".concat(key), obj);
    SearchObj(obj);
}


function SearchObj(obj) {
    FECommon.basicLoadingOn();
 
    //靜態
    $('#ListTable').remove();
    if ($('.pageBar').length > 0) {
        $('.pageBar').remove();
    }
    $('#ContentHeader').after(SearchAjax(obj));
    FECommon.basicLoadingOff();
}

function SearchAjax(obj) {
    var innerHtml = "";
    var Url = GetApiUrl().concat("/WebsiteList/NewsList");
    var data = {
        "Lang": $(".webSitelanguage").attr("lang"),
        "MainSN": parseInt(obj.key),
        "StartDate": obj.str,
        "EndDate": obj.end,
        "SearchString": obj.txt,
        "P": parseInt(obj.p),
        "DisplayCount":  parseInt(obj.displaycount)
    };   
    $.ajax({
        url: Url,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'html',
        async: false,
        data: JSON.stringify(data),
        success: function (res) {
            innerHtml = res;
        }
    });
    return innerHtml;

    //axios.post(Url, data)
    //    .then(function (response) {
    //        var data = response;
    //        $("#" + data.ListType).empty();

    //        $("#" + data.ListType).innerHtml = OneTextList(response.data);
    //        console.log(response);
    //    })
    //    .catch(function (error) {
    //        console.log(error);
    //    });
}

function LeftMenu(obj) {
    if (window.location.hostname.indexOf("web1-04") > -1) {
        $('.leftMenu').remove();
        $(".twoColConWrap").prepend(LeftMenuAjax(obj));
    }
}
function LeftMenuAjax(obj) {
    var innerHtml = "";
    var Url = GetApiUrl().concat("/WebsiteList/LeftMenu", "?sn=" + obj);
    $.ajax({
        url: Url,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'html',
        async: false,
        success: function (res) {
            innerHtml = res;
        }
    });
    return innerHtml;
}

function htmlEncode(e) {
    var ele = document.createElement('span');
    ele.appendChild(document.createTextNode(e.val()));
    return ele.innerHTML;
}

//取cookies函式  
function getCookie(key) {
    var name = key + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            var EA = c.substring(name.length, c.length);
            return EA;
        }
    }
    return "";
}
//兩個引數，一個是cookie的名子，一個是值
function SetCookie(name, value) {
    var d = new Date();
    var strjson = JSON.stringify(value);
    d.setTime(d.getTime() + (1 * 2 * 60 * 60 * 1000)); //以1 hours 計算
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + strjson + ";" + expires + ";cookie_flags: 'max-age=7200;secure;SameSite=lax;";
}
function RemoveCookie(name) {
    var d = new Date();
    var strjson = JSON.stringify("");
    d.setTime(d.getTime() + (1 * 1 * 1 * 1 * -1)); //立刻過期
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + strjson + ";" + expires + ";cookie_flags: 'max-age=7200;secure;SameSite=lax';";

}