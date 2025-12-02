/*dropmenu by justyeh*/
(function($) {
	$.fn.dropmenu = function(options) {
		var selectorText = '.ui-select';
		
		//覆盖默认配置
		var opts = $.extend({}, $.fn.dropmenu.defaults, options);
		
		var $select = $(selectorText);
		
		$(document).click(function(e){
			if($(e.target).closest(selectorText).length == 0){
				$select.removeClass('focus')
			}
		    /*if( !$wrap.is(e.target) && $wrap.has(e.target).length == 0 ){
		       	$wrap.removeClass("focus");
		    }*/
		});
		
		return this.each(function() {
			
			var $self = $(this);
			var $p = $self.find("p");
			var $options = $self.find("a");
			
			
			var val = $p.text();
			if(!val){
				val = $options.eq(0).text();
				$p.text(val);
			}
			
			$options.each(function(){
				if($(this).text() == val){
					$(this).addClass('selected');
				}
			});
			
			$p.click(function(){
				var $parent = $(this).parent();
				if($parent.hasClass('focus')){
					$select.removeClass('focus');
				}else{
					$select.removeClass('focus');
					$parent.addClass('focus');
				}
			});
				
			$options.click(function(){
				
				$options.removeClass('selected');
				$p.text($(this).text());
				
				$(this).addClass('selected');
				$(this).closest(selectorText).removeClass('focus');
				
				if(typeof opts.onSelected =="function"){
					opts.onSelected($(this));
				}
			});
			
		});
	};
	
	$.fn.dropmenu.setDirection = function(){
		console.log()
	}
	//默认设置
	$.fn.dropmenu.defaults = {
		onSelected:null, //onSelected callback
	};
})(jQuery);