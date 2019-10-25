(function(){
	'use strict';
	//menu，站点导航
	// $('.menu').on('dropdown-show',function(e){
	// 		var $this=$(this);

	// 		var dataLoad=$this.data('load');
	// 		if(!dataLoad) return;

	// 		if(!$this.data('loaded')){
	// 			var $layer=$this.find('.dropdown-layer');
	// 			var html='';
	// 			$.getJSON("xiala/"+dataLoad,function(data){
	// 				for(var i=0;i<data.length;i++){
	// 				html+='<li><a href="'+data[i].url+'" target="_blank" class="menu-item">'+data[i].name+'</a></li>';
	// 			}
	// 			$layer.html(html);
	// 			$this.data('loaded',true);
	// 		});
	// 		}	
	// 	});
	// $('.menu.dropdown').dropdown({
	// 		event:'clickd',
	// 		css3:true,
	// 		js:true,
	// 		animation:'slideLeftRight',
	// 		active:'menu',
	// 		delay:0
	// });

	$('.menu').on('dropdown-show',function(){
		loadOnce($(this),buildMenuItem);
	}).dropdown({
			event:'clickd',
			css3:true,
			js:true,
			animation:'slideLeftRight',
			active:'menu',
			delay:0
	});


	
	function buildMenuItem($elem,data){
		var html='';
		if(data.length===0) return;
		for(var i=0;i<data.length;i++){
			html+='<li><a href="'+data[i].url+'" target="_blank" class="menu-item">'+data[i].name+'</a></li>';
		}
		$elem.find('.dropdown-layer').html(html);
	}

	$('.cart .dropdown').dropdown({
			event:'hover',
			css3:true,
			js:true,
			animation:'slideLeftRight',
			active:'cart',
			delay:0
	});
	//header search搜索框
	var $headerSearch=$('#header-search');
	var html='',
		maxNum=10;
	$headerSearch.on('search-getData',function(e,data){
		var $this=$(this);
		html=createHeaderSearchLayer(data,maxNum);
		$this.search('appendLayer',html);
		if(html){
			$this.search('showLayer');
		}else{
			$this.search('hideLayer');
		}
	}).on('search-noData',function(e){
		$(this).search('hideLayer').search('appendLayer','');
	}).on('click','.search-layer-item',function(){
		var $this=$(this);
		$this.search('setInputVal',$this.html());
		$this.search('submit');
	});


	$headerSearch.search({
		autocomplete:true,
		css3:false,
		js:false,
		animation:'fade',
		getDataInterval:1000
	});

	function createHeaderSearchLayer(data,maxNum){
		var html='',
			dataNum=data['result'].length;
		if(dataNum===0){
			return '';
		}
		for(var i=0;i<dataNum;i++){
			if(i==maxNum) break;
			html+='<li class="search-layer-item text-ellipsis">'+data['result'][i][0]+'</li>';
		}
		return html;
		alert(html);
	}

	//商品分类category
	$('#focus-category').find('.dropdown').dropdown({
		css3:false,
		js:false,
		animation:'fadeSlideLeftRight'
	});


	$('#focus-category').find('.dropdown').on('dropdown-show',function(){
		loadOnce($(this),createCategoryDetails);
	})
	function createCategoryDetails($elem,data){
		var html='';
		if(data.length===0) return;
		for(var i=0;i<data.length;i++){
			html+='<dl class="category-details cf"><dt class="category-details-title fl"><a href="#" target="_blank" class="category-details-title-link">'+data[i].title+'</a></dt><dd class="category-details-item fl">';
			for(var j=0;j<data[i].items.length;j++){
				html+='<a href="#" target="_blank" class="category-details-title-link">'+data[i].items[j]+'</a>';
			}
			html+='</dd></dl>';
		}
		$elem.find('.dropdown-layer').html(html);
	}
	function loadOnce($elem,success){

			var dataLoad=$elem.data('load');
			if(!dataLoad) return;

			if(!$elem.data('loaded')){
				$elem.data('loaded',true);
				$.getJSON(dataLoad).done(function(data){
					if(typeof success==='function') success($elem,data);
				}).fail(function(data){
					$elem.data('loaded',false)
					;
				});
			};
	}
	// 幻灯片js
	var $focusSlider=$('#focus-slider');
	$focusSlider.slider({
		css3:true,
		js:false,
		animation:'fade',
		activeIndex:0,
		interval:0
	});
	$focusSlider.items={};
	$focusSlider.loadedItemNum=0;
	$focusSlider.totalItemNum=$focusSlider.find('.slider-img').length;
	//幻灯片开始加载时执行的事件
	// $focusSlider.on('slider-show slider-hide slider-shown slider-hidden',loadItem=function(e,index,elem){
	// 	console.log(e.type);
	// });
	// $focusSlider.on('slider-show',loadItem=function(e,index,elem){
	// 	if($focusSlider.items[index]==='loaded') return;
	// 	$focusSlider.trigger('slider-loadItem',[index,elem]);
	// });
	//某个幻灯片没加载过，需要执行的事件
	$focusSlider.on('slider-loadItem',function(e,index,elem){
		var $img=$(elem).find('.slider-img');
		loadImg($img.data('src'),function(url){
				$img.attr('src',url);
				$focusSlider.items[index]='loaded';
				$focusSlider.loadedItemNum++;
				console.log(index+':loaded');
				alert($focusSlider.totalItemNum);
				alert('op'+$focusSlider.loadedItemNum);
				if($focusSlider.loadedItemNum===$focusSlider.totalItemNum){
					$focusSlider.trigger('slider-itemsLoaded');
				}
		},function(url){
			// alert('改图片不存在,这个地址：'+url+'不正确');
			$img.attr('src','img/focus-slider/placeholder.png');
			$focusSlider.loadedItemNum++;
			if($focusSlider.loadedItemNum===$focusSlider.totalItemNum){
					$focusSlider.off('slider-show',loadItem);
			}
	});
	});
	//全部幻灯片加载完成后，需要执行的函数
	$focusSlider.on('slider-itemsLoaded',function(){
		console.log('全部加载完成');
		$focusSlider.off('slider-show',loadItem);
	});
	//加载图片时需要执行的函数
	function loadImg(url,imgLoaded,imgFailed){
		var image=new Image();
		image.onerror=function(){
			if(typeof imgFailed==='function') imgFailed(url);
		}
		image.onload=function(){
			if(typeof imgLoaded==='function') imgLoaded(url);
		}
		setTimeout(function(){
			image.src=url;
		},1000);
	}
	// 今日推荐幻灯片js
	var $todaysSlider=$('#todays-slider');
	$todaysSlider.slider({
		css3:true,
		js:false,
		animation:'slide',
		activeIndex:0,
		interval:0
	});
	$todaysSlider.items={};
	$todaysSlider.loadedItemNum=0;
	$todaysSlider.totalItemNum=$todaysSlider.find('.slider-img').length;
	//幻灯片开始加载时执行的事件
	// $focusSlider.on('slider-show slider-hide slider-shown slider-hidden',loadItem=function(e,index,elem){
	// 	console.log(e.type);
	// });
	$todaysSlider.on('slider-show',loadItem=function(e,index,elem){
		if($todaysSlider.items[index]==='loaded') return;
		$todaysSlider.trigger('slider-loadItem',[index,elem]);
	});
	//某个幻灯片没加载过，需要执行的事件
	$todaysSlider.on('slider-loadItem',function(e,index,elem){
		var $imgs=$(elem).find('.slider-img');
		$imgs.each(function(i,el){
			var $img=$(el);
			loadImg($img.data('src'),function(url){
				$img.attr('src',url);
				$todaysSlider.items[index]='loaded';
				$todaysSlider.loadedItemNum++;
				console.log(index+':loaded');
				alert($todaysSlider.totalItemNum);
				alert('op'+$todaysSlider.loadedItemNum);
				if($todaysSlider.loadedItemNum===$todaysSlider.totalItemNum){
					$todaysSlider.trigger('slider-itemsLoaded');
				}
		},function(url){
			// alert('改图片不存在,这个地址：'+url+'不正确');
			$img.attr('src','img/focus-slider/placeholder.png');
			$todaysSlider.loadedItemNum++;
			if($todaysSlider.loadedItemNum===$todaysSlider.totalItemNum){
					$todaysSlider.off('slider-show',loadItem);
			}
		});
		});
		
	});
	//全部幻灯片加载完成后，需要执行的函数
	$todaysSlider.on('slider-itemsLoaded',function(){
		console.log('全部加载完成');
		$todaysSlider.off('slider-show',loadItem);
	});
})(jQuery);

