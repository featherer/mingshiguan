'use strict';
define(['jquery'], function () {
	var Slider = function (imgs, config) {
		this.imgs = imgs;
		this.config = $.extend({interval: 3000, speed: 'normal'}, config);
		this.index = 1;
		this.indexNext = 1;
		this.init();
	}
	Slider.prototype = {
		constructor: Slider,
		init: function () {
			var imgHtml = '',
				indicatorHtml = '',
				html,
				that = this;
			$.each(this.imgs, function (i, v) {
				imgHtml = imgHtml + '<li class="slider-img-wrap"><a href="#"><img src="' +
						v +
						'" width="' + that.config.width + '"' +
						'height="' + that.config.height + '"' +
						' alt=""></a></li>'
				indicatorHtml = indicatorHtml +
						'<li class="slider-indicator-wrap"><span ' +
						(i === 0 ? 'class="js-index"' : '') +
						'></span></li>'
			})
			html = '<div class="slider-wrap"><div class="slider-img-list"><ul ' +
				'style="width:' + this.config.width + 'px;height:' + this.config.height + 'px;"">' +
				imgHtml +
				'</ul><div class="slider-indicator"><ul>' +
				indicatorHtml +
				'</ul></div></div><div class="slider-controller-left"></div><div class="slider-controller-right"></div></div>';
			$('.slider').css('width', this.config.width + 100 + 'px').append($(html));
			this.imgList = $('.slider-img-wrap');
			this.indicatorList = $('.slider-indicator-wrap > span');
			$('.slider-indicator').css('margin-left', - 0.5 * $('.slider-indicator').width())
			$('.slider-controller-left').load('img/slider-prev.svg')
			$('.slider-controller-right').load('img/slider-next.svg')
			this.indicatorColor();
			this.addEvent();
			this.play();
		},
		play: function () {
			var that = this;
			this.time = setTimeout(that.jump.bind(that, 'next'), this.config.interval);
		},
		jump: function (direction, times) {
			var that = this,
				len = this.imgs.length,
				nextOrNot = direction === 'next' ? 1 : -1;
			this.time = setTimeout(that.jump.bind(that, direction), this.config.interval);
			if (nextOrNot === 1) {
				this.indexNext += (this.index >= len ? (-len + 1) : 1);
			} else {
				this.indexNext -= (this.index <= 1 ? (-len + 1) : 1);
			}
			if (typeof times === 'number') {
				this.indexNext = this.index + times;
			}
			this.imgNow = this.imgList.eq(this.index - 1);
			this.imgNext = this.imgList.eq(this.indexNext - 1);
			this.imgNext.prependTo(this.imgNext.parent());
			this.imgNow.prependTo(this.imgNow.parent());
			this.imgNow.css('position', 'absolute');
			this.imgNext.css({
				position: 'absolute',
				left: (this.config.width * nextOrNot ) + 'px'
			});
			this.imgNow.animate({left: (-nextOrNot * this.config.width) + 'px'}, this.config.speed);
			this.imgNext.animate({left: '0'}, this.config.speed);
			this.indicatorNow = this.indicatorList.eq(this.index - 1).removeClass('js-index').css('backgroundColor', 'white');
			this.indicatorNext = this.indicatorList.eq(this.indexNext - 1);
			this.indicatorNext.addClass('js-index').css('backgroundColor', this.indicatorNext.data('color'));
			this.index = this.indexNext;
		},
		stop: function () {
			clearTimeout(this.time);
		},
		addEvent: function () {
			var that = this,
				time = 0;
			$('.slider-img-list > ul').hover(
				function () {
					clearTimeout(that.time);
				},
				function () {
					that.time = setTimeout(that.play.bind(that), that.config.interval)
				}
			)
			$('.slider-indicator').on('click', 'span', function () {
				var current = $(this).parents('ul').find('span').index($(this)) + 1,
					times = current - that.index;
				clearTimeout(that.time);
				times > 0 ? that.jump('next', times) : that.jump('before', times);
			})
			$('.slider-controller-left').on('click', function () {
				clearTimeout(that.time);
				that.jump.bind(that)('before');
			})
			$('.slider-controller-right').on('click', function () {
				clearTimeout(that.time);
				if (time === 0) {
					time = (new Date()).valueOf();
					that.jump.bind(that)('next');
					return;
				}
				if (((new Date().valueOf()) - time ) < 800) {
					return;
				}
				time = (new Date()).valueOf();
				that.jump.bind(that)('next');
			})
		},
		indicatorColor: function () {
			var c = $('<canvas id="canvas" style="display:none" width="' + this.config.width + '"" height="' + this.config.height + '"></canvas>').appendTo(document.body)[0],
				ctx = c.getContext('2d'),
				imgData,
				that = this,
				indicatorOffset = [];
			this.imgList.find('img').each(function (i) {
				var parentOffset = $('.slider-img-wrap').offset(),
					currentIndicator = that.indicatorList.eq(i);
				indicatorOffset[i] = {
					left: currentIndicator.offset().left - parentOffset.left,
					top: currentIndicator.offset().top - parentOffset.top,
					width: currentIndicator.width(),
					height: currentIndicator.height()
				}
			})
			this.imgList.find('img').each(function (i, v) {
				$(v).on('load', function () {
					var r = 0, g = 0, b = 0;
					ctx.drawImage(v, 0, 0, that.config.width, that.config.height);
					imgData = ctx.getImageData(indicatorOffset[i].left,
						indicatorOffset[i].top,
						indicatorOffset[i].width,
						indicatorOffset[i].height)
					var data = imgData.data;
					// for (var j = 0; j < (data.length / 4); j++) {
					// 	r += data[j * 4 + 0]
					// 	g += data[j * 4 + 1]
					// 	b += data[j * 4 + 2]
					// }
					r = 255 - data[data.length / 2];
					g = 255 - data[data.length / 2 + 1];
					b = 255 - data[data.length / 2 + 2];
					that.indicatorList.eq(i).data('color', 'rgb(' + [r, g, b].join(',') + ')');
					i === 0 && that.indicatorList.eq(i).css('backgroundColor', that.indicatorList.eq(i).data('color'));
				})
			})
		}
	}
	return {
		Slider: Slider
	}
})