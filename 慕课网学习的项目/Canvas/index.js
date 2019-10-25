(function(){
	window.canvasLock=function(obj){
		this.height=obj.height;
		this.width=obj.width;
		this.chooseType=obj.chooseType;
	};

	canvasLock.prototype.initDom=function(){
		var wrap=document.createElement('div');
		var str='<h4 id="title" class="title">绘制解锁图案</h4>';
		wrap.setAttribute('style','position:absolute;top:0;left:50%;margin-left:-150px;border:2px solid red;');

		var canvas=document.createElement('canvas');
		canvas.setAttribute('id','canvas');
		canvas.style.cssText="background-color:#305066;display:inline-block;border:2px solid yellow;"

		wrap.innerHTML=str;
		wrap.appendChild(canvas);

		var width=this.width||300;
		var height=this.height||300;

		document.body.appendChild(wrap);

		// canvas.style.width=width+"px";
		// canvas.style.height=height+"px";

		canvas.width=width;
		canvas.height=height;

	}
	canvasLock.prototype.drawCle=function(x,y){
		this.ctx.strokeStyle="#cfe6ff";
		this.ctx.lineWidth=2;
		this.ctx.beginPath();
		this.ctx.arc(x,y,this.r,0,Math.PI*2,true);
		this.ctx.closePath();
		this.ctx.stroke();
	}
	canvasLock.prototype.createCircle=function(){
		var n=this.chooseType;
		var count=0;
		this.r=this.ctx.canvas.width/(2+4*n);
		this.lastPoint=[];
		this.arr=[];
		this.restPoint=[];
		var r=this.r;
		for(var i=0;i<n;i++){
			for(var j=0;j<n;j++){
				count++;
				var obj={x:j*4*r+3*r,y:i*4*r+3*r,index:count};
				this.arr.push(obj);
				this.restPoint.push(obj);
			}
		}
		this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
		for(var i=0;i<this.arr.length;i++){
			this.drawCle(this.arr[i].x,this.arr[i].y);
		}
	}
	canvasLock.prototype.bindEvent=function(){
		var self=this;
		this.canvas.addEventListener('touchstart',function(e){
			var po=self.getPosition(e);
			for(var i=0;i<self.arr.length;i++){
				if(Math.abs(po.x-self.arr[i].x)<self.r&&Math.abs(po.y-self.arr[i].y)<self.r){
					self.touchFlag=true;
					self.lastPoint.push(self.arr[i]);
					self.restPoint.splice(i,1);
					break;

				}
			}
		},false);
		this.canvas.addEventListener('touchmove',function(e){
			if(self.touchFlag){
				self.update(self.getPosition(e));
			}
		},false);
		this.canvas.addEventListener('touchend',function(e){
			if(self.touchFlag){
				self.storePass(self.lastPoint);
				setTimeout(function(){
					self.reset();
				},300);
			}
		},false);
	}


	canvasLock.prototype.storePass=function(){
		if(this.checkPass()){
			document.getElementById('title').innerHTML="解锁成功";
			this.drawStatusPoint("#2cff26");
		}else{
			document.getElementById('title').innerHTML="解锁失败";
			this.drawStatusPoint("red");
		}
	}
	canvasLock.prototype.checkPass=function(){
		var p1='123';
		var p2='';
		for(var i=0;i<this.lastPoint.length;i++){
			p2+=this.lastPoint[i].index;
		}
		alert(p2);
		return p1===p2;
	}
	canvasLock.prototype.drawStatusPoint=function(type){
		for(var i=0;i<this.lastPoint.length;i++){
			this.ctx.strokeStyle=type;
			this.ctx.beginPath();
			this.ctx.arc(this.lastPoint[i].x,this.lastPoint[i].y,this.r,0,Math.PI*2,true);
			this.ctx.closePath();
			this.ctx.stroke();
		}
	}


	canvasLock.prototype.reset=function(){
		this.createCircle();
	}



	canvasLock.prototype.update=function(po){
		this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
		for(var i=0;i<this.arr.length;i++){
			this.drawCle(this.arr[i].x,this.arr[i].y);
		}
		this.drawPoint();
		this.drawLine(po);

		for(var i=0;i<this.restPoint.length;i++){
			if(Math.abs(po.x - this.restPoint[i].x)<this.r&&Math.abs(po.y - this.restPoint[i].y)<this.r){
				this.drawPoint();
				this.lastPoint.push(this.restPoint[i]);
				this.restPoint.splice(i,1);
				break;
			}
		}
	}

	canvasLock.prototype.drawPoint=function(){
		for(var i=0;i<this.lastPoint.length;i++){
			this.ctx.fillStyle="#cfe6ff";
			this.ctx.beginPath();
			this.ctx.arc(this.lastPoint[i].x,this.lastPoint[i].y,this.r/2,0,Math.PI*2,true);
			this.ctx.closePath();
			this.ctx.fill();
		}
	}

	canvasLock.prototype.drawLine=function(po,lastPoint){
		this.ctx.beginPath();
		this.ctx.lineWidth=3;
		this.ctx.moveTo(this.lastPoint[0].x,this.lastPoint[0].y);
		for(var i=1;i<this.lastPoint.length;i++){
			this.ctx.lineTo(this.lastPoint[i].x,this.lastPoint[i].y);
		}
		this.ctx.lineTo(po.x,po.y);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	
	

	canvasLock.prototype.getPosition=function(e){
		var rect=e.currentTarget.getBoundingClientRect();
		var po={
			x:e.touches[0].clientX-rect.left,
			y:e.touches[0].clientY-rect.top
		};
		return po;
	}


	canvasLock.prototype.init=function(){
		this.initDom();
		this.touchFlag=false;
		this.canvas=document.getElementById('canvas');
		this.ctx=this.canvas.getContext('2d');
		this.createCircle();
		this.bindEvent();
	}
})();	

		