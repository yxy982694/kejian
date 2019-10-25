var isMouseDown=false;
var lastPoint={};
var targetX,targetY; 
$('#title').on('mousedown',function(e){
	console.log(e);
	isMouseDown=true;
	lastPoint.x=e.pageX;
	lastPoint.y=e.pageY;
}).on('mousemove',function(e){
	if(isMouseDown){
		var dialog=$('#dialog');
		targetX=parseInt(dialog.css('left'))+e.pageX-lastPoint.x;
		targetY=parseInt(dialog.css('top'))+e.pageY-lastPoint.y;
		dialog.css('left',targetX+'px');
		dialog.css('top',targetY+'px');
		lastPoint.x=e.pageX;
		lastPoint.y=e.pageY;
	}
}).on('mouseup',function(){
	isMouseDown=false
	lastPoint={};
});
