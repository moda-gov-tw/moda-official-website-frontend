

$(document).on("click", "a", function (e) {
    if ($(this).find('span').length > 0) {
        if ($(this).find('span')[0].innerHTML.toUpperCase().indexOf("PDF") >= 0) {
            window.open($(this)[0].href);
            return false;
        }
    }
    else if ($(this).hasClass("copyLinkBtn")) {
        e.preventDefault();
        tagcopy($(this));
    }
    else if (!LocalUrl($(this).attr('href'), location.href)) {
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
            var now = formatDate(new Date());
            $("#spanDateNow").prepend(now);
            FECommon.footerFtNavStyle();
            FECommon.widgetLazyload();
        });
    }
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
//search
var _JsData;
var foreverApi = 0;
function NewList(sqn) {
    var obj = getCookie("SearchObjN");
    obj = "";
    var isBilingual = false;
    var openSearhList = ["Bilingual"];
    if (openSearhList.filter(x => x == _Module).length > 0) {
        isBilingual = true;
    }

    if (obj != "") {
        RemoveCookie("SearchObjN");
        var objJson = JSON.parse(obj);
        $("#QryDateS").val(objJson.str);
        $("#QryDateE").val(objJson.end);
        $("#QryKeyword").val(objJson.txt);
        $("#Condition4").val(objJson.C4);
        $("#Condition5").val(objJson.C5);
        $("#Condition6").val(objJson.C6);
        $("#CustomizeTags").val(objJson.CT);
        $("#SysZipCode").val(objJson.ZC);
        $("#Chief").val(objJson.CF);
        $("typeLaw").prop("checked", objJson.BI);
        if ($("#QryDateS").val() != "" || $("#QryDateE").val() != "" || $("#QryKeyword").val() != "" || isBilingual ||
            $("#Condition4").val() != "" || $("#Condition5").val() != "" || $("#Condition6").val() != "" || $("#CustomizeTags").val() != "" || $("#SysZipCode").val() != "") {
            $(".conSearchBarJs").removeClass("off");

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
        C4: $("#Condition4").val() ?? "",
        C5: $("#Condition5").val() ?? "",
        C6: $("#Condition6").val() ?? "",
        CT: $("#CustomizeTags").val() ?? "",
        ZC: $("#SysZipCode").val() ?? "",
        CF: $("#Chief").val() ?? "",
        BI: $("#Regulations").prop("checked") ?? "",
        displaycount: displaycount,
        p: p
    };
    SetCookie("SearchObjN", obj);
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
                msg += "結束時間請勿小於起始時間。\n EndDate should be later than StartDate. \n";
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
    FECommon.mainQaAnchor();
}
function SearchAjax(obj) {

    var innerHtml = "";
    var Url = GetApiUrl().concat("/WebsiteList/NewsList");
    var Regulations = obj.BI ? "1" : "0";
    var data = {
        "Lang": $(".webSitelanguage").attr("lang"),
        "MainSN": parseInt(obj.key),
        "StartDate": obj.str,
        "EndDate": obj.end,
        "SearchString": obj.txt,
        "Condition4": obj.C4,
        "Condition5": obj.C5,
        "Condition6": obj.C6,
        "CustomizeTagSN": obj.CT,
        "SysZipCode": obj.ZC,
        "Condition7": obj.CF,
        "Regulations": Regulations,
        "P": parseInt(obj.p),
        "DisplayCount": parseInt(obj.displaycount)
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
                    $("#CustomizeTags").val(obj.CT);
                    $("#SysZipCode").val(obj.ZC);
                    $("#Chief").val(obj.CF);
                    $("#Regulations").prop("checked", obj.BI);
                }
                $('.datepicker1').datepicker();
                _JsData = JSON.parse($('#JsonData').val());
                $('#JsonData').remove();
                FECommon.widgetMagnific();
                $('html').stop().animate({ scrollTop: 0 }, 100, 'linear');
            });
        }, complete: function (data) {
            var IsAnykey = false;
            var missKey = ['key', 'displaycount', 'p'];
            $.each(Object.keys(obj), function (i, item) {
                if (missKey.filter(x => x == item).length == 0 && obj[item] != '') {
                    IsAnykey = true;
                    return;
                }
            });
            var openSearhList = ["Bilingual"];
            if (openSearhList.filter(x => x == _Module).length > 0) {
                IsAnykey = true;
            }
            if (IsAnykey) {
                $(".conSearchBarJs").removeClass("off");
            }
            FECommon.basicLoadingOff();
        }
    });
}
//
var listType = "";
function NeedTag(e) {
    listType = e;
    var needAarray = ["OneTextList", "TwoTextList"];
    if (needAarray.indexOf(e) > -1) { return true; } else { return false; }
}
function SearchJsonData(p) {

    if (foreverApi == "1") {
        Search(p);
    }
    else {
        var S1 = $("#ns")[0].innerHTML;
        var S2 = $("#ca")[0].innerHTML;
        var lang = $(".webSitelanguage").attr("lang");
        switch (lang) {
            case "en":
                S1 = S1.replace(new RegExp("連結此問答", 'g'), "Link in context");
                S1 = S1.replace(new RegExp('lang="en"', 'g'), "");
                if (_Module == "Bilingual") {
                    S1 = S1.replace(new RegExp("#zhtw", 'g'), "#1en");
                    S1 = S1.replace(new RegExp("#en", 'g'), "#zhtw0");
                    S1 = S1.replace(new RegExp("#1en", 'g'), "#en");
                    S1 = S1.replace(new RegExp("#zhtw0", 'g'), "#zhtw");
                    S1 = S1.replace(new RegExp("#bzh", 'g'), "#b1en");
                    S1 = S1.replace(new RegExp("#ben", 'g'), "#b1zh");
                    S1 = S1.replace(new RegExp("#b1en", 'g'), "#ben");
                    S1 = S1.replace(new RegExp("#b1zh", 'g'), "#bzh");
                    S1 = S1.replace(new RegExp("雙語詞彙", 'g'), "Bilingual");
                    S1 = S1.replace(new RegExp("序號", 'g'), "No.");
                    S1 = S1.replace(new RegExp("詞彙", 'g'), "English");
                    S1 = S1.replace(new RegExp("英譯文", 'g'), "Chinese");
                }
                break;
            case "zh-tw":
                S1 = S1.replace(new RegExp('lang="zh-tw"', 'g'), "");
                break;
        }
        
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
                    if (JsData.tags.length > 0) {
                        $.each(JsData.tags, function (j, jitem) {
                            var _s2 = "";
                            _s2 = NewListReJson(S2, JsData.tags[j]);
                            _tags += _s2;
                        });
                    }
                    _s1 = _s1.replace('#areatags', _tags);
                    itemArray.push("".concat(_s1));
                } else {
                    itemArray.push("".concat(_s1));
                }
            }
        }
        var itemHtml = "";
        if (listType == "AccordionList") {
            itemHtml = "<div class='row d-flex justify-content-center'><div class='col'><div class='accordion mb-5' id='qa1'>";
        }

        $.each(itemArray, function (i, item) {
            itemHtml += item;
        });
        if (listType == "AccordionList") {
            itemHtml += "</div></div></div>";
        }
        $("#ListTable").html(itemHtml);
        if (typeof wLazyLoad != 'undefined') {
            wLazyLoad.update();
        }
        JsPagination(p);
        $('html').stop().animate({ scrollTop: 0 }, 100, 'linear');
    }
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
    end = (pageIndex + pendingcount) > (pageCount - 1) ? (pageCount - 1) : (pageIndex + pendingcount);
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
        itemArray.push("<a class='page_a firstP' onclick='SearchJsonData(1)' href='javascript:; ' data-page='1'>" + firstPageTxt + "</a>");
    }
    var strCot = (start + 1);
    if (pageIndex <= Math.ceil(5 / 2)) { }
    else {
        if (strCot != 1) {
            itemArray.push("<a class='page_a' onclick='SearchJsonData(1)' href='javascript:; ' data-page='1'>1</a>");
            itemArray.push("<span>..</span>");
        }
    }

    var endCont = (end + 1);
    for (var i = start; i <= end; i++) {
        if (pageIndex == i) {
            itemArray.push("<a class='page_a on' onclick='SearchJsonData(" + (i + 1) + ") ' href='javascript:; ' data-page='" + (i + 1) + "'>" + (i + 1) + "</a>");
        }
        else {
            itemArray.push("<a class='page_a' onclick='SearchJsonData(" + (i + 1) + ") ' href='javascript:; ' data-page='" + (i + 1) + "'>" + (i + 1) + "</a>");
        }
    }
    if (pageIndex >= (pageCount - 1 - Math.ceil(5 / 2))) {
    } else {
        if (endCont != pageCount) {
            itemArray.push("<span>..</span>");
            itemArray.push("<a class='page_a' onclick='SearchJsonData(" + pageCount + ")' href='javascript:; ' data-page='" + pageCount + "'>");
            itemArray.push(pageCount);
            itemArray.push("</a>");
        }

    }
    //NextPage
    if (pageIndex >= (pageCount - 1)) { }
    else {
        var lastText = "Last";
        if (lang != "en") {
            lastText = "最後一頁";
        }
        itemArray.push("<a class='page_a lastP' onclick='SearchJsonData(" + pageCount + ")' href='javascript:; ' data-page=" + pageCount + ">" + lastText + "</a>");
    }
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
    if (dateStr == undefined) {
        return true;
    }
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


