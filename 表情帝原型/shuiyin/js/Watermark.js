
(function(){
	var Watermark = function(obj,img,options){//可选参数
		this.can = obj;
		this.text = options.text || '';
		this.arrImg = options.arrImg || '';
		this.left = options.left || 0;
		this.width = options.width || 0;
		this.height = options.height || 0;
		this.top =  options.top || 0;
		this.color = options.color || '#000';
		this.img = img;
		this.family = options.family || '12px Microsoft YaHei';
		this.init();
	};
	Watermark.prototype = {
		init:function(){
			this.draw();
		},
		draw:function(){ 
			var canvas = this.can; 
			var ctx = canvas.getContext("2d");
			if(this.text){//如果是文本
				var oImg;
				if(typeof this.img == 'object'){//如果是img对象
					oImg = this.img;
					ctx.drawImage(oImg,0,0);//直接显示
				}else if(typeof this.img == 'string'){//如果传入的事路径
					var newImg = new Image();//创建图片
					newImg.src = this.img;
					oImg = newImg;
				} 
				ctx.drawImage(oImg,0,0);
				ctx.font = this.family;//文字样式
				ctx.fillStyle = this.color;//设置文字颜色
				ctx.fillText(this.text,this.left,this.top); //追加文字
			}else{//如果是水印图片
				ctx.drawImage(this.img,0,0);//直接在canvas上drawImage两个图片
				ctx.drawImage(this.arrImg,this.left,this.top,this.width,this.height);
			}
		},
		getImg:function() //获取图片路径
		{	 
			var image = this.can.toDataURL("image/png");  
			return image.substring(22);
		},
		downImg:function() { //下载图片
			var image = this.can.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
			window.location.href=image; 
		}
	}
	window.Watermark = Watermark;	
})()
