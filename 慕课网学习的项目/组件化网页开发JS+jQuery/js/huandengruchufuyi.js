(function(){
	'use strict';


	function Slider($elem,options){
		this.$elem=$elem;
		this.options=options;
		this.$container=this.$elem.find('.slider-container');
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
		interval:0,
		loop:false
	};

	Slider.prototype._init=function(){
		//init show
		
		this._activateIndicators(this.curIndex);
		
		//to
		if(this.options.animation==='slide'){
			//huandengyundong运动是位置的变化,谁做动画，谁调用这个move
			this.$elem.addClass('slider-slide');
			this.itemWidth=this.$items.eq(0).width();
			this.$container.css('left',-1*this.curIndex*this.itemWidth);
			this.to=this._slide;
			//move init
			this.$container.move(this.options);//谁运动，谁调用

			if(this.options.loop){
				this.$container.append(this.$items.eq(0).clone());
				this.transitionClass=this.$items.eq(0).hasClass('transition')?'transition':'';
				this.itemNum++;
			}
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
	Slider.prototype._getCorrectIndex=function(index,maxNum){
		maxNum=maxNum||this.itemNum;
		if(isNaN(Number(index))) return 0;
		if(index<0) return maxNum-1;
		if (index>maxNum-1) return 0;
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
		var self=this;
		if(this.curIndex===index) return;
		this.$container.move('x',-1*index*this.itemWidth);
		this.curIndex=index;
		if(this.options.loop&&direction){
			if(direction<0){
				if(index===0){
					this.$container.removeClass('transition').css('left','0px');
					this.curIndex=index=1;
					setTimeout(function(){
						self.$container.addClass('transition').move('x',-1*index*self.itemWidth);
					},20);
				}
				
			}else{
				if(index===this.itemNum-1){
					this.$container.removeClass('transition').css('left',-1*index*this.itemWidth);	
					this.curIndex=index=this.itemNum-2;
					setTimeout(function(){
						self.$container.addClass('transition').move('x',-1*index*self.itemWidth);
					},20);
				}
			}
			index=this._getCorrectIndex(index,this.itemNum-1);
		}
		//激活小圆点
		this._activateIndicators(index);
		
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