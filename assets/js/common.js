/* ---------------------------------------
File:		website all effect
Date:       2022-05
--------------------------------------- */

//=====元素focus===================
jQuery.fn.setfocus = function () {
	return this.each(function () {
		var a = this;
		setTimeout(function () {
			try {
				a.focus()
			} catch (b) { }
		}, 0)
	})
};

//=====說明字轉換===================
function MODAhtmlEncode(e, key) {
	var ele = document.createElement('span');
	ele.appendChild(document.createTextNode(e.attr(key)));
	return ele.innerHTML;
}
// function MODAhtmlEncode(e, type , key) {
// 	var ele = document.createElement('span');
// 	switch (type) {
// 		case "val":
// 			ele.appendChild(document.createTextNode(e.val()));
// 			break;
// 		case "text":
// 			ele.appendChild(document.createTextNode(e.text()));
// 			break;
// 		default :
// 			ele.appendChild(document.createTextNode(e.attr(key)));
// 			break;
// 	}
// 	return ele.innerHTML;
// }

/* ================================================
Start of var set */
var $window = $(window),
	$document = $(document),
	$html = $('html, body'),
	$body = $('body'),
	$navbarSwitch = $('.navbarNavSwitchJs');
	$navbarNav = $('#navbarNav');
	$toTopBtn = $('#topBtn'),
	$loading = $('#loading'),
	$shareBar = $('.shareBar'),
	$ftNav = $('.ftNav'),
	$ftNavSwitch = $('.ftNavSwitchJs'),
	$ftNavSub = $('.ftNavLv2');

var resizeTimer,
	windowWidthUnder768 = false,
	windowWidthUnder992 = false,
	windowWidthUnder1400 = false,
	windowWidthUpper1200 = false,
	windowWidthUpper1940 = false,
	defaultFontSize = 2,
	ftH,
	isZh = true;

var FECommon = FECommon || {};

