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
		borderColor : 'transparent',
		titleBorderColor : '#ddd',
		width : 300,
		effect : 'none',
		layout : 'center',
		overlay : true ,
		overlayBackground : 'black',
		overlayOpacity : 0.2,
		close : true,
		buttons : []
	};
	$.fn.lightbox.title = "纸房子@WEB";
	$.fn.lightbox.description = "欢迎使用cod7ce提供的lightbox插件！！！";
	$.fn.lightbox.overlay = null;
	$.fn.lightbox.buttonstyle = [{
		border : '1px solid #247600',
		background : '#359600',
		textDecoration : 'none',
		textShadow : '0 0 1px #00634D',
		color : 'white',
		padding : '5px 15px 6px',
		margin : '0 3px 0',
		borderRadius : '5px',
		boxShadow : '0 1px 1px #E6E6E6,inset 0 1px 0 #39A200',
		fontSize : 10
	},{
		border : '1px solid #bbb',
		background : '#F9F9F9',
		textDecoration : 'none',
		textShadow : '0 0 1px #FEFEFE',
		color : '#333',
		padding : '5px 15px 6px',
		margin : '0 3px 0',
		borderRadius : '5px',
		boxShadow : '0 1px 1px #E6E6E6,inset 0 1px 0 white',
		fontSize : 10
	}];

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

			if( opts.overlay && !$.fn.lightbox.overlay){
				$.fn.lightbox.overlay = $('<div></div>').css({
					position :'fixed',
					background : opts.overlayBackground,
					opacity : opts.overlayOpacity,
					/* overlay 固定设置 */
					top : 0,
					left : 0,
					width : '100%',
					height : '100%',
					zIndex : 99
				}).attr('id','lightbox-overlay').click(function(){
					methods.destroy.call($this, opts);
				});
				this.parent().append( $.fn.lightbox.overlay ).fadeIn();
			}

			/* 获取用户定义字段 */
			$.fn.lightbox.title = $.trim(this.attr('title'))=='' ? $.fn.lightbox.title : this.attr('title');
			$.fn.lightbox.description = $.trim(this.html())=='' ? $.fn.lightbox.description : this.html();
			this.html('');

			/* 边框节点对象,对外提供样式接口 */
			var borderObj = $('<div></div>').css({
				position:'relative',
				borderRadius:5,
				boxShadow:'0 0 18px rgba(0, 0, 0, 0.4)',
				borderStyle : 'solid',
				borderColor : opts.borderColor,
				borderWidth : opts.borderWidth
			}).attr('class','popup');
			this.append( borderObj );

			/* box展示节点对象,对外提供样式接口  */
			var boxObj = $('<div></div>').css({
				padding : 10,
				width : opts.width - 20,
				color : '#333',
				borderRadius : 4,
				background : opts.background
			}).attr('class','boxcontent');
			borderObj.append( boxObj );

			/* 关闭按钮对象 */
			if( opts.close ){
				var closeObj = $('<a href="#"></a>').css({
					position : 'absolute',
					top : 9,
					right: 5,
					display : 'block',
					width : 16,
					height : 16,
					padding : 2,
					textDecoration : 'none'
				}).append($('<span>\u2716</span>').css({
					lineHeight : '16px',
					color : '#ccc'
				}).mouseover(function(){$(this).css('color','#333');}).mouseout(function(){$(this).css('color','#ccc');
				}));
				closeObj.click(function(){
					methods.destroy.call($this, opts);
					return false;
				});
				boxObj.append( closeObj );
			}
			

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
			var contentObj = $('<div></div>').css({ fontSize : '12px', lineHeight:'24px' }).html( $.fn.lightbox.description );
			boxObj.append(contentObj);

			/* 按钮节点对象 */
			var btnObj = $('<div></div>').css({ textAlign : 'center', marginTop : '20px', marginBottom : '8px' });
			$.each(opts.buttons, function(name, button){
				var btn = $('<a href="#"></a>').css(
					$.fn.lightbox.buttonstyle[button.btype]
				).text(button.text);
				if( typeof(button.handle) == 'function'){
					btn.bind('click',function(){
						button.handle.call(this);
						methods.destroy.call($this, opts);
						return false;
					});
				}
				btnObj.append(btn);
			});
			/* 当btnBox中没有添加confirm或cancle按键时，不添加在lightbox中 */
			if(btnObj.children().length!=0){
				boxObj.append( btnObj );
			}
			/* 布局lightbox */
			methods.layout.call(this, opts.layout);
			$(window).resize(function(){
				methods.layout.call($this, opts.layout)
			}).scroll(function(){
				methods.layout.call($this, opts.layout)
			});

			methods.show.call($this, opts.effect);
		},
		/* lightbox弹出效果 */
		show : function( effect ){
			switch( effect ){
				case 'none':
					this.show();
					break;
				case 'flow':
					this.show('slow');
					break;
				case 'fade':
					this.fadeIn();
					break;
			}
		},
		/* lightbox的销毁 */
		destroy : function(opts){
			if( opts.overlay )
			{
				$.fn.lightbox.overlay.remove();
				$.fn.lightbox.overlay = null;
			}
			this.children().remove();
			this.append($.fn.lightbox.description);
			this.attr('style','');
			this.hide();
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
			var scrollTop = $(window).scrollTop();
			switch( layout ){
				case 'top':
					var tleft = width > boxWidth ? (width - boxWidth ) / 2 : 0;
					var ttop  = height/3 > boxHeight ? (height/3 - boxHeight)/2 : 0;
					this.css({ top : ttop + scrollTop , left : tleft });
					break;
				case 'bottom':
					var tleft = width > boxWidth ? (width - boxWidth ) / 2 : 0;
					var ttop  = height/3 > boxHeight ? 2/3*height + (height/3 - boxHeight)/2 : height - boxHeight;
					this.css({ top : ttop + scrollTop, left : tleft });
					break;
				case 'left':
					var tleft = width/3 > boxWidth ? (width/3 - boxWidth ) / 2 : 0;
					var ttop  = height > boxHeight ? (height - boxHeight)/2 : 0;
					this.css({ top : ttop + scrollTop, left : tleft });
					break;
				case 'right':
					var tright = width/3 > boxWidth ? (width/3 - boxWidth ) / 2 : 0;
					var ttop  = height > boxHeight ? (height - boxHeight)/2 : 0;
					this.css({ top : ttop + scrollTop, right : tright });
					break;
				case 'center':
				default:
					var tleft = width > boxWidth ? (width - boxWidth ) / 2 : 0;
					var ttop  = height > boxHeight ? (height - boxHeight)/2 : 0;
					this.css({ top : ttop + scrollTop, left : tleft });
					break;
			}
		}
	};
})(jQuery)