'use strict';
require(['jquery', 'slider', 'jquery.validate'], function ($, slider) {
	$(document).ready(function () {
		// slider init
		var newSlider = new slider.Slider(['img/test1.jpg', 'img/test2.jpg', 'img/test3.jpg', 'img/test4.jpg'], {
			width: 980,
			height: 400,
			interval: 3000,
			speed: 600
		})

		// tab
		var time;
		var timelag = function () {
			var $this = $(this),
				tabName = $this.attr('href'),
				tabContent = $(tabName),
				origWidth = [],
				tabTriangle = $this.parents('ul').find('.js-tab-triangle');
			tabContent.siblings().filter('.active').find('.project-percentage > div').each(function (i) {
				origWidth[i] = parseInt($(this).css('width'));
			})
			$this.parent().siblings().removeClass('active').end().addClass('active').append(tabTriangle);
			tabTriangle = $this.parents('ul').find('.js-tab-triangle');
			$this.parent().siblings().removeClass('active').end().addClass('active').append(tabTriangle);
			tabContent.siblings().removeClass('active').end().addClass('active');
			tabContent.find('.project-percentage div').each(function (i) {
				var width = parseInt($(this).css('width'));
				$(this).css('width', origWidth[i]);
				$(this).animate({width: width}, 400)
			})
			tabContent.find('.js-text-overflow').textOverflow(100);
			return false;
		}
		$('#project-single-tab a').hover(
			function () {
				var that = this;
				time = setTimeout(timelag.bind(that), 200);
			},
			function () {
				clearTimeout(time);
			}
		)

		$('#login').validate({
			rules: {
				account: {
					required: true,
					email: true
				},
				password:  'required'
			},
			messages: {
				account: '请输入邮箱',
				password: '请输入密码'
			}
		})
	})
})	
