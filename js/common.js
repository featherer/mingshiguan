require.config({
	baseUrl: 'js/lib',
	paths: {
		app: '../app',
		jquery: 'jquery-1.11.1.min',
		'jquery.fontavailable': 'jquery.fontavailable-1.1.min',
		'jquery.validate': 'jquery.validate.min',
	},
	shim: {
		'jquery.cropbox': {
			deps: ['jquery'],
			exports: 'jQuery.fn.cropbox'
		},
		'jquery.validate': {
			deps: ['jquery'],
			exports: 'jQuery.fn.validate'
		},
		'jquery.fontavailable': {
			deps: ['jquery'],
			exports: 'jQuery.fontAvailable'
		},
		'jquery.form': {
			deps: ['jquery'],
			exports: 'jQuery.fn.form'
		}
	}
})

require(['jquery', 'jquery.validate'], function ($) {
	$(document).ready(function () {
		var animate = function (isToggle, targetElem, targetAnimation, diff, elem) {
			var fade = ['fadeIn', 'fadeOut'],
				slide = ['slideDown', 'slideUp'],
				animation,
				oppositeAnimation,
				isCustom;
			if (typeof targetAnimation !== 'undefined') {
				isCustom = false;
				if (targetAnimation.indexOf('slide') !== -1) {
					animation = isToggle ? slide.shift() : slide.pop();
					oppositeAnimation = slide.pop();
				} else if (targetAnimation.indexOf('fade') !== -1) {
					animation = isToggle ? fade.shift() : fade.pop();
					oppositeAnimation = fade.pop();
				}
			} else {
				isCustom = true;
				animation = isToggle ? 'addClass' : 'removeClass';
			}
			if (diff !== 'tab') {
				if (!isCustom) {
					targetElem[animation]();
				}
				targetElem[animation]('active');
			} else {
				if (!isCustom) {
					targetElem.siblings().hide().end()[animation]();
				}
				$(elem).parent().siblings().removeClass('active').end().addClass('active');
				targetElem.siblings().removeClass('active').end().addClass('active');
			}

			if (diff === 'modal') {
				isToggle ? $('.modal-backdrop').fadeIn() : $('.modal-backdrop').fadeOut();
			}
		};

		var moduleSetup = function (elem) {
			var elem = elem.jquery ? elem : $(elem),
				data = elem.data(),
				isToggle = 'toggle' in data,
				// usually diff has the value among modal, alert, tab, panel
				diff = data.toggle || data.dismiss,
				target, targetElem, isModal, targetAnimation;
			if (isToggle)  {
				target = elem.data('target');
			} else if (!isToggle) {
				target = elem.data('dismiss');
			}
			targetElem = isToggle ? $(target) : elem.parents('.' + target);
			targetAnimation = targetElem.data('animate');

			return {
				isToggle: isToggle,
				diff: diff,
				targetElem: targetElem,
				targetAnimation: targetAnimation
			}
		}

		// toggle: target stores in data-target and animation stores in data-animate in target (if not defined add 'active' for default)
		// dismiss: target is the element possessing the class in data-dismiss (if no data-animation is detected, removes 'active' for default)
		$('[data-dismiss], [data-toggle]').on('click', function () {
			var result = moduleSetup(this);
			animate(result.isToggle, result.targetElem, result.targetAnimation, result.diff, this);
			return false;
		})

		$('.modal').on('click', function (event) {
			var target = $(event.target);
			if (target.hasClass('modal-close') || target.hasClass('modal')) {
				animate(false, $(this), $(this).data('animate'), 'modal')
			}
		})

		// load svg
		var svgToLoad = ['share', 'download', 'go-to-top', 'search-icon', 'user', 'feedback', 'qqzone', 'renren', 'douban', 'sina', 'logo'];
		$.each(svgToLoad, function (i, v) {
			$('.' + v).load('img/' + v + '.svg')
		})
		$('.position').each(function () {
			$(this).prepend('<em class="position-icon"></em>').find('.position-icon').load('img/position.svg');
		})

		// search icon
		$('.search-icon').on('mouseover', function () {
			$(this).parent().addClass('active').find('.search-icon').end().find('.input-search').trigger('focus');
			$(this).siblings().one('blur', function () {
				$(this).parent().removeClass('active').find('.search-icon');
			})
		})

		// toolbar
		$(window).on('scroll', function () {
			var goToTop = $('.go-to-top').parent();
			$(this).scrollTop() >= 1000 ? goToTop.removeClass('hide') : goToTop.addClass('hide');
		})
		$('.go-to-top').parent().on('click' ,function () {
			$(document.body).animate({scrollTop: 0})
		})

		// fix the problem of the modal animation in chrome
		$('.modal').show();

			// province & city
		var province = $('#province'),
			city = $('#city'),
			vacant = $('<option value=""></option>');
		$.getJSON('js/province.json').success(function (data) {
			var provinceHtml = '';
			for (var i = 0, len = data.length; i < len; i = i + 1) {
				provinceHtml += '<option value="' + data[i].id +'">' + data[i].name + '</option>';
			}
			province.append(vacant).append(provinceHtml);
		})
		province.on('change', function () {
			vacant.remove();

			$.getJSON('js/' + province.val() + '.json').success(function (data) {
				var cityHtml = '';
				for (var i = 0, len = data.length; i < len; i = i + 1) {
					cityHtml += '<option value="' + data[i].id +'">' + data[i].name + '</option>';
				}
				city.empty().append(vacant).append(cityHtml);
			})
		})
		city.on('change', function () {
			vacant.remove();
		})

		// extend jQuery
		$.fn.extend({
			textOverflow: function (maxHeight) {
				var origHeight = this.height();
				while (this.height() >= maxHeight) {
					this.text(this.text().slice(0, -1));
				}
				origHeight >= maxHeight && this.text(this.text().slice(0, -3) + '...');
			}
		})
		$('.tab-content .active .js-text-overflow').textOverflow(100);

		$.extend($.validator.messages, {
			required: '必选字段',
			remote: '请修正该字段',
			email: '请输入正确格式的电子邮件',
			equalTo: '两次密码不一致',
			accept: '请输入拥有合法后缀名的字符串'
		});
		$.validator.addMethod('isPhone', function (str) {
			return /^1[3|4|5|8][0-9]\d{4,8}$/.test(str);
		}, '请输入正确格式的手机号')
	})
})