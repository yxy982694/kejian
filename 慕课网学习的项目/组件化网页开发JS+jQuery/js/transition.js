(function(){
	var transitionEndEventName={
		transition:'transitionend',
		MozTransition:'transitionend',
		WebkitTransition:'webkitTransitionend',
		OTransiton:'OTransitonEnd otransitionend'
	};
	var transitionEnd='',
	 	isSupport=false;
	for(var name in transitionEndEventName){
		if(document.body.style[name]!==undefined){
			transitionEnd=transitionEndEventName[name];
			isSupport=true;
			break;
		}
	}
	// alert(transitionEnd);
	window.mt=window.mt||{};
	window.mt.transition={
		end:transitionEnd,
		isSupport:isSupport
	}
})();