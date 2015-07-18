'use strict';
require(['jquery'], function ($) {
	$(document).ready(function () {
		var page = $('.page'),
			pageList = page.find('li'),
			len = pageList.length,
			prev = pageList.filter('.prev'),
			next = pageList.filter('.next'),
			first = pageList.filter('.the-first-page'),
			last = pageList.filter('.the-last-page'),
			pages = pageList.not('.the-first-page, .prev, .next, .the-last-page'),
			index = 1,
			all = 10,
			commentWrap = $('.forum-main-comment > .comment'),
			reg = /\{\{\s*(\w+)\s*\}\}/g,
			template = '<li class="list clear" data-parent={{ parent }}> <div class="left"> <div class="left round-icon"> <div class="round-icon-wrap"> <div class="round"></div> </div> </div> </div> <div class="right list-info title-small"> <p>沙发</p><p><a class="title-small comment-reply" href="#">回复</a></p> </div> <div class="list-main"> <div class="list-person"><p class="normal green mr-12 inline-block">{{ email }}</p><span class="title-small">{{ datetime }}</span></div> <div class="list-comment inline-block">{{ content }}</div> </div>{{ child }}</li>',
			setPage = function (num) {
				pages.each(function (i, v) {
					$(v).find('a').text(num[i]);
				})
			},
			setCurrent = function (num) {
				pages.eq(num).addClass('current-page').siblings().removeClass('current-page');
			},
			controlExtrem = function (a, b) {
				a ? first.show() : first.hide();
				b ? last.show() : last.hide();
			};
		controlExtrem(false, true);
		page.on('click', 'a', function () {
			var $this = $(this),
				parent = $this.parents('li'),
				isPrev = parent.hasClass('prev'),
				isCurrent = parent.hasClass('current-page'),
				isNext = parent.hasClass('next'),
				isLast = parent.hasClass('the-last-page');
			if (isCurrent) {
				return false;
			} else if (isPrev) {
				index = (index > 1) ? index - 1 : index;
			} else if (isNext) {
				index = (index < all) ? index + 1 : index;
			} else if (isLast) {
				index = parseInt($this.text().slice(3));
			} else {
				index = parseInt($this.text());
			}

			$.ajax({
				url: '/api/crowdfunding/project/' + index + '/comment/',
				type: 'post',
				beforeSend: function () {
					$('.comment-backdrop').show();
				},
			}).then(function (data) {
				var len = data.count,
					prevUrl = data.previous,
					nextUrl = data.next,
					result = data.results,
					i = 0,
					time = 0,
					str = '',
					generateHTML = function (str, num) {
						var result = '';
						if (typeof num === 'undefined') {
							time = 0;
						}
						$.each(str, function (i, v) {
							var len = v.children.length;
							result = result + template2.replace(reg, function (_, value) {
								if (len > 0) {
									return v[value] || _;
								}
								if (value === 'datatime') {
									return v[value].slice(0, 10);
								}
								return v[value] || '';
							})
							if (v.children.length > 0) {
								time = time + 1;
								result = result.replace('{{ child }}', '<ul class="comment ' + (time % 2 === 1 ? 'odd': 'even') + '">' + generateHTML(v.children, 100) + '</ul>');
							}
						})
						return result
					};
				$(generateHTML(result)).appendTo($('.commentarea > .comment'));
				$('.comment-backdrop').hide();
			})
			if (index > 1 && index < all) {
				setPage([index - 1, index, index + 1])
				setCurrent(1);
			} else if (index === 1) {
				setPage([1, 2, 3]);
				setCurrent(0);
			} else {
				setPage([all - 2, all - 1, all]);
				setCurrent(2);
			}
			if (index > 2 && index < all - 1) {
				controlExtrem(true, true);
			} else if (index === 2) {
				controlExtrem(false, true);
			} else if (index === all - 1) {
				controlExtrem(true, false);
			}
			return false;
		})
		var commentTemplate = '<div class="forum-main-reply hide bg-white"> <div class="mb-10"> <textarea name="forum-reply" class="text"></textarea> </div> <div class="clear"> <input type="checkbox" id="type" name="type"> <label for="type" class="normal">匿名评论</label> <button class="btn right bg-green-light white" id="submitReply">提交回复</button> </div> </div>';
		var removeComment = function (elem) {
			elem.find('.forum-main-reply').remove();
			return elem;
		};
		$(document).on('click', '.comment-reply', function () {
			var $this = $(this),
				main = $this.parents('.right').siblings().filter('.list-main'),
				isOdd = $this.parents('ul').eq(0).hasClass('odd');
			removeComment(main);
			$(commentTemplate).appendTo(main).addClass(function () {
				return isOdd ? 'odd' : 'even';
			}).slideDown(function () {
				var $this = $(this),
					func = function (e) {
					if ($(e.target).parents('.forum-main-reply').length === 0) {
						$this.slideUp(function () {
							$(document).off('click', func);
							$(this).remove();
						})
					}
				};
				$this.find('textarea').focus();
				$(document).on('click', func);
			});
			return false;
		})
		$(document).on('click', '.submitReply', function () {
			var $this = $(this),
				parent = $this.parents('.forum-main-reply').eq(0),
				data = parent.find('textarea, input').serialize();
			data = data + '&parent=' + $this.parents('li').eq(0).data('parent');
			$.ajax({
				url: '/api/crowdfunding/project/' + index + '/comment/',
				type: 'post',
				data: data
			})
		})
	})
})