$(function(){
    if(!placeholderSupport()){
        $('[placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    };
    if(!IsPC()){$('body').addClass('touch_body')}else{$('body').addClass('pc_body')}
    //ie浏览器
    if(isIE()){$('html').addClass('isIe');}
    // 获取当前url
})

//placeholder检测
function placeholderSupport() {
	return 'placeholder' in document.createElement('input');
}

//滚动到指定位置
function scrollT($Dom) {
	if($(window).scrollTop() + $(window).height() >= $Dom.offset().top + 200) {
		return true;
	}
}
//判断是否Firefox浏览器
function isFirefox() {
	if(navigator.userAgent.indexOf("Firefox") > -1)
		return true;
	else
		return false;
}
//判断是否IE浏览器
function isIE() {
	if(!!window.ActiveXObject || "ActiveXObject" in window)
		return true;
	else
		return false;
}

//判断是否是PC
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var flag = true;
	for(var v = 0; v < Agents.length; v++) {
		if(userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}



//节流 ，规定时间内执行一次
/* resize节流
 * method:方法
 * delay:每delay执行一次
 * duration:间隔，至少执行一次
 */
function throttle(method,delay,duration){
    var timer=null;
    var begin=new Date();    
    return function(){                
        var context=this, args=arguments;
        var current=new Date();        
        clearTimeout(timer);
        if(current-begin>=duration){
            method.apply(context,args);
            begin=current;
        }else{
            timer=setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    }
}
//demo:window.onscroll=throttle(scrollFn,100,500)


//防抖 在给定时间过去之后仅被调用一次
function debounce(fn, delay) {
	// 维护一个 timer
	var timer = null;

	return function() {
		// 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
		var context = this;
		var args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function() {
			fn.apply(context, args);
		}, delay);
	}
}


//获取滚动条宽度
function getScrollWidth() {
	if(!IsPC()){
		return 0;
	}
    var noScroll, scroll, oDiv = document.createElement("DIV");
    oDiv.style.cssText = "position:absolute;top:-1000px;width:100px;height:100px; overflow:hidden;";
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = "scroll";
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    return noScroll-scroll;
}

function getScrollbarWidth(){
    var odiv = document.createElement('div');//创建一个div
    var styles = { width: '100px',height: '100px', overflowY: 'scroll'};
    var i;
    var scrollbarWidth;
    for (i in styles) {
    	odiv.style[i] = styles[i];
    }
    document.body.appendChild(odiv);//把div添加到body中
    scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;//相减
    odiv.remove();//移除创建的div
    return scrollbarWidth;//返回滚动条宽度
}


//Polyfill

// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}