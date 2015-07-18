'use strict';
require(['jquery', 'jquery.form'], function ($, _) {
	$(document).ready(function () {
		$(".info-function-supporter select").on('change', function () {
			var target = $(this).find('[value=' + $(this).val() + ']'),
				toggle = target.data('target'),
				targetElem = $(toggle);
			targetElem.siblings().fadeOut().end().fadeIn();
		})
		var rules = {
				email: {
					email: true,
				},
				mobile: {
					number: true,
					isPhone: true
				}
			};
		$('#modifyInfo').validate({
			rules: rules
		});
		$('form').ajaxForm().on('submit', function (e) {
			e.preventDefault();
			if ($(this).valid()) {
				$(this).ajaxSubmit();
			}
		})
	})
})