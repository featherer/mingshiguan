'use strict';
require(['jquery'], function ($) {
	$(document).ready(function () {
		$(document).on('click', '.search-box a', function () {
			var searchReg = /[?&]?(\w+)\=(\w+)/g,
				currentHref = document.location.href,
				newHref = 'project_list/?',
				searchItem = {},
				result,
				$this = $(this);
			while((result = searchReg.exec(currentHref)) != null) {
				searchItem[result[1]] = result[2];
			}
			if (!$this.data('province')) {
				searchItem = $.extend(searchItem, $this.data());
			} else {
				$.getJSON('/api/location/city/' + $this.data('location')).success(function (data) {
					var str = '<div class="content-city">';
					for (var i = 0, len = data.length; i < len; i = i + 1) {
						str = str + '<li class="left mr-12"><a data-location="' + data[i].id +
								'" href="#" class="title-large">' + data[i].name + '</a></li>';
					}
					str = str + '</div>'
					$('#change-location .content').find('.content-province').hide().end().append(str);
				})
			}
			newHref = /(.*\.html)/.exec(document.location.href)[1] + '?' + $.param(searchItem);
			window.location.href = newHref;
			return false;
		})
		$('.search-box .close').on('click', function () {
			$('.content-province').show();
			$('.content-city').remove();
		})
	})
})