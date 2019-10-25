(function(){
	'use strict';
	 var cache={
	 	data:{},
	 	count:0,
	 	addData:function(key,data){
	 		if(!this.data[key]){
	 			this.data[key]=data;
	 			this.count++;
	 		}
	 	},
	 	readData:function(key){
	 		return this.data[key];
	 	},
	 	deleteDataByKey:function(key){
	 		delete this.data[key];
	 		this.count--;
	 	},
	 	deleteDataByOrder:function(num){
	 		var count=0;
	 			for(var p in this.data){
	 				if(count==num){
	 					break;
	 				}
	 				count++;
	 				this.deleteDataByKey(p);
	 			}
	 	}
	 };
	function Search($elem,options){
		this.$elem=$elem;
		this.options=options;
		this.$search=$('.search');
		this.$form=$('.search-form');
		this.$input=$('.search').find('.search-inputbox');
		this.$layer=$('.search').find('.search-layer');
		this.loaded=false;
		this.$elem.on('click','.search-btn',$.proxy(this.submit,this));
		if(this.options.autocomplete){
			this.autocomplete();
		}
	}
	Search.DEFAULTS={
		autocomplete:false,
		url:'https://suggest.taobao.com/sug?code=uft-8&_ksTS=1484204931352_18291&callback=jsonp18292&k=1&area=c2c&bucketid=6&q=',
		css3:false,
		js:false,
		animation:'fade',
		getDataInterval:200
	};
	Search.prototype.submit=function(){
		if(this.getInputVal()===''){
			return false;
		}
		this.$form.submit();
	}
	Search.prototype.autocomplete=function(){
		var self=this;
		var timer=null;
		this.$input
		.on('input',function(){
			if(self.options.getDataInterval){
				clearTimeout(timer);
				timer=setTimeout(function(){
					self.getData();
				},self.options.getDataInterval);
			}else{
				self.getData();
			}
			
		})
		.on('focus',$.proxy(this.showLayer,this))
		.on('click',function(e){
				e.stopPropagation();
		});
		$(document).on('click',$.proxy(this.hideLayer,this));
		this.$layer.showHide(this.options);
	}
	Search.prototype.getData=function(){
		var self=this;
		var inputVal=this.getInputVal();
		if(!inputVal) return self.$elem.trigger('search-noData');
		if(cache.readData(inputVal)) return self.$elem.trigger('search-getData',[cache.readData(inputVal)]);
		if(this.jqXHR) this.jqXHR.abort();
		this.jqXHR=$.ajax({
			url:this.options.url+this.getInputVal(),
			dataType:'jsonp'
		}).done(function(data){
			console.log(data);
			cache.addData(inputVal,data);
			console.log(cache.data);
			console.log(cache.count);
			self.$elem.trigger('search-getData',[data]);
		}).fail(function(){
			self.$elem.trigger('search-noData');
		}).always(function(){
			self.jqXHR=null;
		});
	}
	Search.prototype.showLayer=function(){
		if(!this.loaded) return;
		this.$layer.showHide('show');
	}
	Search.prototype.hideLayer=function(){
		this.$layer.showHide('hide');
	}
	Search.prototype.getInputVal=function(){
		return $.trim(this.$input.val());
	}
	Search.prototype.setInputVal=function(val){
		this.$input.val(removeHtmlTags(val));
		function removeHtmlTags(str){
		return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g,'');
		}
	}
	Search.prototype.appendLayer=function(html){
		this.$layer.html(html);
		this.loaded=!!html;
	}

	$.fn.extend({
		search:function(option,value){
			return this.each(function(){
				var $this=$(this);
				var search=$this.data('search');
				var options=$.extend({},Search.DEFAULTS,$this.data(),typeof option==='object'&&option);
				if(!search){//单例的处理
					$this.data("search",search=new Search($this,options));
				}
				if(typeof search[option]==='function'){
					search[option](value);
				}
			});
		}
	});

})(jQuery);



// (function(){
// 	'use strict';
// 	var $search=$('.search'),
// 		$form=$('.search-form'),
// 		$input=$('.search').find('.search-inputbox'),
// 		$btn=$('.search').find('.search-btn'),
// 		$layer=$('.search').find('.search-layer');
// 	// 验证
// 	$form.on('submit',function(){
// 		if($.trim($input.val())===''){
// 			return false;
// 		}
// 	});


// 	//自动完成
// 	$input.on('input',function(){
// 		var url='https://suggest.taobao.com/sug?code=uft-8&q='+$.trim($input.val())+'&_ksTS=1484204931352_18291&callback=jsonp18292&k=1&area=c2c&bucketid=6';
// 		$.ajax({
// 			url:url,
// 			dataType:'jsonp',
// 			success:function(data){
// 				var html='',
// 					maxNum=10;
// 					if(data['result'].length===0){
// 						$layer.hide().html('');
// 						return;
// 					}
// 				for(var i=0;i<data['result'].length;i++){
// 					if(i>=maxNum) break;
// 					html+='<li class="search-layer-item text-ellipsis">'+data['result'][i][0]+'</li>';
// 				}


// 				$layer.html(html).show();


// 				$layer.on('click','.search-layer-item',function(){
// 					$input.val(removeHtmlTags($(this).html()));
// 					$form.submit();
// 				});


// 				function removeHtmlTags(str){
// 					return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g,'');
// 				}

// 				$input.on('focus',function(){
// 					$layer.show();
// 				}).on('click',function(e){
// 					e.stopPropagation();
// 				});

// 				$(document).on('click',function(){
// 					$layer.hide();
// 				});

// 			},
// 			error:function(error){
// 				$layer.hide().html('');
// 			}
// 		});
// 	});
// })(jQuery);