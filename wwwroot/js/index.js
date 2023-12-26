var sys = "";
var webLan = $(".webSitelanguage").attr("lang");
sys = (navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage).toLowerCase();

var _lang = localStorage.getItem("_lang");
localStorage.setItem("_lang", "1");
if (webLan != sys && _lang == null) {
    if (sys == "zh-tw") { location.href = "/" + getWebSite() }
    else { location.href = "/en/" + getWebSite() }
}

function getWebSite() {
    let pathname = location.pathname;
    if (pathname.toUpperCase().indexOf("/ADI/") > -1) return "ADI";
    if (pathname.toUpperCase().indexOf("/ACS/") > -1) return "ACS";
    return "";
}


$(".PlanTab").on('click', function () {
    var sb = $(this).data('storage');
    $("#MainPlanTab").empty();
    $("#SB" + sb + " > div").clone().appendTo("#MainPlanTab");
    FECommon.widgetIdxList2Swiper();
    wLazyLoad.update();//update lazyload
});