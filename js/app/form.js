'use strict'
require(['jquery'], function ($) {
	// process
	var previous = $('#previous'),
		next = $('#next'),
		skip = $('#skip'),
		submit = $('#submit'),
		status = 0,
		headerList = $('.js-sign-header').find('li:has(a)'),
		contentList = $('.js-sign-content').children(),
		form = $('#sign, #create'),
		isCreate = form.attr('id') === 'create',
		agreement = $('#agreement');
	form.data('status', status);

	$('.js-scroll').on('scroll', function () {
		var $this = $(this),
			scrollTop = $this.scrollTop(),
			innerHeight = $this.height(),
			outerHeight = $this.find('.js-scroll-wrap').height();
		if (scrollTop + innerHeight >= outerHeight) {
			agreement.prop('disabled', false);
			agreement.on('change', function () {
				next.prop('disabled', !$(this).prop('checked'));
			})
		}
	})

	var prevaction = function () {
			$(headerList[status]).removeClass('active');
			$(headerList[status - 1]).removeClass('done').addClass('active');
			$(contentList[status]).fadeOut();
			$(contentList[status - 1]).fadeIn();
			status -= 1;
			form.data('status', status);
			previous.prop('disabled', false);
			next.prop('disabled', false);
			$(document).scrollTop(160);
		},
		nextaction = function () {
			$(headerList[status]).removeClass('active').addClass('done');
			$(headerList[status + 1]).addClass('active');
			$(contentList[status]).fadeOut();
			$(contentList[status + 1]).fadeIn();
			status += 1;
			form.data('status', status);
			previous.prop('disabled', false);
			next.prop('disabled', false);
			$(document).scrollTop(160);
		};
	form
	.on('next', function () {
		nextaction();
	})
	.on('prev', function () {
		prevaction();
	})
	previous.on('click', function () {
		if (status === 2) {
			skip.hide();
			submit.hide();
			next.show();
		}
		form.trigger('prev');
	})
	next.on('click', function () {
		if (status > 0) {
			if (!form.valid()) {
				return false;
			}
		}
		if (status === 1) {
			skip.show();
			submit.show();
			next.hide();
		} else {
			form.trigger('next');
		}
	})
})
