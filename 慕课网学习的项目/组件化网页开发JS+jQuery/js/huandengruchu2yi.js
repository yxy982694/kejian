(function(){
	'use strict';


	function Slider($elem,options){
		this.$elem=$elem;
		this.options=options;
		this.$items=this.$elem.find('.slider-item');
		this.itemNum=this.$items.length;
		this.$indicators=this.$elem.find('.slider-indicator');
		this.curIndex=this._getCorrectIndex(this.options.activeIndex);
		this.$controls=this.$elem.find('.slider-control');
		// this.$controlLeft=this.$elem.find('.slider-control-left');
		// this.$controlRight=this.$elem.find('.slider-control-right');
		

		this._init();
	}

	Slider.DEFAULTS={
		css3:false,
		js:false,
		animation:'fade',
		activeIndex:0,
		interval:0
	};

	Slider.prototype._init=function(){
		//init show
		
		this._activateIndicators(this.curIndex);
		
		//to
		if(this.options.animation==='slide'){
			//huandengyundong运动是位置的变化,谁做动画，谁调用这个move
			this.$items.move(this.options);
			this.itemWidth=this.$items.eq(0).width();
			this.transitionClass=this.$items.eq(0).hasClass('transition')?'transition':'';
			this.$elem.addClass('slider-slide');
			this.$items.eq(this.curIndex).css('left','0px');
			this.to=this._slide;
			//发送消息
			this.$items.on('move moved',function(e){
			var index=self.$items.index(this);
			if(e.type==='move'){
				if(index===self.curIndex){//这个是当前的
					self.$elem.trigger('slider-hide',[index,this]);
				}else{
					self.$elem.trigger('slider-show',[index,this]);
				}
			}else{
				if(index===self.curIndex){//这个已经是指定的了
					self.$elem.trigger('slider-shown',[index,this]);
				}else{
					self.$elem.trigger('slider-hidden',[index,this]);
				}
			}	
		})
		}else{
			//showHide init,显示隐藏还是在原位置，只是宽高透明度等发生了变化。
			// 谁显示隐藏，谁调用这个showHide
			this.$items.showHide(this.options);
			this.$elem.addClass('slider-fade');
			this.$items.eq(this.curIndex).showHide('show');
			this.to=this._fade;
			//发送消息
			this.$items.on('show shown hide hidden',function(e){
				self.$elem.trigger('slider-'+e.type,[self.$items.index(this),this]);
			});
		}
		
		//bind event
		var self=this;
		this.$elem
		.hover(function(){
			self.$controls.show();
		},function(){
			self.$controls.hide();
		})
		.on('click','.slider-control-left',function(){
			self.to(self._getCorrectIndex(self.curIndex-1),1);
		})
		.on('click','.slider-control-right',function(){
			self.to(self._getCorrectIndex(self.curIndex+1),-1);
		})
		.on('click','.slider-indicator',function(){
			self.to(self._getCorrectIndex(self.$indicators.index($(this))));
		});

		//开定时器
		if(this.options.interval&&!isNaN(Number(this.options.interval))){
			this.$elem.hover($.proxy(this.pause,this),$.proxy(this.auto,this));
			this.auto();
		}
	}
	//激活小圆点
	Slider.prototype._activateIndicators=function(index){
		this.$indicators.eq(index).addClass('slider-indicator-active').siblings().removeClass('slider-indicator-active');
	}
	//当滑动到边时，改变位置
	Slider.prototype._getCorrectIndex=function(index){
		if(isNaN(Number(index))) return 0;
		if(index<0) return this.itemNum-1;
		if (index>this.itemNum-1) return 0;
		return index;
	}
	Slider.prototype._fade=function(index){
		if(index===this.curIndex) return;
		this.$items.eq(this.curIndex).showHide('hide');
		this.$items.eq(index).showHide('show');
		//激活小圆点
		this._activateIndicators(index);
		this.curIndex=index;
	}
	Slider.prototype._slide=function(index,direction){
		if(this.curIndex===index) return;
		var self=this;
		//确定按小圆点滑入滑出的方向
		if(!direction){//点击的是小圆点
			if(this.curIndex<index){
				direction=-1;//向左滑动
			}else if(this.curIndex>index){
				direction=1;//向右滑动
			}
		}

		//确定滑入幻灯片的初始位置
		this.$items.eq(index).removeClass(this.transitionClass).css('left',-1*direction*this.itemWidth);
		//当前幻灯片滑出可视区域，指定幻灯片滑入可视区域
		setTimeout(function(){
			self.$items.eq(self.curIndex).move('x',direction*self.itemWidth);
			self.$items.eq(index).addClass(self.transitionClass).move('x',0);
			//激活对应的小圆点
			self._activateIndicators(index);
			self.curIndex=index;//还没有完成运动时，已经赋值了
		},100);
			
		
		
		//
		
	}
	Slider.prototype.auto=function(){
		var self=this;
		this.timer=setInterval(function(){
			self.to(self._getCorrectIndex(self.curIndex+1),-1);
		},this.options.interval);
	}
	Slider.prototype.pause=function(){
			clearInterval(this.timer);
	}
	$.fn.extend({
		slider:function(option,value){
			return this.each(function(){
				var $this=$(this);
				var slider=$this.data('slider');
				var options=$.extend({},Slider.DEFAULTS,$this.data(),typeof option==='object'&&option);
				if(!slider){
					$this.data("slider",slider=new Slider($this,options));
				}

				if(typeof slider[option]==='function'){
					slider[option](value);
				}
			});
		}
	});

})(jQuery);