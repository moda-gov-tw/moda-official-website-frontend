/* 
 * 目前版本ajax 引用axiox  所以使用前請引用axiox.min.js
*/


/**
 * google Translation api KEY 申請一個免費的可以試用90天。
 */
var ApiKey = "AIzaSyDJZFX8EvX1hmsaECzq_lYWlWn7tATnJco";



/**
* gooAtoB翻譯套件 V2版
* lan 語系
* from 被翻譯物件
* to 翻譯物件
* isTest 是否測試
* overDate 測試結束時間
*/
function gooAtoB(lan, from, to, isTest, overDate) {
    if (isTest && new Date() > overDate) {
        alert("google翻譯試用過期");
    } else {
        var _txt = getText(from);
        var _url = "https://www.googleapis.com/language/translate/v2?key=" + ApiKey;
        var _data = { "q": _txt, "target": lan, "format": "text" };
        axios.post(_url, _data)
            .then(function (response) {
                var translatedTextArray = response.data.data.translations;
                setText(to, translatedTextArray);
            }).catch(function (error) {
                console.log(error);
            });
    }
}

/**
* getText 取的需要被翻譯的物件取出翻譯文案 (尚未完善)
* e 需要被翻譯的物件
* reture 回傳需要被翻譯的文案
*/
function getText(e) {
    var array = [];
    switch (e[0].nodeName.toLowerCase()) {
        case "text": array.push(e.val()); break;
        case "textarea": array.push(e.getData()); break;
        case "select": $.each(e[0].options, function (index, value) { array.push(value.text); }); break;
        default: array.push(e.html()); break;
    }
    return array;
}
/**
* setText 設定翻譯文案  (尚未完善)
* e 翻譯的物件
* text 翻譯的文案
*/
function setText(e, textArray) {
    switch (e[0].nodeName.toLowerCase()) {
        case "text": e.val(textArray[0].translatedText); break;
        case "textarea": e.setData(textArray[0].translatedText); break;
        case "select":
            $.each(e[0].options, function (index, value) { value.text = textArray[index].translatedText; });
            break;
        default: e.html(textArray[0].translatedText); break;
    }
}