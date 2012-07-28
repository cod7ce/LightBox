(function($){
	/* 简易浮动框 */
	$.fn.lightbox = function( options ){
		var opts = $.extend({}, $.fn.lightbox.defaults, options);
		this.each(function(){
			var $this = $(this);
			/* 支持Metadata插件 */
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			methods.init.call($this, o);
		});
		return this;
	};

	/* 开放函数，向对象中添加对象 */
	$.fn.lightbox.add = function($obj){

	};

	/* 对象的默认值 */
	$.fn.lightbox.defaults = {
		background : 'white',
		borderWidth : 3,
		titleBorderColor : '#ddd',
		width : 300,
		height : 120,
		effect : 'slow',
		layout : 'center'
	};
	$.fn.lightbox.title = "纸房子@WEB";
	$.fn.lightbox.description = "欢迎使用cod7ce提供的lightbox插件！！！";

	/* 私有函数集 */
	var methods = {
		init : function( opts ){
			$this = this;
			this.css({
				/* 固定样式 */
				display : 'none',
				position : 'absolute',
				textAlign : 'left',
				zIndex : '100'
			});

			/* 获取用户定义字段 */
			$.fn.lightbox.title = this.attr('title');
			$.fn.lightbox.description = this.html();
			this.html('');

			/* 边框节点对象,对外提供样式接口 */
			var borderObj = $('<div></div>').css({
				position:'relative',
				borderRadius:5,
				boxShadow:'0 0 18px rgba(0, 0, 0, 0.4)',
				borderStyle : 'solid',
				borderColor : 'transparent',
				borderWidth : opts.borderWidth
			}).attr('class','popup');
			this.append( borderObj );

			/* box展示节点对象,对外提供样式接口  */
			var boxObj = $('<div></div>').css({
				padding : 10,
				width : opts.width - 20,
				height : opts.height -20,
				color : '#333',
				borderRadius : 4,
				background : opts.background
			}).attr('class','boxcontent');
			borderObj.append( boxObj );

			/* 标题节点对象 */
			var titleObj = $('<h2></h2>').text( $.fn.lightbox.title ).css({
				padding : '0 10px 10px 10px',
				fontSize : 16,
				borderWidth : '0 0 1px 0',
				borderStyle : 'solid',
				borderColor : opts.titleBorderColor,
				width : '100%',
				margin : '0 0 10px -10px'
			});
			boxObj.append( titleObj );

			/* 内容节点对象 */
			var contentObj = $('<div></div>').html( $.fn.lightbox.description );
			boxObj.append(contentObj);

			/* 布局lightbox */
			methods.layout.call(this, opts.layout);
			$(window).resize(function(){
				methods.layout.call($this, opts.layout)
			});

			this.show(opts.effect);
		},
		/*
			|ˉˉˉˉˉ|ˉˉˉˉˉˉ|ˉˉˉˉˉ|
			|     | top  |     |
			|     |------|     |
			|left |center|right|
			|     |------|     |
			|     |bottom|     |
			|_____|______|_____|
		*/
		layout : function( layout ){
			var width     = $(window).width();
			var height    = $(window).height();
			var boxWidth  = this.width();
			var boxHeight = this.height();
			switch( layout ){
				case 'top':
					var tleft = width > boxWidth ? (width - boxWidth ) / 2 : 0;
					var ttop  = height/3 > boxHeight ? (height/3 - boxHeight)/2 : 0;
					this.css({ top : ttop, left : tleft });
					break;
				case 'bottom':
					var tleft = width > boxWidth ? (width - boxWidth ) / 2 : 0;
					var tbottom  = height/3 > boxHeight ? (height/3 - boxHeight)/2 : 0;
					this.css({ bottom : tbottom, left : tleft });
					break;
				case 'left':
					var tleft = width/3 > boxWidth ? (width/3 - boxWidth ) / 2 : 0;
					var ttop  = height > boxHeight ? (height - boxHeight)/2 : 0;
					this.css({ top : ttop, left : tleft });
					break;
				case 'right':
					var tright = width/3 > boxWidth ? (width/3 - boxWidth ) / 2 : 0;
					var ttop  = height > boxHeight ? (height - boxHeight)/2 : 0;
					this.css({ top : ttop, right : tright });
					break;
				case 'center':
				default:
					var tleft = width > boxWidth ? (width - boxWidth ) / 2 : 0;
					var ttop  = height > boxHeight ? (height - boxHeight)/2 : 0;
					this.css({ top : ttop, left : tleft });
					break;
			}
		}
	};
})(jQuery)