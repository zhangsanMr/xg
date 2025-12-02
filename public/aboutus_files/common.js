//缓存dom
var $uiHeader = null;
var keyWidth = 1200; //导航变换节点
var scrollbarWidth = getScrollbarWidth(); //滚动条宽度

$(function() {
	$uiHeader = $(".ui-header");
	
	initHeader();
	
	/*initWow();*/
	
	bindSiderMenuEvent();
	
	bindHeaderEvent();
	
	//reszie事件
	$(window).resize(throttle(function(){
		initHeader();
	},40,80));
	
	beforScrollTop = $(window).scrollTop();
	$(window).scroll(throttle(function(){
		var scrollTop = $(window).scrollTop();
		var direction = scrollTop > beforScrollTop ? 'down' : 'up';
		setHeaderDisplay(direction,scrollTop);
		beforScrollTop = scrollTop;
	},40,40));
	
});

//初始化导航元素
function initHeader(width) {
	$(".ui-header .navigation").removeAttr("style");
	$(".ui-header .navigation>li").removeClass('active');
	$('body').removeClass('header-lock');
	
	if(greaterBreakpoint()) {
		$uiHeader.removeClass("mini expand");
	} else {
		$uiHeader.addClass("mini");
	}
}

//绑定header相关事件
function bindHeaderEvent(){
	$(".ui-header .navigation>li").hover(function(){
		if(greaterBreakpoint()){
			$(this).addClass('hover');
			/*$(this).find('.child').stop().slideDown();*/
		}
	},function(){
		if(greaterBreakpoint()){
			$(".ui-header .navigation>li").removeClass('hover');
			/*$(this).find('.child').stop().slideDown();*/
		}
	});
	
	// $(".ui-header .navigation>li>a").click(function(event){
	// 	event.preventDefault();
	// 	var url = $(this).attr('href').toLowerCase();
	// 	if(url.length > 0 && url != 'javascript:;'){
	// 		window.location = url;
	// 	}else{
	// 		$(this).parent().toggleClass('active');
	// 	}
	// });
	
	//搜索
	$(".ui-header .search input").focus(function() {
		$(this).parent().addClass("focus")
	});
	$(".ui-header .search input").blur(function() {
		$(this).parent().removeClass("focus")
	});
	
	//切换导航
	$(".ui-header .nav-btn").click(function() {
		$uiHeader.toggleClass("expand");
		$(".ui-header .navigation").fadeToggle(300);
		$('body').toggleClass('header-lock');
	});
}

function setHeaderDisplay(direction,scrollTop){


	if(scrollTop > 80){
		$uiHeader.addClass('hide');
		$(".ui-header .navigation>li").removeClass('hover');
	}else{
		$uiHeader.removeClass('hide');
	}
	return;
	if(greaterBreakpoint()){
		if(direction == 'down'){
			if(scrollTop > 120){
				$uiHeader.addClass('hide');
				$(".ui-header .navigation>li").removeClass('hover');
			}else{
				$uiHeader.removeClass('hide');
			}
		}else{
			//$uiHeader.removeClass('hide');
		}
	}else{
		//$uiHeader.removeClass('hide');
	}
}


/*//初始化wow.js
function initWow(){
	if(!$("html").hasClass("ie8") && !$("html").hasClass("ie9")){
		new WOW({mobile:false,live:true}).init();
	}
}*/

//绑定侧边栏相关事件
function bindSiderMenuEvent(){
	$('.ui-sider-menu .top-menu a').click(function(event){
		if($(this).parent('.top-menu').siblings('.menu-list').find('a').length>0){
			if($(this).parent('.top-menu').siblings('.menu-list').css('display')=='none'){
				$(this).closest('li').toggleClass('active');
				$(this).parents('li').find('.menu-list').toggle();
				return false;
			}else{
				$(this).closest('li').toggleClass('active');
				$(this).parents('li').find('.menu-list').toggle();
			}
		}else{
			// alert(2)
		}
	});






	// $('.ui-sider-menu .top-menu a').click(function(event){
	// 	event.preventDefault();
	// 	var url = $(this).attr('href');
	// 	if(!url || url.toLowerCase() == 'javascript:;'){
	// 		$(this).closest('li').toggleClass('active')
	// 		// if($(this).parent().next().hasClass('ThirdNav')){
	// 		// 	$(this).parent().next().toggle();
	// 		// }
	// 		$(this).parents('li').find('.menu-list').toggle();
	// 	}else{
	// 		window.location = url;
	// 	}
	// });
	
	


	// 三级导航的显示隐藏
	// $('.ui-sider-menu ul li .menu-list div a').click(function(){
	// 	event.preventDefault();
	// 	var url = $(this).attr('href');
	// 	console.log(url)
	// 	if(!url || url.toLowerCase() == 'javascript:;'){
	// 		if($(this).parent().next().hasClass('ThirdNav')){
	// 			$(this).parent().next().toggle();
	// 		}
	// 	}else{
	// 		window.location = url;
	// 	}
	// })
}


//判读是否到临界点
function greaterBreakpoint(){
	return $(window).width()  > keyWidth - scrollbarWidth
}