function LocalUrl(href, location) {
    var _chk = true;
    var Urls = ["/", location, GetApiUrl(), "#", "javascript:;", "mailto", "tel"];
    $.each(Urls, function (i, itme) {
        if (href.startsWith(itme)) {
            _chk = true;
        }
    });
    return _chk;
}


function serials(tasks, callback) {
    var step = tasks.length;
    var result = [];
    function check(r) {
        result.push(r);
        if (result.length === step) {
            callback();
        }
    }

    tasks.forEach(function (f) {
        f(check);
    });
}
function MODAEncode(txt) {
    var ele = document.createElement('span');
    ele.appendChild(document.createTextNode(txt));
    return MODADecode(ele.innerHTML);
}
function MODADecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}
function tagcopy(e) {
    var href = location.href.replace(location.hash, "") + e.attr('href');
    var navH = $('.navbar').outerHeight();
    var topBarH = $('.baseNav').outerHeight();
    var position = $(e.attr('href')).stop().offset().top - navH - topBarH;;
    navigator.clipboard.writeText(href)
        .then(() => {
            e.find('.copyMsg').fadeIn(200, function () {
                e.find('.copyMsg').delay(1500).fadeOut(200);
            });
            setTimeout(function () {
                $('html, body').stop().animate({ scrollTop: position }, 400, 'linear');
                location.href = href;
            }, 1900);
        })
        .catch(err => {
            console.log('Something went wrong', err);
        })
}