//=====整站功能====================
(function (FECommon) {
    "use strict";
	var basic = {
		init: function(){
			// this.fn_serviceWorker();
			this.fn_lang();
			this.fn_toTopBtnShow();
			this.fn_hashRun();
			this.fn_wUnder768();
			this.fn_wUnder992();
			this.fn_wUnder1400();
			this.fn_wUpper1200();
			this.fn_wUpper1940();
			this.fn_setFontSize();
			// this.fn_htmlEncode();
		}
		,fn_serviceWorker:function(){
			// // Detects if device is on iOS 
			// const isIos = () => {
			// 	const userAgent = window.navigator.userAgent.toLowerCase();
			// 	return /iphone|ipad|ipod/.test( userAgent );
			// }
			// // Detects if device is in standalone mode
			// const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

			// // Checks if should display install popup notification:
			// if (isIos() && !isInStandaloneMode()) {
			// 	this.setState({ showInstallMessage: true });
			// }

			//檢查browser有無支援serviceWorker
			if('serviceWorker' in navigator){
				//register會回傳一個Promise
				navigator.serviceWorker.register('/assets/js/sw.js')
				.then(function(){
					console.log('Service Worker 註冊成功');
				}).catch(function(error) {
					console.log('Service worker 註冊失敗:', error);
				});
			} else {
				console.log('瀏覽器不支援 Service Worker');
			}

			//加上A2HS
			// // Code to handle install prompt on desktop
			// let deferredPrompt;
			// const addBtn = document.querySelector('.add-button');
			// addBtn.style.display = 'none';
			// window.addEventListener('beforeinstallprompt', (e) => {
			// 	// Prevent Chrome 67 and earlier from automatically showing the prompt
			// 	e.preventDefault();
			// 	// Stash the event so it can be triggered later.
			// 	deferredPrompt = e;
			// 	// Update UI to notify the user they can add to home screen
			// 	addBtn.style.display = 'block';
			// 	addBtn.addEventListener('click', () => {
			// 		// hide our user interface that shows our A2HS button
			// 		addBtn.style.display = 'none';
			// 		// Show the prompt
			// 		deferredPrompt.prompt();
			// 		// Wait for the user to respond to the prompt
			// 		deferredPrompt.userChoice.then((choiceResult) => {
			// 			if (choiceResult.outcome === 'accepted') {
			// 				console.log('User accepted the A2HS prompt');
			// 			} else {
			// 				console.log('User dismissed the A2HS prompt');
			// 			}
			// 			deferredPrompt = null;
			// 		});
			// 	});
			// });
		}
		,fn_lang: function () {
			if (!$('html').is(':lang(zh-tw)')) {
				//英文版
				isZh = false;
			}
		}
		,fn_toTopBtnShow: function () {
			ftH = $('.ftBtm').outerHeight();
			//top button顯示隱藏
			($window.scrollTop() < 200)?$toTopBtn.removeClass('on'):$toTopBtn.addClass('on');
			if(!windowWidthUnder768){
				if($window.scrollTop() + $window.height() > $document.height() - ftH){
					// $toTopBtn.addClass('atBtm');
					$toTopBtn.css('bottom',ftH - 27);
				}else{
					// $toTopBtn.removeClass('atBtm');
					$toTopBtn.css('bottom',100);
				}
			}else{
				$toTopBtn.css('bottom','');
			}
		}
		,fn_hashRun: function(){
			//錨點轉跳
			// if (window.location.hash != '' && $(window.location.hash).length)toTopRun(window.location.hash);
			$body.on('click','a[href^="#"]', function(e) {
				toTopRun(e,$(this).attr('href'));
			});
			function toTopRun(e,_href) {
				var navH;
				if(_href == '#'){
					e.preventDefault();
					return false;
				}
				var $target = $(_href == '#toTop' ? 'html' : _href);
				if(windowWidthUnder1400){
					if(windowWidthUnder768){
						//mobile header height
						navH = 80;
					}else{
						//pad header height
						navH = 116;
					}
				}else{
					//pc header height
					navH = 118;
				}
				var position = $target.stop().offset().top - navH;
				$html.stop().animate({ scrollTop: position },400,'linear', function() {
					//a11y_按top鈕回到頁首導盲磚
					if(_href == '#toTop'){
						$('#AU').focus();
					}
					//a11y_按跳到主要內容鈕focus到主內容
					if(_href == '#main'){
						$('#AC').focus();
					}
				});
				return false;
			}

		}
		,fn_wUnder768: function(){
			windowWidthUnder768 = ($window.outerWidth() <= 768) ? true : false;
		}
		,fn_wUnder992: function(){
			windowWidthUnder992 = ($window.outerWidth() <= 992) ? true : false;
		}
		,fn_wUnder1400: function(){
			windowWidthUnder1400 = ($window.outerWidth() <= 1400) ? true : false;
		}
		,fn_wUpper1200: function(){
			windowWidthUpper1200 = ($window.outerWidth() >= 1200) ? true : false;
		}
		,fn_wUpper1940: function(){
			windowWidthUpper1940 = ($window.outerWidth() >= 1940) ? true : false;
		}
		,fn_setLocalStorage:function(key,data){
			//save font size
			localStorage.setItem(key, data);
		}
		,fn_getLocalStorage:function(key){
			//get storage font size
			if (!localStorage['fontSize']) {
				localStorage.setItem('fontSize', '2');
			}else{
				return localStorage['fontSize'];
			}
		}
		,fn_setFontSize:function(){
			defaultFontSize = this.fn_getLocalStorage('fontSize');
		}
		,fn_loadingOff: function(){
			$loading.fadeOut('slow');
		}
		,fn_loadingOn: function(){
			$loading.fadeIn('slow');
		}
		// ,fn_htmlEncode: function(e, type , key){
		// 	var ele = document.createElement('span');
		// 	switch (type) {
		// 		case "val":
		// 			ele.appendChild(document.createTextNode(e.val()));
		// 			break;
		// 		case "text":
		// 			ele.appendChild(document.createTextNode(e.text()));
		// 			break;
		// 		default :
		// 			ele.appendChild(document.createTextNode(e.attr(key)));
		// 			break;
		// 	}
		// 	return ele.innerHTML;
		// }
	}
	FECommon.basicInit = function(){
		basic.init();
	}
	FECommon.basicToTopBtnShow = function(){
		basic.fn_toTopBtnShow();
	}
	FECommon.basicHashRun = function(){
		basic.fn_hashRun();
	}
	FECommon.basicWUnder768 = function(){
		basic.fn_wUnder768();
	}
	FECommon.basicWUnder992 = function(){
		basic.fn_wUnder992();
	}
	FECommon.basicWUnder1400 = function(){
		basic.fn_wUnder1400();
	}
	FECommon.basicWUpper1200 = function(){
		basic.fn_wUpper1200();
	}
	FECommon.basicWUpper1940 = function(){
		basic.fn_wUpper1940();
	}
	FECommon.basicSetFontSize = function(){
		basic.fn_setFontSize();
	}
	FECommon.basicSetLocalStorage = function(day,key,data){
		basic.fn_setLocalStorage(day,key,data);
	}
	FECommon.basicGetLocalStorage = function(){
		basic.fn_getLocalStorage();
	}
	FECommon.basicLoadingOff = function(){
		basic.fn_loadingOff();
	}
	FECommon.basicLoadingOn = function(){
		basic.fn_loadingOn();
	}
	// FECommon.basicHtmlEncode = function(e, type , key){
	// 	basic.fn_htmlEncode(e, type , key);
	// }

	/* END of basic 
	================================================*/

	var header = {
		init: function () {
			this.fn_headerSticky();
			this.fn_navSet();
			this.fn_navClose();
			this.fn_sideNavSwitch();
			this.fn_fontSize();
			this.fn_searchArea();
		}
		,fn_headerSticky: function(){
			($window.scrollTop() >= parseInt($('.header').height())) ? $body.addClass('hdFixed'):$body.removeClass('hdFixed');
		}
		,fn_navSet:function(){
			//navbar multilayer
			$('[data-submenu]').submenupicker();
			
			//若母選項要連結
			$('#navbarNav .dropdown-toggle').click(function (e) {
				if(!windowWidthUnder1400){
					window.location = $(this).attr('href');
				}else{
					e.preventDefault();
				}
			});

			$('#navbarNav .nav-item').mouseout(function () { 
				if(!windowWidthUnder1400){
					$(this).find('.nav-link').blur().removeClass('show').next().removeClass('show');
				}
			});
		}
		,fn_navClose:function(){
			//主選單自動關閉
			if(!windowWidthUnder1400 && $('.navbarNavSwitchJs').attr('aria-expanded')=='true'){
				$('#navbarNav').offcanvas('hide').find('.show').removeClass('show');
			}
		}
		,fn_sideNavSwitch: function(){
			//主選單開關
			if($navbarSwitch.length){
				function openSideNav(e){
					e.attr({
						'title':e.data('closetitle'),
						'aria-expanded':'true'
					}).find('.visually-hidden').text(e.data('closetitle'));
				}
				function closeSideNav(e){
					$('#navbarNav .on').removeClass('on');
					e.attr({
						'title':e.data('opentitle'),
						'aria-expanded':'false'
					}).find('.visually-hidden').text(e.data('opentitle'));
				}
				var myOffcanvas = document.getElementById('navbarNav');
				myOffcanvas.addEventListener('show.bs.offcanvas', function () {
					openSideNav($navbarSwitch);
				})
				myOffcanvas.addEventListener('hide.bs.offcanvas', function () {
					closeSideNav($navbarSwitch);
				})
			}
		}
		,fn_fontSize:function(){
			var $fsNav = $('.fontSizeDdJs');
			var $fsNavOn = $('.fontSizeDdNow');
			var $fsSub = $fsNav.find('.dropdown-menu');
			var onTxt,onTitle,onNum,onClass;
			var ckTxt,ckTitle,ckNum,ckClass;
			function getOn(){
				onTxt = $fsNavOn.find('span').html();
				onTitle = $fsNavOn.attr('title');
				onNum = $fsNavOn.attr('data-order');
				onClass = $fsNavOn.find('i').attr('class');
			}
			getOn();
			$fsSub.find('button').on({
				click:function(){
					var $this = $(this);
					ckTxt = $this.html();
					ckTitle = $this.attr('title');
					ckNum = $this.attr('data-order');
					ckClass = 'ci ci-font' + ckNum;
					$fsNavOn.attr({
						title:ckTitle,
						'data-order':ckNum
					}).find('span').html(ckTxt);
					$fsNavOn.find('i').attr('class',ckClass);
					$this.attr({
						title:onTitle,
						'data-order':onNum
					}).html(onTxt);
					getOn();
					$fsSub.find('li').sort(
						function(a,b){
							return $(a).find('button').attr("data-order") - $(b).find('button').attr("data-order");
						}
					).appendTo($fsSub);
					if(ckNum == 1){
						$('body').removeClass('fontSizeL fontSizeM fontSizeS').addClass('fontSizeL');
					}
					if(ckNum == 2){
						$('body').removeClass('fontSizeL fontSizeM fontSizeS').addClass('fontSizeM');
					}
					if(ckNum == 3){
						$('body').removeClass('fontSizeL fontSizeM fontSizeS').addClass('fontSizeS');
					}
					FECommon.basicSetLocalStorage('fontSize', ckNum);
					// FECommon.widgetMarqueeUpdate();
				}
			});
			if(defaultFontSize!=2){
				$fsNav.find('button[data-order='+defaultFontSize+']').click();
			}
		}
		,fn_theme:function(){
			// var $fsNav = $('.fontSizeDdJs');
			// var $fsNavOn = $('.fontSizeDdNow');
			// var $fsSub = $fsNav.find('.dropdown-menu');
			// var onTxt,onTitle,onNum;
			// var ckTxt,ckTitle,ckNum;
			// function getOn(){
			// 	onTxt = $fsNavOn.html();
			// 	onTitle = $fsNavOn.attr('title');
			// 	onNum = $fsNavOn.attr('data-order');
			// }
			// getOn();
			// $fsSub.find('button').on({
			// 	click:function(){
			// 		var $this = $(this);
			// 		ckTxt = $this.html();
			// 		ckTitle = $this.attr('title');
			// 		ckNum = $this.attr('data-order');
			// 		$fsNavOn.attr({
			// 			title:ckTitle,
			// 			'data-order':ckNum
			// 		}).html(ckTxt);
			// 		$this.attr({
			// 			title:onTitle,
			// 			'data-order':onNum
			// 		}).html(onTxt);
			// 		getOn();
			// 		$fsSub.find('li').sort(
			// 			function(a,b){
			// 				return $(a).find('button').attr("data-order") - $(b).find('button').attr("data-order");
			// 			}
			// 		).appendTo($fsSub);
			// 		if(ckNum == 1){
			// 			$('body').removeClass('fontSizeL fontSizeM fontSizeS').addClass('fontSizeL');
			// 		}
			// 		if(ckNum == 2){
			// 			$('body').removeClass('fontSizeL fontSizeM fontSizeS').addClass('fontSizeM');
			// 		}
			// 		if(ckNum == 3){
			// 			$('body').removeClass('fontSizeL fontSizeM fontSizeS').addClass('fontSizeS');
			// 		}
			// 		FECommon.basicSetLocalStorage('fontSize', ckNum);
			// 		// FECommon.widgetMarqueeUpdate();
			// 	}
			// });
			// if(defaultFontSize!=2){
			// 	$fsNav.find('button[data-order='+defaultFontSize+']').click();
			// }
		}
		,fn_searchArea: function(){
			//打開搜尋
			$body.on('click','.searchSwitchBtnJs', function() {
				$('.searchAreaJs').addClass('on');
				if(windowWidthUnder1400){
					$('.navbarNavSwitchJs').click();
					$('body').addClass('fullH');
				}
				setTimeout(function() {
					$('.searchAreaIptJs').setfocus();
				},300);
			});
			//關閉搜尋
			$body.on('click','.closeBtnJs,.searchAreaMaskJs', function() {
				$('.searchAreaJs').removeClass('on');
				$(".searchAreaIptJs").val('');
				$('body').removeClass('fullH');
			});
			//a11y_關閉搜尋
			$('.searchSwitchBtnJs,.closeBtnJs').on('keydown', function (e) {
				if(e.which === 13) {
					$('.searchSwitchBtnJs').setfocus();
				}
			})
		}
		

	}
	FECommon.headerInit = function(){
		header.init();
	}
	FECommon.headerHeaderSticky = function(){
		header.fn_headerSticky();
	}
	FECommon.headerNavSet = function(){
		header.fn_navSet();
	}
	FECommon.headerNavClose = function(){
		header.fn_navClose();
	}
	FECommon.headerSideNavSwitch = function(){
		header.fn_sideNavSwitch();
	}
	FECommon.headerFontSize = function(){
		header.fn_fontSize();
	}
	FECommon.headerSearchArea = function(){
		header.fn_searchArea();
	}
	
	/* END of header 
	================================================*/

	var footer = {
		init: function(){
			this.fn_ftNavSwitch();
			this.fn_ftNavStyle();
			this.fn_ftSubNavStyle();
		}
		,fn_ftNavSwitch: function(){
			function openFtNav(e){
				//開選單
				var closetitle = MODAhtmlEncode(e,'data-closetitle');
				// $ftNavSub.slideDown(300).css('display','flex');
				$('.ftNavLv2').slideDown(350);
				$('.ftNav').removeClass('off');
				// $('.ftNavLt > div:not(:first-child)').removeClass().addClass('col-2');
				// $('.ftNavLt > div:first-child').removeClass().addClass('col-4');
				e.attr('title',closetitle).find('.visually-hidden').html(closetitle);
			}
			function closeFtNav(e){
				//關選單
				var opentitle = MODAhtmlEncode(e,'data-opentitle');
				$('.ftNavLv2').slideUp(350);
				e.attr('title', opentitle).find('.visually-hidden').html(opentitle);
				setTimeout(function(){
					$('.ftNav').addClass('off');
					// $('.ftNavLt > div').removeClass().addClass('col');
				},250);
			}
			($('.ftNav').hasClass('off'))?closeFtNav($('.ftNavSwitchJs')):openFtNav($('.ftNavSwitchJs'));
			$body.on('click','.ftNavSwitchJs',function() {
				if ($('.ftNav').hasClass('off')) {
					openFtNav($(this));
				} else {
					closeFtNav($(this));
				}
			});
		}
		,fn_ftNavStyle:function(){
			if ($('.ftNavLtI > li').length <= 6) {
				$('.ftNavLtI').addClass('itemLessThen6');
			}
		}
		,fn_ftSubNavStyle:function(){
			if($('.ftNavLt > div').length > 5){
				$('.ftNavLt').addClass('itemMoreThen5');
			}else{
				$('.ftNavLt').removeClass('itemMoreThen5');
			}
		}
	}
	FECommon.footerInit = function(){
		footer.init();
	}
	FECommon.footerFtNavSwitch = function(){
		footer.fn_ftNavSwitch();
	}
	FECommon.footerFtNavStyle = function(){
		footer.fn_ftNavStyle();
	}
	FECommon.footerFtSubNavStyle = function(){
		footer.fn_ftSubNavStyle();
	}
	
	/* END of footer 
	================================================*/

	var main = {
		init: function(){
			this.fn_socialShare();
			this.fn_sidebar();
			this.fn_datePicker();
			this.fn_conSearchBar();
		}
		,fn_socialShare:function(){
			var link = encodeURIComponent(location.href);
            function newOpen(url) {
                // if (confirm(txtGoOutsite +'\n'+ url)) {
                    var mywin = window.open(url, "redirect");
                    // var someCallback = function (url) {
                        mywin.open(url, "redirect");
                //     };
                // }
            }
			$body.on('click','.fbShareJs',function(){
				var url = 'http://www.facebook.com/share.php?u='.concat(link);
				newOpen(url);
			});
			$body.on('click','.ttShareJs',function(){
				var url = 'https://twitter.com/share?url='.concat(link);
				newOpen(url);
			});
			$body.on('click','.lineShareJs',function(){
				var url = 'https://lineit.line.me/share/ui?url='.concat(link);
				newOpen(url);
			});
			$body.on('click','.printJs',function(){
				if($('.lazy').length){
					if (allLoaded) {
						window.print();
					} else {
						printRequested = true;
						wLazyLoad.loadAll();
					}
				}else{
					window.print();
				}
			});

			$body.on('focus','.shareBar > li > a',function(){
				$(this).parent('li').addClass('on');
			});
			$body.on('keydown','.shareBarMenu li:last-child a',function (e) {
				//在最後一個分享鈕focusout往後
				if (e.which === 9 && !e.shiftKey) {
					$(this).parents('.list-inline-item').removeClass('on');
				}
			});
			$body.on('keydown','.shareBar > li > a',function (e) {
				//在分享鈕往前focusout往前
				if(e.which === 9 && e.shiftKey) {
					$(this).parents('.list-inline-item').removeClass('on');
				}
			});
			$body.on('mouseout','.shareBar li',function (e) {
				// console.log('out');
				$(this).removeClass('on');
				$(this).children('a').blur();
			});
		}
		,fn_sidebar:function(){
			$('.sidebarJs .menuSub').prev('a').addClass('hasSub');
			$body.on('click','.sidebarJs .menuI',function(){
				var _this = $(this);
				_this.parent('li').siblings().removeClass('on').find('.menuSub').slideUp(300);
				if(_this.parent('li').hasClass('on')){
					_this.parent('li').removeClass('on').find('.menuSub').slideUp(300);
				}else{
					_this.parent('li').find('.menuSub').slideDown(300);
					setTimeout(function(){
						_this.parent('li').addClass('on');
					},50)
				}
			});
		}
		,fn_datePicker:function(){
			if(isZh){
				//日期選擇功能_設定中文語系
				$.datepicker.regional['zh-TW']={
					dayNames:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
					dayNamesMin:["日","一","二","三","四","五","六"],
					monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
					monthNamesShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
					prevText:"上月",
					nextText:"次月",
					weekHeader:"週",
					dateFormat: 'yy-mm-dd',
					changeMonth: true,
					changeYear: true,
					showMonthAfterYear:true
				};
				$.datepicker.setDefaults($.datepicker.regional["zh-TW"]);
			}else{
				//日期選擇功能_設定英文語系
				$.datepicker.regional['en-US']={
					dateFormat: 'yy-mm-dd',
					changeMonth: true,
					changeYear: true,
					showMonthAfterYear:true
				};
				$.datepicker.setDefaults($.datepicker.regional["en-US"]);
			}

			//點日曆icon顯示日曆
			function showDatePicker(e){
				e.parents('.searchI').find('.datepicker1').datepicker('show');
			}
			$('.datepicker1').datepicker();
			$body.on('click','.calendarBtn1',function(){
				showDatePicker($(this));
			});
		}
		,fn_conSearchBar:function(){
			$body.on('click','.searchSwitchJs', function() {
				($('.conSearchBarJs').hasClass('off'))?openconSearch($(this)):closeconSearch($(this));
			});
			function openconSearch(e){
				$('.conSearchBarJs').removeClass('off');
				var closetitle = MODAhtmlEncode(e,'data-closetitle');
				e.attr('title', closetitle).find('.visually-hidden').html(closetitle);
				e.find('.ci').removeClass('ci-open').addClass('ci-close');
				//datapicker init
				// FECommon.mainDatePicker();
			}
			function closeconSearch(e){
				$('.conSearchBarJs').addClass('off');
				var opentitle = MODAhtmlEncode(e,'data-opentitle');
				e.attr('title', opentitle).find('.visually-hidden').html(opentitle);
				e.find('.ci').removeClass('ci-close').addClass('ci-open');
			}
		}
	}
	
	FECommon.mainInit = function(){
		main.init();
	}
	FECommon.mainSocialShare = function(){
		main.fn_socialShare();
	}
	FECommon.mainSidebar = function(){
		main.fn_sidebar();
	}

	/* END of main 
	================================================*/

	var widget = {
		init: function () {
			this.fn_setVideo();
			this.fn_kv1Swiper();
			this.fn_idxList1Swiper();
			this.fn_idxList2Swiper();
			this.fn_idxList3Swiper();
			this.fn_idxList4Swiper();
			this.fn_magnific();
			// this.fn_marquee();
			// this.fn_lazyload();
			this.fn_aos();
		}
		,fn_setVideo:function(){
			function labnolIframe(div) {
				var iframe = document.createElement('iframe');
				iframe.setAttribute('src', 'https://www.youtube.com/embed/' + div.dataset.id + '?autoplay=1&rel=0');
				iframe.setAttribute('title', div.dataset.title);
				iframe.setAttribute('frameborder', '0');
				iframe.setAttribute('allowfullscreen', '1');
				iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
				div.parentNode.replaceChild(iframe, div);
			}
			function initYouTubeVideos() {
				var playerElements = document.getElementsByClassName('ytPlayer');
				for (var n = 0; n < playerElements.length; n++) {
					var videoTitle = playerElements[n].dataset.title;
					var videoId = playerElements[n].dataset.id;
					var div = document.createElement('div');
					div.setAttribute('data-id', videoId);
					div.setAttribute('data-title', videoTitle);
					var thumbNode = document.createElement('img');
					thumbNode.src = '//i.ytimg.com/vi/ID/hqdefault.jpg'.replace('ID', videoId);
					thumbNode.alt = videoTitle;
					div.appendChild(thumbNode);
					var playButton = document.createElement('div');
					playButton.setAttribute('class', 'play');
					div.appendChild(playButton);
					div.onclick = function () {
						labnolIframe(this);
					};
					playerElements[n].appendChild(div);
				}
			}
			initYouTubeVideos();
		}
		,fn_kv1Swiper:function(){
			//kv
			if ($('.kv1SwiperJs .swiper-slide').length > 1) {
				var $slides,$activeSlides,$dot,$activeDot;
				//a11y_dot帶入標題文字
				var dotTxt = [];
				$('.kv1SwiperJs .swiper-slide').each(function(){
					if($(this).find('.kvTxt').length){
						dotTxt.push($(this).find('.kvTxt').text())
					}
					if($(this).find('.ytPlayer').length){
						dotTxt.push($(this).find('.ytPlayer').data('title'))
					}
				});
				var kv1Swiper = new Swiper('.kv1SwiperJs', {
					pagination: {
						el: '.kv1SwiperPageJs'
						,clickable:true
						,renderBullet: function (index, className) {
							return '<span class="' + className + '"><i>' + dotTxt[index] + '</i></span>';
						}
					}
					,navigation: {
						nextEl: '.kv1SwiperNextBtnJs'
						,prevEl: '.kv1SwiperPrevBtnJs'
					}
					,autoplay: {
						delay: 7000
						,disableOnInteraction: false
						// ,pauseOnMouseEnter:true
					}
					,loop: true
					,observer: true
					,observeParents: true
					,watchOverflow: true
					,on:{
						afterInit:function(){
							setA11y();
							// FECommon.widgetKvVide();
						},
						slideChangeTransitionEnd:function(){
							setA11y();
						}
					}
				});

				//a11y_set=====
				function setA11y(){
					$slides = $('.kv1SwiperJs .swiper-slide');
					$activeSlides = $('.kv1SwiperJs .swiper-slide-active');
					$dot = $('.kv1SwiperPageJs .swiper-pagination-bullet');
					$activeDot = $('.kv1SwiperPageJs .swiper-pagination-bullet-active');
					$slides.attr('aria-hidden','true');
					$slides.find('a, iframe').attr('tabindex', -1);
					$activeSlides.attr('aria-hidden','');
					$activeSlides.find('a, iframe').attr('tabindex','');
					$dot.attr('aria-current','');
					$activeDot.attr('aria-current','true');
				}
				//focusIn停止autoplay
				$('.kv1SwiperPrevBtnJs').on('focus',function(){
					kv1Swiper.autoplay.stop();
				});
				$('.kv1SwiperPageJs span:last-child').on('focus',function(){
					kv1Swiper.autoplay.stop();
				});
				//focusOut繼續autoplay
				$('.kv1SwiperPrevBtnJs').on('keydown', function (e) {
					//在往前鈕focusout往前
					if(e.which === 9 && e.shiftKey) {
						kv1Swiper.autoplay.start();
					}
				});
				$('.kv1SwiperPageJs span:last-child').on('keydown', function (e) {
					//在最後一個點點focusout往後
					if (e.which === 9 && !e.shiftKey) {
						kv1Swiper.autoplay.start();
					}
				});
				
			}else{
				$('.kv1SwiperJs').addClass('oneKv');
			}
		}
		,fn_idxList1Swiper:function(){
			//主要議題
			if ($('.idxList1SwiperJs').length) {
				var sectionTitle = $('.idxIssue h2').text();
				var idxList1Swiper = new Swiper('.idxList1SwiperJs', {
					pagination: {
						el: '.idxList1SwiperPageJs'
						,clickable:true
						,renderBullet: function (index, className) {
							return '<span class="' + className + '"><i>第'+ (index+1)+'組'+sectionTitle+'</i></span>';
						}
					}
					,navigation: {
						nextEl: '.idxList1SwiperNextBtnJs'
						,prevEl: '.idxList1SwiperPrevBtnJs'
					}
					// ,loop: true
					,observer: true
					,observeParents: true
					,watchOverflow:true
					,breakpoints: {
						1500:{
							slidesPerGroup:4
							,slidesPerView:4
						},
						1200:{
							slidesPerGroup:3
							,slidesPerView:3
						},
						992:{
							slidesPerGroup:2
							,slidesPerView:2
						}
					}
					,on:{
						afterInit:function(){
							slideAlignCenter();
						}
						,resize:function(){
							slideAlignCenter();
						}
					}
				});
				function slideAlignCenter(){
					if($('.idxList1SwiperPrevBtnJs').hasClass('swiper-button-lock')){
						$('.idxList1SwiperJs .swiper-wrapper').css('justify-content','center');
					}else{
						$('.idxList1SwiperJs .swiper-wrapper').css('justify-content','');
					}
				}
			}
		}
		,fn_idxList2Swiper:function(){
			//政策計畫
			var idxList2 = $('.tab-pane .idxList2');
			var idxList2Swiper;
			var sectionTitle;
			// var swiperWrap = $('.idxList2SwiperJs');
			var swiperItem = $('.tab-pane .idxList2SwiperJs .swiper-slide');
			if(!idxList2.hasClass('initSwiper')){
				setSwiper();
				// console.log('run siwper fun==========');
			}
			// console.log('item num:'+swiperItem.not('.swiper-slide-duplicate').length);
			// console.log('is init:'+idxList2.hasClass('initSwiper'));
			if(windowWidthUpper1940){
				// console.log('大於1940');
				if(swiperItem.not('.swiper-slide-duplicate').length > 5 && !idxList2.hasClass('initSwiper')){
					setSwiper();
				}else if(swiperItem.not('.swiper-slide-duplicate').length <= 5 && idxList2.hasClass('initSwiper')){
					removeSwiper();
				}
				return false;
			}
			if(windowWidthUpper1200){
				// console.log('大於1200');
				if(swiperItem.not('.swiper-slide-duplicate').length > 3 && !idxList2.hasClass('initSwiper')){
					setSwiper();
				}else if(swiperItem.not('.swiper-slide-duplicate').length <= 3 && idxList2.hasClass('initSwiper')){
					removeSwiper();
				}
				return false;
			}

			if(!windowWidthUpper1200){
				// console.log('小於1200');
				if(swiperItem.not('.swiper-slide-duplicate').length > 1 && !idxList2.hasClass('initSwiper')){
					setSwiper();
				}else if(swiperItem.not('.swiper-slide-duplicate').length <= 1 && idxList2.hasClass('initSwiper')){
					removeSwiper();
				}
				return false;
			}

			function setSwiper(){
				sectionTitle = $('.idxPlan h2').text();			
				idxList2Swiper = new Swiper('.tab-pane .idxList2SwiperJs', {
					pagination: {
						el: '.tab-pane .idxList2SwiperPageJs'
						,clickable:true
						,renderBullet: function (index, className) {
							return '<span class="' + className + '"><i>第'+ (index+1)+'組'+sectionTitle+'</i></span>';
						}
					}
					,navigation: {
						nextEl: '.idxList2SwiperNextBtnJs'
						,prevEl: '.idxList2SwiperPrevBtnJs'
					}
					,centeredSlides: true
					// ,centerInsufficientSlides:true
					,loop: true
					,observer: true
					,observeParents: true
					// ,watchOverflow:true
					,breakpoints: {
						1940:{
							slidesPerView:6
						}
						,1200:{
							slidesPerView:4
						}
						,768:{
							slidesPerView:2
						}
					}
					,on:{
						afterInit:function(e){
							// console.log('setSwiper');
							idxList2.removeClass('lowItem').addClass('initSwiper');
						}
					}
				});
			}
			
			function removeSwiper(){
				// console.log('removeSwiper');
				if(idxList2Swiper != undefined){
					idxList2Swiper.destroy();
				}
				idxList2.addClass('lowItem').removeClass('initSwiper');
				setTimeout(function(){
					$('.tab-pane .idxList2SwiperJs .swiper-wrapper').css('transform','none');
				},50);
			}
		}
		,fn_idxList3Swiper:function(){
			//相關連結
			if ($('.idxList3SwiperJs').length) {
				var sectionTitle = $('.idxPartner h2').text();
				var idxList3Swiper = new Swiper('.idxList3SwiperJs', {
					pagination: {
						el: '.idxList3SwiperPageJs'
						,clickable:true
						,renderBullet: function (index, className) {
							return '<span class="' + className + '"><i>第'+ (index+1)+'組'+sectionTitle+'</i></span>';
						}
					}
					,navigation: {
						nextEl: '.idxList3SwiperNextBtnJs'
						,prevEl: '.idxList3SwiperPrevBtnJs'
					}
					// ,loop: true
					,observer: true
					,observeParents: true
					,breakpoints: {
						1200:{
							slidesPerGroup:5
							,slidesPerView:5
						}
						,992:{
							slidesPerGroup:4
							,slidesPerView:4
						}
						,768:{
							slidesPerGroup:3
							,slidesPerView:3
						}
						,376:{
							slidesPerGroup:2
							,slidesPerView:2
						}
					}
					,on:{
						afterInit:function(){
							slideAlignCenter();
						}
						,resize:function(){
							slideAlignCenter();
						}
					}
				});
				function slideAlignCenter(){
					if($('.idxList3SwiperPrevBtnJs').hasClass('swiper-button-lock')){
						$('.idxList3SwiperJs .swiper-wrapper').css('justify-content','center');
					}else{
						$('.idxList3SwiperJs .swiper-wrapper').css('justify-content','');
					}
				}
			}
		}
		,fn_idxList4Swiper:function(){
			//影音專區
			if ($('.idxList4SwiperJs .swiper-slide').length > 1) {
				var $activeSlides,$dot,$activeDot;
				var $slides = $('.idxList4SwiperJs .swiper-slide');
				var videoId = [];
				var videoTitle = [];
				$slides.each(function(i){
					videoId[i] = $(this).find('.ytPlayer').data('id');
					videoTitle[i] = $(this).find('.ytPlayer').data('title');
				});

				//a11y_dot帶入標題文字
				var dotTxt = [];
				$('.idxList4SwiperJs .swiper-slide').each(function(){
					dotTxt.push($(this).find('.ytPlayer').data('title'))
				});
				var idxList4Swiper = new Swiper('.idxList4SwiperJs', {
					pagination: {
						el: '.idxList4SwiperPageJs'
						,clickable:true
						,renderBullet: function (index, className) {
							return '<span class="' + className + '"><i>' + dotTxt[index] + '</i></span>';
						}
					}
					,navigation: {
						nextEl: '.idxList4SwiperNextBtnJs'
						,prevEl: '.idxList4SwiperPrevBtnJs'
					}
					,slidesPerView: 2
					,centeredSlides: true
					,loop: true
					,observer: true
					,observeParents: true
					,watchOverflow: true
					,breakpoints: {
						0: {
							slidesPerView: 1,
						},
						992: {
							slidesPerView: 2,
						}
					}
					,on:{
						afterInit:function(){
							setA11y();
							// FECommon.widgetKvVide();
						}
						,slideChangeTransitionStart: function(e){
							var prevIdx = this.previousIndex-2 ;
							if( prevIdx > -1 ){
								$(".idxList4SwiperJs").find("[data-swiper-slide-index='" + prevIdx + "']").html('<div class="ytWrap"><div class="ytPlayer rounded-4" data-id="'+videoId[prevIdx]+'" data-title="'+videoTitle[prevIdx]+'"></div></div><b class="title">'+videoTitle[prevIdx]+'</b>');
								FECommon.widgetSetVideo();
							}
						}
						,slideChangeTransitionEnd:function(){
							setA11y();
						}
					}
				});

				//a11y_set=====
				function setA11y(){
					$slides = $('.idxList4SwiperJs .swiper-slide');
					$activeSlides = $('.idxList4SwiperJs .swiper-slide-active');
					$dot = $('.idxList4SwiperPageJs .swiper-pagination-bullet');
					$activeDot = $('.idxList4SwiperPageJs .swiper-pagination-bullet-active');
					$slides.attr('aria-hidden','true');
					$slides.find('.ytPlayer .play').attr('tabindex', -1);
					$activeSlides.attr('aria-hidden','');
					$activeSlides.find('.ytPlayer .play').attr('tabindex',0);
					$dot.attr('aria-current','');
					$activeDot.attr('aria-current','true');
					$body.on('keyup','.ytPlayer > div',function(e){
						if (e.key === 'Enter' || e.keyCode === 13) {
							$(this).click();
						}
					});
				}
				
			}else{
				$('.idxList4').addClass('lowItem');
			}
		}
		,fn_magnific:function(){
			//圖片lightbox
			$('.picZoomJs').each(function() {
				var _this = $(this);
				var txtMagnificClose =_this.data('mctxtclose');
				var txtMagnificPrev =_this.data('mctxtprev');
				var txtMagnificNext =_this.data('mctxtnext');
				var txtMagnificNum =_this.data('mctxtnum');
				_this.magnificPopup({
					delegate: 'a',
					type: 'image',
					closeOnContentClick: false,
					closeBtnInside: false,
					tClose:txtMagnificClose,
					mainClass: 'mfp-with-zoom mfp-img-mobile',
					image: {
						verticalFit: true,
						titleSrc: function(item) {
							return item.el.find('b').html();
						}
					},
					gallery: {
						enabled: true
						,tPrev: txtMagnificPrev
						,tNext: txtMagnificNext
						,tCounter: '<span title="'+txtMagnificNum+'">%curr% of %total%</span>'
					},
					zoom: {
						enabled: true,
						duration: 300, // don't foget to change the duration also in CSS
						opener: function(element) {
							return element.find('img');
						}
					}
				});
			});
		}
		// ,fn_marquee:function(){
		// 	$('.hintJs').marquee({
		// 		pauseSpeed:7000
		// 		,pauseOnHover:true
		// 	});
		// 	$('.hintJs a').on('focus',function() {
		// 		$(".hintJs").marquee("pause");
		// 	});
		// 	$('.closeHintJs').on('focus',function() {
		// 		FECommon.widgetMarqueeUpdate();
		// 	});
		// }
		// ,fn_marqueeUpdate:function(){
		// 	$('.hintJs').marquee('pause');
		// 	$('.hintJs').find('li').css('left',-3000).eq(0).css('left',0);
		// 	setTimeout(function(){
		// 		$('.hintJs').marquee('update');
		// 		$('.hintJs').marquee('resume');
		// 	},500);
		// }
		// ,fn_lazyload:function(){
		// 	//wait add
		// 	var myLazyLoad = new LazyLoad();
		// }
		,fn_aos:function(){
			// AOS.init();
			AOS.init({
				// Global settings:
				// disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
				// startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
				// initClassName: 'aos-init', // class applied after initialization
				// animatedClassName: 'aos-animate', // class applied on animation
				// useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
				// disableMutationObserver: false, // disables automatic mutations' detections (advanced)
				// debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
				// throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
				// Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
				offset: 100, // offset (in px) from the original trigger point
				delay: 100, // values from 0 to 3000, with step 50ms
				duration: 800, // values from 0 to 3000, with step 50ms
				// easing: 'ease', // default easing for AOS animations
				// once: false, // whether animation should happen only once - while scrolling down
				// mirror: false, // whether elements should animate out while scrolling past them
				// anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
			});

			// document.addEventListener('aos:out:idxStory', ({ detail }) => {
			// 	console.log('animated out', detail);
			// });
		}
	}
	FECommon.widgetInit = function(){
		widget.init();
	}
	FECommon.widgetSetVideo = function(){
		widget.fn_setVideo();
	}
	FECommon.widgetKv1Swiper = function(){
		widget.fn_kv1Swiper();
	}
	FECommon.widgetIdxList1Swiper = function(){
		widget.fn_idxList1Swiper();
	}
	FECommon.widgetIdxList2Swiper = function(){
		widget.fn_idxList2Swiper();
	}
	FECommon.widgetIdxList3Swiper = function(){
		widget.fn_idxList3Swiper();
	}
	FECommon.widgetIdxList4Swiper = function(){
		widget.fn_idxList4Swiper();
	}
	// FECommon.widgetMagnific = function(){
	// 	widget.fn_magnific();
	// }
	// FECommon.widgetMarquee = function(){
	// 	widget.fn_marquee();
	// }
	// FECommon.widgetMarqueeUpdate = function(){
	// 	widget.fn_marqueeUpdate();
	// }
	// FECommon.widgetLazyload = function(){
	// 	widget.fn_lazyload();
	// }
	FECommon.widgetAos = function(){
		widget.fn_aos();
	}

	/* END of widget 
	================================================*/

	var a11y = {
		init: function () {
			this.fn_navFocus();
			this.fn_searchPop();
		}
		,fn_navFocus:function(){
			$('#navbarNav .dropdown-toggle').on('focus',function(){
				$(this).closest('li').addClass('on');
			});
			$('#navbarNav .dropdown-toggle').on('click', function(e) {
				$(this).parent('li').removeClass('on');
				$(this).parent('li').siblings('.on').removeClass('on');
			});
			
			$('#navbarNav .nav-item').each(function(){
				//每個項目的最後一個子項目focusout往後時
				$(this).find('li:last').find('a').on('keydown', function (e) {
					if (e.which === 9 && !e.shiftKey) {
						$(this).parents('.on').removeClass('on');
					}
				});
				//每個項目focusout往前時
				$(this).find('.nav-link').on('keydown', function (e) {
					if(e.which === 9 && e.shiftKey) {
						$(this).parents('.on').removeClass('on');
					}
				});
			});
			$document.on('click',function() {
				if($navbarNav.find('on')){
					$('#navbarNav .on').removeClass('on');
				}
			});
		}
		,fn_searchPop:function(){
			//tab out搜尋區自動關閉
			$('.searchAreaJs .closeBtnJs').on('keydown', function (e) {
				if (e.which === 9 && !e.shiftKey) {
					$('.searchAreaJs').removeClass('on');
					$(".searchAreaIptJs").val('');
				}
			});
		}
	}
	FECommon.a11yInit = function(){
		a11y.init();
	}
	FECommon.a11yNavFocus = function(){
		a11y.fn_navFocus();
	}
	/* END of a11y 
	================================================*/

	var documentOnReady = {
		init: function () {
			FECommon.basicInit();
			FECommon.headerInit();
			FECommon.footerInit();
			FECommon.widgetInit();
			FECommon.a11yInit();
		}
	}
	FECommon.documentOnReadyInit = function(){
		documentOnReady.init();
	}
	/* END of documentOnReady 
	================================================*/

	var documentOnLoad = {
		init: function () {
			FECommon.mainInit();
		}
	}
	FECommon.documentOnLoadInit = function(){
		documentOnLoad.init();
	}
	/* END of documentOnLoad 
	================================================*/

	var documentOnResize = {
		init: function () {
			FECommon.basicWUnder768();
			FECommon.basicWUnder992();
			FECommon.basicWUnder1400();
			FECommon.basicWUpper1200();
			FECommon.basicWUpper1940();
			FECommon.headerNavClose();
			FECommon.widgetIdxList2Swiper();
			// FECommon.widgetMarqueeUpdate();
		}
	}
	FECommon.documentOnResizeInit = function(){
		documentOnResize.init();
	}
	/* END of documentOnResize 
	================================================*/

	var documentOnScroll = {
		init: function () {
			FECommon.basicToTopBtnShow();
			FECommon.headerHeaderSticky();
		}
	}
	FECommon.documentOnScrollInit = function(){
		documentOnScroll.init();
	}
	/* END of documentOnScroll 
	================================================*/

})(FECommon);



/* ================================================
    Start of run function */
$(document).ready(function(){
	FECommon.documentOnReadyInit();
	// FECommon.basicLoadingOff();//關閉loading
	// FECommon.basicLoadingOn();//開啟loading
	
});

$window.on( 'load', FECommon.documentOnLoadInit);

$window.on( 'scroll', FECommon.documentOnScrollInit);

$window.on( 'resize', function() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		FECommon.documentOnResizeInit();
	}, 250);
});