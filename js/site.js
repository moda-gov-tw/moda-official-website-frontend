//開發階段
function GetApiUrl() {
    return "https://web1-05.i-me-i.com";
}
function GetWebTestKey() {
    return "web1-04";
}
$(document).on("click", "a", function () {
    if ($(this).find('span').length > 0) {
        if ($(this).find('span')[0].innerHTML.toUpperCase().indexOf("PDF") >= 0) {
            window.open($(this)[0].href);
            return false;
        }
    }
    else if (!($(this).attr('href').startsWith('/') ||
        $(this).attr('href').startsWith(location.herf) ||
        $(this).attr('href').startsWith(GetApiUrl()) ||
        $(this).attr('href').startsWith('#') ||
        $(this).attr('href').startsWith('javascript:;')))
    {
        var flag = confirm("是否要連結至非本網站頁面？ \n Are you sure you want to visit this website? \n" + $(this).attr('href'));
        if (!flag) {
            return false;
        }
    }
});

function gooSearch(lan, webSiteId) {
    var _lan = lan == "zh-tw" ? "" : lan + "/";
    var _webSiteId = webSiteId == "MODA" ? "" : webSiteId + "/";
    var _txt = $(".searchAreaIpt").val();
    
        lan = lan == "zh-tw" ? "" : lan + "/";
        location.href = "/".concat(_lan, _webSiteId, "home/", "search.html", "?q=", _txt);
    
}
function gooSearch(lan, webSiteId, txt) {
    var _lan = lan == "zh-tw" ? "" : lan + "/";
    var _webSiteId = webSiteId == "MODA" ? "" : webSiteId + "/";
    var _txt = txt;
     location.href = "/".concat(_lan, _webSiteId, "home/", "search.html", "?q=", _txt);
    
}
function webSiteLange(lan, webSiteId) {
        if (lan != null) {
            var lan = lan == "zh-tw" ? "" : "/" + lan;
            var webSiteId = webSiteId == "MODA" ? "" : "/" + webSiteId;
            $("#divHeader").load(lan + webSiteId + "/home/Header.html", function () {
                FECommon.headerNavSet();
                FECommon.headerNavClose();
                FECommon.headerSideNavSwitch();
               
            });
            $(".footer").load(lan + webSiteId + "/home/Footer.html", function () {
                FECommon.footerFtNavStyle();
            });
        }
}

//search
var _JsData;

