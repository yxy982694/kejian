(function(){
	'use strict';

	function Tab($elem,options){
		this.$elem=$elem;
		this.options=options;

		this.$items=this.$elem.find('.tab-item');
		this.$panels=this.$elem.find('.tab-panel');

		this.itemNum=this.$items.length;

		this.curIndex=this._getCorrectIndex(this.options.activeIndex);

		this._init();

	}
	Tab.DEFAULTS={
		css3:false,
		js:false,
		event:'click',
		animation:'fade',
		activeIndex:0
	};

	Tab.prototype._init=function(){
		var self=this;
		var yanchi=null;

		// init show
		this.$items.removeClass('tab-item-active');
		this.$items.eq(this.curIndex).addClass('tab-item-active');
		this.$panels.eq(this.curIndex).show();
		this.$elem.trigger('tab-show',[this.curIndex,this.$panels[this.curIndex]]);

		// trigger event
		this.$panels.on('show shown hide hidden',function(e){
			self.$elem.trigger('tab-'+e.type,[self.$panels.index($(this)),this]);
		});
		//showHide 模块初始化
		this.$panels.showHide(this.options);
		

		//bind event绑定事件
		this.options.event=this.options.event==='click'?'click':'mouseenter';
		this.$elem.on(this.options.event,'.tab-item',function(){
			var elem=this;
			if(self.options.delay){
				clearTimeout(yanchi);
				yanchi=setTimeout(function(){self.toggle(self.$items.index($(elem)))},1000);
			}else{
				self.toggle(self.$items.index($(elem)));
			}
			
		});
		//开定时器
		if(this.options.interval&&!isNaN(Number(this.options.interval))){
			this.$elem.hover($.proxy(this.pause,this),$.proxy(this.auto,this));
			this.auto();
		}

	}
	//开启自动切换功能
	Tab.prototype.auto=function(){
		var self=this;
		this.timer=setInterval(function(){
			self.toggle(self._getCorrectIndex(self.curIndex+1));
		},this.options.interval);
	}
	//关闭自动切换功能
	Tab.prototype.pause=function(){
			clearInterval(this.timer);
	}
	Tab.prototype._getCorrectIndex=function(index){
		if(isNaN(Number(index))) return 0;
		if(index<0) return this.itemNum-1;
		if (index>this.itemNum-1) return 0;
		return index;
	}
	Tab.prototype.toggle=function(index){
		if(this.curIndex===index) return;//点击本身什么都不执行
		this.$panels.eq(this.curIndex).showHide('hide');
		this.$panels.eq(index).showHide('show');
		this.$items.eq(this.curIndex).removeClass('tab-item-active');
		this.$items.eq(index).addClass('tab-item-active');
		this.curIndex=index;
	}







	$.fn.extend({
		tab:function(option){
			return this.each(function(){
				var $this=$(this);
				var tab=$this.data('tab');
				var options=$.extend({},Tab.DEFAULTS,$this.data(),typeof option==='object'&&option);
				
				if(!tab){
					$this.data("tab",tab=new Tab($this,options));
				}

				if(typeof tab[option]==='function'){
					tab[option]();
				}
			});
		}
	});
})(jQuery);		