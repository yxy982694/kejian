(function(){
	'use strict';



	var init=function($elem){
		this.$elem=$elem;
		this.curX=parseFloat(this.$elem.css('left'));
		this.curY=parseFloat(this.$elem.css('top'));
	}
	var to=function(x,y,callBack){
		y=(typeof y==='number')?y:this.curY;
		x=(typeof x==='number')?x:this.curX;
		if(x===this.curX&&y===this.curY) return;
		this.$elem.trigger('move',[this.$elem]);
		if(typeof callBack==='function') callBack();

		this.curX=x;
		this.curY=y;
	}

	// Silent模块
	var Silent=function($elem){
		init.call(this,$elem);
		this.$elem.removeClass('transition');
	}
	Silent.prototype.to=function(x,y){
		var self=this;
		to.call(this,x,y,function(){
			self.$elem.css({
				left:x,
				top:y
			});
			self.$elem.trigger('moved',[self.$elem]);

		});	
	}
	Silent.prototype.x=function(x){

		this.to(x);

	}
	Silent.prototype.y=function(y){
		this.to(null,y);
	}
	// Css3模块
	var transition=window.mt.transition;
	var transitionxiefa='';
	if(transition.isSupport){
		transitionxiefa=transition.end;
	}
	var Css3=function($elem){
		init.call(this,$elem);
		this.$elem.css({
			left:this.curX,
			top:this.curY
		});
		
		this.$elem.addClass('transition');
	}
	Css3.prototype.to=function(x,y){
		var self=this;
		to.call(this,x,y,function(){
				self.$elem.off(transitionxiefa).one(transitionxiefa,function(){
					self.$elem.trigger('moved',[self.$elem]);
				});
				self.$elem.css({
					left:x,
					top:y
				});
		});	
	}
	Css3.prototype.x=function(x){
		this.to(x);
	}
	Css3.prototype.y=function(y){
		this.to(null,y);
	}

	// js模块
	var Js=function($elem){
		init.call(this,$elem);
		this.$elem.removeClass('transition');
	}
	Js.prototype.to=function(x,y){
		var self=this;
		to.call(this,x,y,function(){
			self.$elem.stop().animate({
				left:x,
				top:y
			},1000,function(){
			self.$elem.trigger('moved',[self.$elem]);
			});
		});
	}
	Js.prototype.x=function(x){
		this.to(x);
	}
	Js.prototype.y=function(y){
		this.to(null,y);
	}





	

	var Move=function($elem,options){
		var mode=null;
		if(options.css3&&transition.isSupport){
			mode=new Css3($elem);
		}else if(options.js){
			mode=new Js($elem);
		}else{
			mode=new Silent($elem);
		}
		// console.log(mode);
		// return mode;不直接返回mode，因为我们不想让你知道太多的东西
		return {
			to:$.proxy(mode.to,mode),
			x:$.proxy(mode.x,mode),
			y:$.proxy(mode.y,mode)
		};
	}
	var defaults={
		css3:false,
		js:false
	};

	$.fn.extend({
		move:function(option,x,y){
			return this.each(function(){
				var $this=$(this);
				var move=$this.data('move');
				var options=$.extend({},defaults,typeof option==='object'&&option);
				if(!move){
					$this.data("move",move=Move($this,options));
				}

				if(typeof move[option]==='function'){
					move[option](x,y);
				}
			});
		}
	});

})(jQuery);