function NewList(sqn) {
    var obj = getCookie("SearchObj".concat(sqn));
    if (obj != "") {
        RemoveCookie("SearchObj".concat(sqn));
        var objJson = JSON.parse(obj);
        $("#QryDateS").val(objJson.str);
        $("#QryDateE").val(objJson.end);
        $("#QryKeyword").val(objJson.txt);
        $("#Condition4").val(objJson.C4);
        $("#Condition5").val(objJson.C5);
        $("#Condition6").val(objJson.C6);
        if ($("#QryDateS").val() != "" || $("#QryDateE").val() != "" || $("#QryKeyword").val() != "" ||
            $("#Condition4").val() != "" || $("#Condition5").val() != "" || $("#Condition6").val() != "") {
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
        C4: $("#Condition4").val(),
        C5: $("#Condition5").val(),
        C6: $("#Condition6").val(),
        displaycount: displaycount,
        p: p
    };
    SetCookie("SearchObj".concat(key), obj);
    SearchObj(obj);
}
var chk = false;
function SearchObj(obj) {
    chk = false;
    FECommon.basicLoadingOn();
    var msg = "";
    //檢核
    if (obj.str != "" || obj.end != "") {
        if (obj.str != "" && !dateIsValid(obj.str)) {
            msg += "起始時間格式有誤。\n The time format for StartDate is not allow. \n";
        }
        if (obj.end != "" && !dateIsValid(obj.end)) {
            msg += "結束時間格式有誤。\n The time format for EndDate is not allow. \n";
        }
        if (obj.str != "" && obj.end != "" && msg == "") {
            if (Date.parse(obj.str) > Date.parse(obj.end)) {
                msg += "起始時間請勿小於結束時間。\n StartDate should not be later than EndDate. \n";
            }
        }
    }

    if (obj.txt != "") {
        if (obj.txt.length > 50) {
            msg += "查詢字串請勿超過50個字。\n Keyword should not be longer than 50 letters. \n";
        }
    }
    if (msg != "") {
        alert(msg);
        FECommon.basicLoadingOff();
        return;
    }

    SearchAjax(obj);
    //靜態

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
        "Condition4": obj.C4,
        "Condition5": obj.C5,
        "Condition6": obj.C6,
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
            $('.rightMain').empty();
         
            $('.rightMain').html(innerHtml).promise().done(function () {
                if (obj != "") {
                    $("#QryDateS").val(obj.str);
                    $("#QryDateE").val(obj.end);
                    $("#QryKeyword").val(obj.txt);
                    $("#Condition4").val(obj.C4);
                    $("#Condition5").val(obj.C5);
                    $("#Condition6").val(obj.C6);
                    if ($("#QryDateS").val() != "" || $("#QryDateE").val() != "" || $("#QryKeyword").val() != "" ||
                        $("#Condition4").val() != "" || $("#Condition5").val() != "" || $("#Condition6").val() != "") {
                        $(".searchSwitch").click();
                    }
                }
                $('.datepicker1').datepicker();
                _JsData = JSON.parse($('#JsonData').val());
                $('#JsonData').remove();
            });
        }, complete: function (data) {
            FECommon.basicLoadingOff();
        }
    });
   // return innerHtml;
}
//
function NeedTag(e) {
    var needAarray = ["OneTextList", "TwoTextList"];
    if (needAarray.indexOf(e) > -1) { return true; } else { return false; }
}
function SearchJsonData(p) {
    var S1 = $("#ns")[0].innerHTML;
    var S2 = $("#ca")[0].innerHTML;
    var displaycount = 15;
    if ($("#perPageShow").length > 0) {
        displaycount = $("#perPageShow").find(':selected').val();
    }
    var itemArray = [];
    var itemCoint = _JsData.length;
    var Page = p;
    var PageCount = displaycount;
    for (var i = 0; i < PageCount; i++) {
        var _item = ((Page - 1) * PageCount) + i;
        if (_item >= itemCoint) { }
        else {
            var JsData = _JsData[_item];
            var _s1 = "";
            var _tags = "";
            _s1 = NewListReJson(S1, JsData);
            if (_needtag) {
                _s1 = _s1.replace("</div></li>", "").replace("</div></div>", "");
                if (JsData.tags.length > 0) {
                    $.each(JsData.tags, function (j, jitem) {
                        var _s2 = "";
                        _s2 = NewListReJson(S2, JsData.tags[j]);
                        _tags += _s2;
                    });
                }
                var _end = '' == "OneTextList" ? "</div></li>" : "</div></div>";
                itemArray.push("".concat(_s1, _tags, _end));
            } else {
                itemArray.push("".concat(_s1));
            }
        }
    }
    $("#ListTable").html(itemArray);
    JsPagination(p);
}
function NewListReJson(str, obj) {
    $.each(Object.keys(obj), function (i, item) {
        str = str.replace(new RegExp("#".concat(item), 'g'), obj[item] == null ? "" : obj[item]);
    });
    return str;
}
function JsPagination(p) {
    var itemCoint = _JsData.length;
    var displaycount = 15;
    if ($("#perPageShow").length > 0) {
        displaycount = $("#perPageShow").find(':selected').val();
    }
    var TotlePage = Math.ceil(itemCoint / displaycount);
    ReLoadPagination(p, TotlePage);
    $(".totalPage").html(TotlePage);
    $(".pageNum").html(p);
}
function ReLoadPagination(p, pageCount) {
    var lang = $(".webSitelanguage").attr("lang");
    var pendingcount = parseInt(5 / 2);
    var pageIndex = parseInt(p - 1);
    var start = 0;
    var end = 0;
    start = pageIndex - pendingcount < 0 ? 0 : pageIndex - pendingcount;
    end = (pageIndex + pendingcount) > (pageCount - 1) ? ( pendingcount - 1) :( pageIndex + pendingcount);
    if (pageIndex + pendingcount > pageCount - 1) {
        start -= (pageIndex + pendingcount) - (pageCount - 1);
        start = start < 0 ? 0 : start;
    }
    if (pageIndex - pendingcount < 0) {
        end += 0 - (pageIndex - pendingcount);
        end = end > pageCount - 1 ? pageCount - 1 : end;
    }
    var itemArray = [];
    if (pageIndex != 0) {
        var firstPageTxt = "First";
        if (lang != "en") {
            firstPageTxt = "第一頁";
        }
        itemArray.push("<a class='page_a firstP' onclick='SearchJsonData(1)' href='javascript:; ' data-page='1'>" + firstPageTxt+"</a>");
    }
    if (pageIndex <= parseInt(5/2)){}
    else
    {
        itemArray.push("<a class='page_a' onclick='SearchJsonData(1)' href='javascript:; ' data-page='1'>1</a>");
        itemArray.push("<span>..</span>");
    }
    for (var i = start; i <= end; i++)
    {
        if (pageIndex == i) {
            itemArray.push("<a class='page_a on' onclick='SearchJsonData(" + (i + 1) + ") ' href='javascript:; ' data-page='" + (i + 1) + "'>" + (i + 1) +"</a>");
        }
        else {
            itemArray.push("<a class='page_a' onclick='SearchJsonData(" + (i + 1) + ") ' href='javascript:; ' data-page='" + (i + 1) + "'>" + (i + 1) + "</a>");
        }
    }
    if (pageIndex >= (pageCount - 1 - parseInt(5/2) )  )
    {
    }else{
        itemArray.push("<span>..</span>");
        itemArray.push("<a class='page_a' onclick='SearchJsonData('" + pageCount + "')' href='javascript:; ' data-page='" + pageCount + "'>");
        itemArray.push(pageCount);
        itemArray.push("</a>");
    }
    //NextPage
    if (pageIndex >= (pageCount - 1)) { }
    else {
        var lastText = "Last";
        if (lang != "en") {
            lastText = "最後一頁";
        }
        itemArray.push("<a class='page_a lastP' onclick='SearchJsonData('" + pageCount + "')' href='javascript:; ' data-page='" + pageCount + "'>" + lastText + "</a>");
    }
    console.log(itemArray);
    $(".pageNav").html("");
    var ss = "";
    $.each(itemArray, function (i, item) {
        ss += item;
    });
    $(".pageNav").html(ss);
}
//
function LeftMenu(obj) {
    LeftMenuAjax(obj);
    
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
            $('.leftMenu').remove();
            $(".twoColConWrap").prepend(innerHtml);
        }
    });
   // return innerHtml;
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
    document.cookie = name + "=" + strjson + ";" + expires + ";cookie_flags: 'max-age=7200;secure;SameSite=lax;'";
}
function RemoveCookie(name) {
    var d = new Date();
    var strjson = JSON.stringify("");
    d.setTime(d.getTime() + (1 * 1 * 1 * 1 * -1)); //立刻過期
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + strjson + ";" + expires + ";cookie_flags: 'max-age=7200;secure;SameSite=lax;'";

}

function dateIsValid(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateStr.match(regex) === null) {
        return false;
    }

    const date = new Date(dateStr);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
    }

    return true;
}