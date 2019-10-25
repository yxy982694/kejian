(function(){
	'use strict';
	var dropdown={};
	//header部分下拉菜单
	$('.menu').on('dropdown-show',function(){
		dropdown.loadOnce($(this),dropdown.buildMenuItem);
	}).dropdown({
			event:'clickd',
			css3:true,
			js:true,
			animation:'slideLeftRight',
			active:'menu',
			delay:0
	});
	//构建下拉菜单下拉层的菜单项
	dropdown.buildMenuItem=function($elem,data){
		var html='';
		if(data.length===0) return;
		for(var i=0;i<data.length;i++){
			html+='<li><a href="'+data[i].url+'" target="_blank" class="menu-item">'+data[i].name+'</a></li>';
		}
		$elem.find('.dropdown-layer').html(html);
	};
	$('.cart .dropdown').dropdown({
			event:'hover',
			css3:true,
			js:true,
			animation:'slideLeftRight',
			active:'cart',
			delay:0
	});
	//header search搜索框
	var search={};
	search.$headerSearch=$('#header-search');
	search.$headerSearch.html='';
	search.$headerSearch.maxNum=10;
	search.$headerSearch.on('search-getData',function(e,data){
		var $this=$(this);
		search.$headerSearch.html=search.$headerSearch.createHeaderSearchLayer(data,search.$headerSearch.maxNum);
		$this.search('appendLayer',search.$headerSearch.html);
		if(search.$headerSearch.html){
			$this.search('showLayer');
		}else{
			$this.search('hideLayer');
		}
		}).on('search-noData',function(e){
			$(this).search('hideLayer').search('appendLayer','');
		}).on('click','.search-layer-item',function(){
			search.$headerSearch.search('setInputVal',$(this).html());
			search.$headerSearch.search('submit');
	});
	search.$headerSearch.search({
		autocomplete:true,
		css3:false,
		js:false,
		animation:'fade',
		getDataInterval:100
	});
	search.$headerSearch.createHeaderSearchLayer=function(data,maxNum){
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
	}
	//图片加载器
	var imgLoader={};
	imgLoader.loadImg=function(url,imgLoaded,imgFailed){
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
	};
	imgLoader.loadImgs=function($imgs,success,fail){
		$imgs.each(function(_,el){
		var $img=$(el);
		imgLoader.loadImg($img.data('src'),function(url){
			$img.attr('src',url);
			success();
		},function(url){
			console.log('从'+url+'加载图片失败');
			fail($img,url);
			});
		});
	}
	//lazy load
	var lazyLoad={};
	lazyLoad.loadUntil=function(options){
		var items={};
		var loadItemfn=null;
		var loadedItemNum=0;
		var $elem=options.$container;
		var id=options.id;
		$elem.on(options.triggerEvent,loadItemfn=function(e,index,elem){
			if(items[index]==='loaded') return;
			$elem.trigger(id+'-loadItems',[index,elem,function(){
				loadedItemNum++;
				items[index]='loaded';
				if(loadedItemNum===options.totalItemNum){
					$elem.trigger(id+'-itemsLoaded');
				}
			}]);
		});
		//全部幻灯片加载完成后，需要执行的函数
		$elem.on(id+'-itemsLoaded',function(e,index,elem){
			console.log('全部加载完成');
			$elem.off(options.triggerEvent,loadItemfn);
		});
	}
	//判断是否在可视区域内
	lazyLoad.isVisible=function(floorData){
		var keshigao=floor.$win.height();
		var gundonggao=floor.$win.scrollTop();
		var juwendanggao=floorData.offsetTop;
		var yuansugao=floorData.height;
		var tiaojian1=(keshigao+gundonggao)>juwendanggao;
		var tiaojian2=gundonggao<juwendanggao+yuansugao;
		return tiaojian1&&tiaojian2;
	}
	//商品分类category,下拉菜单
	$('#focus-category').find('.dropdown').dropdown({
		css3:true,
		js:false,
		animation:'fadeSlideLeftRight',
		active:'category'
	});
	//给商品分类绑定dropdown-show事件，在dropdown.js中触发的
	$('#focus-category').find('.dropdown').on('dropdown-show',function(){
		dropdown.loadOnce($(this),dropdown.createCategoryDetails);
	})
	//加载商品分类下拉层中的内容
	dropdown.createCategoryDetails=function($elem,data){
		var html='';
		if(data.length===0) return;
		for(var i=0;i<data.length;i++){
			html+='<dl class="category-details cf"><dt class="category-details-title fl"><a href="#" target="_blank" class="category-details-title-link">'+data[i].title+'</a></dt><dd class="category-details-item fl">';
			for(var j=0;j<data[i].items.length;j++){
				html+='<a href="#" target="_blank" class="category-details-title-link">'+data[i].items[j]+'</a>';
			}
			html+='</dd></dl>';
		}
		setTimeout(function(){
			$elem.find('.dropdown-layer').html(html);
		},1000);
		
	};
	//保证下拉层中的内容只加载一下，根据是否获得json数据
	dropdown.loadOnce=function($elem,success){
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
	};
	// focus中的幻灯片
	var slider={};
	slider.$todaysSlider=$('#todays-slider');
	//今日推荐使用move.js模块
	slider.$todaysSlider.slider({
		css3:true,
		js:false,
		animation:'slide',
		activeIndex:0,
		interval:0
	});
	//focus中的幻灯片使用showHide.js模块
	slider.$focusSlider=$('#focus-slider');
	slider.$focusSlider.slider({
		css3:true,
		js:false,
		animation:'fade',
		activeIndex:0,
		interval:0
	});
	//focus中的幻灯片使用按需加载
	lazyLoad.loadUntil({
		$container:slider.$focusSlider,
		totalItemNum:slider.$focusSlider.find('.slider-img').length,
		triggerEvent:'slider-show',
		id:'slider'
	});
	slider.$focusSlider.on('slider-loadItems',function(e,index,elem,success){
		imgLoader.loadImgs($(elem).find('.slider-img'),success,function($img,url){
			$img.attr('src','img/focus-slider/placeholder.png');
		});
	});
	//今日推荐使用按需加载
	lazyLoad.loadUntil({
		$container:slider.$todaysSlider,
		totalItemNum:slider.$todaysSlider.find('.todays-img').length,
		triggerEvent:'slider-show',
		id:'slider'
	});
	slider.$todaysSlider.on('slider-loadItems',function(e,index,elem,success){
		imgLoader.loadImgs($(elem).find('.todays-img'),success,function($img,url){
			$img.attr('src','img/todays-slider/placeholder.png');
		});
	});
	// floor部分
	var floor={};
	floor.$floor=$('.floor');
	floor.floorData = [{
        num: '1',
        text: '服装鞋包',
        tabs: ['大牌', '男装', '女装'],
        offsetTop: floor.$floor.eq(0).offset().top,
        height: floor.$floor.eq(0).height(),
        items: [
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }]
        ]
    }, {
        num: '2',
        text: '个护美妆',
        tabs: ['热门', '国际大牌', '国际名品'],
        offsetTop: floor.$floor.eq(1).offset().top,
        height: floor.$floor.eq(1).height(),
        items: [
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }]
        ]
    }, {
        num: '3',
        text: '手机通讯',
        tabs: ['热门', '品质优选', '新机尝鲜'],
        offsetTop: floor.$floor.eq(2).offset().top,
        height: floor.$floor.eq(2).height(),
        items: [
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }],
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }],
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }]
        ]
    }, {
        num: '4',
        text: '家用电器',
        tabs: ['热门', '大家电', '生活电器'],
        offsetTop: floor.$floor.eq(3).offset().top,
        height: floor.$floor.eq(3).height(),
        items: [
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }],
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }],
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }]
        ]
    }, {
        num: '5',
        text: '电脑数码',
        tabs: ['热门', '电脑/平板', '潮流影音'],
        offsetTop: floor.$floor.eq(4).offset().top,
        height: floor.$floor.eq(4).height(),
        items: [
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }],
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }],
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }]
        ]
    }];
    //构建楼层数据(包括：head部分和body部分)
    floor.bulidFloor=function(floorData){
    	var html='';
    	html+='<div class="container">';
    	html+=floor.bulidFloorHead(floorData);
    	html+=floor.bulidFloorBody(floorData);
    	html+='</div>';
    	return html;
    }
    //构建楼层数据的head部分
    floor.bulidFloorHead=function(floorData){
     	var html='';
     	html+='<div class="floor-head">';
		html+='<h2 class="floor-title fl">';
		html+='<span class="floor-title-num">'+floorData.num+'F</span><span class="floor-title-text">'+floorData.text+'</span></h2>';
		html+='<ul class="tab-item-wrap fr">';	
		for(var i=0;i<floorData.tabs.length;i++){
			html+='<li class="fl"><a href="javascript:;" class="tab-item">'+floorData.tabs[i]+'</a></li>';
			if(i!==floorData.tabs.length-1){
				html+='<li class="floor-divider fl text-hidden">分割线</li>';
			}
		}
		html+='</ul></div>';
     	return html;
    }
    //构建楼层数据的body部分
    floor.bulidFloorBody=function(floorData){
     	var html='';
     	html+='<div class="floor-body">';
     	for(var i=0;i<floorData.items.length;i++){
     		html+='<ul class="tab-panel">';
     		for(var j=0;j<floorData.items[i].length;j++){
     			html+='<li class="floor-item fl">';
     			html+='<p class="floor-item-pic"><a href="#" target="_blank"><img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/'+floorData.num+'/'+(i+1)+'/'+(j+1)+'.png" alt=""></a></p>';
				html+='<p class="floor-item-name"><a href="#" target="_blank" class="link">'+floorData.items[i][j].name+'</a></p>';
				html+='<p class="floor-item-price">'+floorData.items[i][j].price+'</p>';
				html+='</li>';
     		}
     		html+='</ul>';
     	}
     	html+='</div>';
     	return html;
    }
	floor.$win=$(window);
	floor.$doc=$(document);
	//楼层在可视区域内时开始显示
	floor.timeToShow=function(){
		floor.$floor.each(function(index,elem){
			if(lazyLoad.isVisible(floor.floorData[index])){
				floor.$doc.trigger('floor-show',[index,elem]);
				}
			});
	}
	//通过滚动和改变窗口大小来执行开始显示函数
	floor.$win.on('scroll resize',floor.showFloor=function(){
		clearTimeout(floor.floorTimer);
		floor.floorTimer=setTimeout(floor.timeToShow,250);
	});
	//给楼层绑定事件，开始加载楼层中的图片
	floor.$floor.on('tab-loadItems',function(e,index,elem,success){
		console.log('第'+floor.$floor.index(this)+'楼的'+$(this).find('.tab-item').eq(index).html()+'图片正在加载');
		imgLoader.loadImgs($(elem).find('.floor-img'),success,function($img,url){
			$img.attr('src','img/floor/placeholder.png');
		});
	});
	//给文档绑定事件，开始加载楼层信息
	floor.$doc.on('floor-loadItems',function(e,index,elem,success){
		var html=floor.bulidFloor(floor.floorData[index]);
		var $elem=$(elem);
		success();
		setTimeout(function(){
			$elem.html(html);
			//某一楼层加载完成后，开始给该楼层的图片按需加载
			lazyLoad.loadUntil({
				$container:$elem,
		    	totalItemNum:$elem.find('.floor-img').length,
		    	triggerEvent:'tab-show',
		    	id:'tab'
			});
			$elem.tab({
				css3:false,
				js:false,
				event:'mouseenter',
				animation:'fade',
				activefloorIndex:1,
				interval:0,
				delay:0
			});
			},1000);
	});
	//全部楼层加载完成后，解除绑定事件中的函数
	floor.$doc.on('floor-itemsLoaded',function(e,index,elem){
		console.log('全部加载完成');
		floor.$win.off('scroll resize',floor.showFloor);
	});
	//楼层按需加载
	lazyLoad.loadUntil({
		$container:floor.$doc,
    	totalItemNum:floor.$floor.length,
    	triggerEvent:'floor-show',
    	id:'floor'
	});
	//elevator电梯，判断是第几层处于显示状态(-1,0,1,2,3)
	floor.whichFloor=function(){
		var num=-1;
		floor.$floor.each(function(index,elem){
			num=index;
			var floorData=floor.floorData[index];
			var juwendanggao=floorData.offsetTop;
			var gundonggao=floor.$win.scrollTop();
			if(juwendanggao>gundonggao+floor.$win.height()/2){
				num=index-1;
				return false;
			}
		});
		return num;
	}
	floor.$elevator=$('#elevator');
	floor.$elevator.$items=floor.$elevator.find('.elevator-item');
	//某一层显示，让对应的楼层号激活
	floor.setElevator=function(){
		var num=floor.whichFloor();
		if(num===-1){
			floor.$elevator.fadeOut();
		}else{
			floor.$elevator.fadeIn();
			floor.$elevator.$items.eq(num).addClass('elevator-active').siblings().removeClass('elevator-active');
		}
	}
	//通过窗口的滚动或改变大小，来时刻判断是哪一层在显示
	floor.$win.on('scroll resize',function(){
		clearTimeout(floor.elevatorTimer);
		floor.elevatorTimer=setTimeout(floor.setElevator,250);
	});
	//点击楼层号，让窗口滚动对应楼层居文档的高度
	floor.$elevator.on('click','.elevator-item',function(){
		$('html,body').animate({
			scrollTop:floor.floorData[$(this).index()].offsetTop
		});
	});
	//点击侧边栏中的回到顶部按钮，让文档滚动为0
	$('.backToTop').on('click',function(){
		$('html,body').animate({
			scrollTop:0
		});
	});	
})(jQuery);