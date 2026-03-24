///無障礙語音
function FunSpeaking(txt) {
    $("#speaking_div").html(txt);
    setTimeout(() => {
        $("#speaking_div").html("");
    }, 1000);
}

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
var foreverApi = "0";
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
        SetDepartment(objJson.Dep);
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
  
    var _hashtag = encodeURI(window.location.hash);
    _hashtag = _hashtag.replace("#qaH", "");
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
        p: p,
        Dep: GetDepartment(),
        hashtag: _odgche ? "": _hashtag
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
        "DisplayCount": parseInt(obj.displaycount),
        "Dep": obj.Dep,
        "hashtag": obj.hashtag
    };
    $.ajax({
        url: Url,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'html',
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
                    SetDepartment(obj.Dep);
                }
                $('.datepicker1').datepicker();
              //  _JsData = JSON.parse($('#JsonData').val());
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
            if (listType == "AccordionList" && !_odgche && obj.hashtag != "") {

                $("#qaH" + obj.hashtag).children(".accordion-button").click();
                var navH = $('.navbar').outerHeight();
                var topBarH = $('.baseNav').outerHeight();
                var position = $("#qaH" + obj.hashtag).stop().offset().top - navH - topBarH;
                $('html, body').stop().animate({ scrollTop: position }, 400, 'linear');
            }
            FECommon.basicLoadingOff();
            FECommon.widgetLazyload();
            _odgche = true;
        }
    });
}
//
var listType2 = "";
function NeedTag(e) {
    listType2 = e;
    var needAarray = ["OneTextList", "TwoTextList"];
    if (needAarray.indexOf(e) > -1) { return true; } else { return false; }
}
var is = 1;
function SearchJsonData(p) {
    is++;
    var S1 = $("#ns")[0].innerHTML;
    var S2 = $("#ca")[0].innerHTML;
    var lang = $(".webSitelanguage").attr("lang");
    if ("1" == "1") {
        Search(p);
        
    }
    else {
      
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
    }
    var arrivedTitle = lang == "en" ? "swithed to " : "已切換至第";
    var pageTitle = lang == "en" ? " page " : " 頁";
    FunSpeaking(arrivedTitle + p + pageTitle);
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
    var strPageTitle = "";
    var endPageTitle = " page";
    var goTitle = " go";
    var firstPageTxt = "First";
    var itemArray = [];
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
  
    if (lang != "en") {
        firstPageTxt = "第一頁";
        strPageTitle = "第 ";
        endPageTitle = " 頁";
        goTitle = "點擊前往";
    }

    if (pageIndex != 0) {
        
        itemArray.push("<a class='page_a firstP' role='button' onclick='SearchJsonData(1)' href='javascript:; ' data-page='1' title='" + goTitle +"'  >" + firstPageTxt + "</a>");
    }
    var strCot = (start + 1);
    if (pageIndex <= Math.ceil(5 / 2)) { }
    else {
        if (strCot != 1) {
            itemArray.push("<a class='page_a' role='button' onclick='SearchJsonData(1)' href='javascript:; ' data-page='1' title='" + goTitle +"' ><span class='visually-hidden'>" + strPageTitle + "</span>1<span class='visually-hidden'>" + endPageTitle +"</span></a>");
            itemArray.push("<span>..</span>");
        }
    }

    var endCont = (end + 1);
    for (var i = start; i <= end; i++) {
        if (pageIndex == i) {
            itemArray.push("<a class='page_a on' role='button' onclick='SearchJsonData(" + (i + 1) + ") ' href='javascript:; ' data-page='" + (i + 1) + "' title='" + goTitle +"' ><span class='visually-hidden'>" + strPageTitle + "</span>" + (i + 1) + "<span class='visually-hidden'>" + endPageTitle + "</span></a>");
        }
        else {
            itemArray.push("<a class='page_a' role='button' onclick='SearchJsonData(" + (i + 1) + ") ' href='javascript:; ' data-page='" + (i + 1) + "' title='" + goTitle +"' ><span class='visually-hidden'>" + strPageTitle + "</span>" + (i + 1) + "<span class='visually-hidden'>" + endPageTitle + "</span></a>");
        }
    }
    if (pageIndex >= (pageCount - 1 - Math.ceil(5 / 2))) {
    } else {
        if (endCont != pageCount) {
            itemArray.push("<span>..</span>");
            itemArray.push("<a class='page_a' role='button' onclick='SearchJsonData(" + pageCount + ")' href='javascript:; ' data-page='" + pageCount + "' title='" + goTitle +"' >");

            itemArray.push("<span class='visually-hidden'>" + strPageTitle + "</span>");
            itemArray.push(pageCount);
            itemArray.push("<span class='visually-hidden'>" + endPageTitle + "</span>");
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
        itemArray.push("<a class='page_a lastP' role='button' onclick='SearchJsonData(" + pageCount + ")' href='javascript:; ' data-page=" + pageCount + "  title='" + goTitle +"' >" + lastText + "</a>");
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
        success: function (res) {
            innerHtml = res;
            $('.leftMenu').remove();
            $(".twoColConWrap").prepend(innerHtml);
			$('.sidebarJs .menuSub').prev('a').addClass('hasSub').attr('role', 'button');
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

function GetDepartment() {
    var departments = [];
    if ($('.ddDep').length > 0) {
        $('.ddDep:checked').each(function () {
            if ($(this).val() != "") {
                departments.push($(this).val());
            }
        });
    }
    return departments;
}
function SetDepartment(dep) {
    //if ($('.ddDep').length > 0) {
    //    $('.ddDep').each(function () {
    //        $(this).prop('checked', dep.includes($(this).val()));
    //    });
    //}
}

//2025-11-13新增
function TagKep(tag,websiteid) {
    var lang = $(".webSitelanguage").attr("lang");
    var tag = $(".webSitelanguage").attr("lang");
    var websiteid = $(".webSitelanguage").attr("lang");
    alert(websiteid + "  " + lang +"  " +tag);
}

$(document).on('click', '.tagclick', function () {
    // 白名單（依你系統實際允許值調整）
    const LANG_OK = new Set(["zh-tw", "en", "ja"]);
    const SITE_OK = new Set(["MODA", "ACS", "ADI"]);
    const rawLang = String($(".webSitelanguage").attr("lang") || "").toLowerCase();
    const rawTag = String($(this).data("key") || "");
    const $body = $('body');
    var webs = "";
    if ($body.hasClass('ACS')) { webs = "ACS"; }
    else if ($body.hasClass('ADI')) { webs = "ADI"; }
    else { }
    const rawSite = String(webs || "").toUpperCase();
    // 驗證 + 正規化
    const lang = LANG_OK.has(rawLang) ? rawLang : "zh-tw";
    const websiteId = SITE_OK.has(rawSite) ? rawSite : "MODA";
    // 用 URL 物件安全組 URL
    const segments = [];
    if (lang !== "zh-tw") segments.push(lang);
    if (websiteId !== "MODA") segments.push(websiteId);
    segments.push("knowledgelist.html");
    const url = new URL("/" + segments.join("/"), window.location.origin);
    // 以 URLSearchParams 自動處理編碼
    if (rawTag) url.searchParams.set("t", rawTag);
    console.log(rawSite);
    console.log(url);
    window.location.assign(url.href);
});


//新增主題標籤查詢
//上面的
function SearchKnowledgelist() {
    var msg = "";
    const urlParams = new URLSearchParams(window.location.search);
    const siteIds = ['ACS', 'ADI', 'MODA']; // 可擴充
    const body = document.body;
    const wid = siteIds.find(id => body.classList.contains(id)) || 'MODA';
    var obj = {
        t: urlParams.get('t'),
        s: MODAEncode($("#QryDateS").val()),
        e: MODAEncode($("#QryDateE").val()),
        k: MODAEncode($("#QryKeyword").val()),
        l: $(".webSitelanguage").attr("lang"),
        wid: wid
    };
    if (obj.s != "" || obj.e != "") {
        if (obj.s != "" && !dateIsValid(obj.s)) {
            msg += "起始時間格式有誤。\n The time format for StartDate is not allow. \n";
        }
        if (obj.e != "" && !dateIsValid(obj.e)) {
            msg += "結束時間格式有誤。\n The time format for EndDate is not allow. \n";
        }
        if (obj.s != "" && obj.e != "" ) {
            if (Date.parse(obj.s) > Date.parse(obj.e)) {
                msg += "結束時間請勿小於起始時間。\n EndDate should be later than StartDate. \n";
            }
        }
    }
    if (obj.k != "") {
        if (obj.k.length > 50) {
            msg += "查詢字串請勿超過50個字。\n Keyword should not be longer than 50 letters. \n";
        }
    }
    if (msg != "") {
        alert(msg);
        FECommon.basicLoadingOff();
        return;
    }


    KnowledgelistAjax(obj);
}
//左側查詢+分頁的
function SearchKnowledgelistLeft(p) {
    var displaycount = 15;
    if ($("#perPageShow").length > 0) {
        displaycount = $("#perPageShow").find(':selected').val();
    }
    const urlParams = new URLSearchParams(window.location.search);
    const siteIds = ['ACS', 'ADI', 'MODA']; // 可擴充
    const body = document.body;
    const wid = siteIds.find(id => body.classList.contains(id)) || 'MODA';
    var obj = {
        t: urlParams.get('t'),
        s: MODAEncode($("#QryDateS").val()),
        e: MODAEncode($("#QryDateE").val()),
        k: MODAEncode($("#QryKeyword").val()),
        l: $(".webSitelanguage").attr("lang"),
        wid: wid,
        p: p,
        dc: displaycount,
        lms: GetCheckBoxVal('lvc', '0'),
        at: GetCheckBoxVal('atc', '99'),
    };
    KnowledgelistItemAjax(obj);
}

//Ajax
function KnowledgelistAjax(obj) {
    var Url = GetApiUrl().concat("/WebsiteList/KnowledgeList");
    $.ajax({
        url: Url,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'html',
        data: JSON.stringify(obj),
        success: function (res) {
            innerHtml = res;
            $('.twoColConWrap').empty();
            $('.twoColConWrap').html(innerHtml).promise().done(function () {
                FECommon.widgetMagnific();
                $('html').stop().animate({ scrollTop: 0 }, 100, 'linear');
            });
        }, complete: function (data) {
            KnowledgelistTitleAjax(obj);
        }
    });
}
function KnowledgelistItemAjax(obj) {
    FECommon.basicLoadingOn();
    var Url = GetApiUrl().concat("/WebsiteList/KnowledgeListItem");
    $.ajax({
        url: Url,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'html',
        data: JSON.stringify(obj),
        success: function (res) {
            innerHtml = res;
            $('#ListItem').empty();
            $('#ListItem').html(innerHtml).promise().done(function () {
                FECommon.widgetMagnific();
                $('html').stop().animate({ scrollTop: 0 }, 100, 'linear');
            });
        }, complete: function (data) {
            FECommon.basicLoadingOff();
        }
    });
}

function KnowledgelistTitleAjax(obj) {
    var Url = GetApiUrl().concat("/WebsiteList/KnowledgeListTopicTagTilite");
    $.ajax({
        url: Url,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'html',
        data: JSON.stringify(obj),
        success: function (res) {
            innerHtml = res;
            $('#TopicTagTilite').empty();
            $('#TopicTagTilite').html(innerHtml).promise().done(function () {
                $('html').stop().animate({ scrollTop: 0 }, 100, 'linear');
            });
        }, complete: function (data) {
            FECommon.basicLoadingOff();
        }
    });
}
//取checkedbox
function GetCheckBoxVal(ckclss, allval) {
    var _array = [];
    var _allcount = 0;
    $("." + ckclss).each(function () {
        _allcount++;
        var $checkbox = $(this);
        if ($checkbox.prop("checked")) {
            if ($checkbox.val() != "") {
                _array.push($checkbox.val());
            }
        }
    });
    if (_array.length == _allcount) {
        _array.length = 0;
        _array.push(allval);
    }
    
    return _array.join(',');
}
//checkedbox
$(document).on('change', '.lvc', function () {
    var $this = $(this);
    // 如果是全選按鈕
    if ($this.hasClass('all')) {
        $('.lvc').prop('checked', $this.prop('checked'));
    } else {
        // 如果有任一項目取消，就取消全選
        if (!$this.prop('checked')) {
            $('.lvc.all').prop('checked', false);
        } else {
            // 若所有非全選項目都被勾選 → 全選打勾
            var allChecked = $('.lvc:not(.all):checked').length === $('.lvc:not(.all)').length;
            $('.lvc.all').prop('checked', allChecked);
        }
    }
    SearchKnowledgelistLeft(1);
});
$(document).on('change', '.atc', function () {
    var $this = $(this);
    // 如果是全選按鈕
    if ($this.hasClass('all')) {
        $('.atc').prop('checked', $this.prop('checked'));
    } else {
        // 如果有任一項目取消，就取消全選
        if (!$this.prop('checked')) {
            $('.atc.all').prop('checked', false);
        } else {
            // 若所有非全選項目都被勾選 → 全選打勾
            var allChecked = $('.atc:not(.all):checked').length === $('.atc:not(.all)').length;
            $('.atc.all').prop('checked', allChecked);
        }
    }
    SearchKnowledgelistLeft(1);
});
$(document).on('change', '.ddDep', function () {
    var $this = $(this);
    // 如果是全選按鈕
    if ($this.hasClass('all')) {
        $('.ddDep').prop('checked', $this.prop('checked'));
    } else {
        // 如果有任一項目取消，就取消全選
        if (!$this.prop('checked')) {
            $('.ddDep.all').prop('checked', false);
        } else {
            // 若所有非全選項目都被勾選 → 全選打勾
            var allChecked = $('.ddDep:not(.all):checked').length === $('.ddDep:not(.all)').length;
            $('.ddDep.all').prop('checked', allChecked);
        }
    }
});

