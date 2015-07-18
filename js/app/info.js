'use strict';
require(['jquery'], function ($) {
	$(document).ready(function () {
		$(".info-function-supporter select").on('change', function () {
			var target = $(this).find('[value=' + $(this).val() + ']'),
				toggle = target.data('target'),
				targetElem = $(toggle);
			targetElem.siblings().fadeOut().end().fadeIn();
		})
	})
})