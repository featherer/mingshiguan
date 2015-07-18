'use strict';
require(['jquery', 'app/form', 'imageUpload'], function ($, _, ImageUpload) {
	$(document).ready(function () {
        // add tag
        var addTag = $('.js-add-tag'),
	        tagList = $('.project-tag'),
            func = function () {
            	var $this = $(this);
            		$this.html('<div style="min-width:40px;outline-width:0" contentEditable="true"></div>');
            	$this.find('div').focus()
            	.on('blur', function () {
            		$(this).html('添加+');
            	})
            	.on('keypress', function (event) {
            		if (event.keyCode === 13) {
            			var text = $this.text(),
            			origValue = $('#project-tag').val(),
            			newLi = $('<li class="left"><div class="mr-12 bg-green-light relative white">' + 
            				text +
            				'<span class="absolute project-tag-del js-tag-del">×</span></div></li>');
            			newLi.appendTo(tagList);
            			newLi.find('span').one('click', function () {
            				var input = $('#project-tag'),
            				valueToDel = $(this).parent().text().slice(0, -1),
            				value = input.val();
            				value = value.replace(valueToDel + ',', '');
            				value = value.replace(',' + valueToDel, '');
            				$(this).parents('li').remove();
            				input.val(value);
            			})
            			origValue += origValue.length === 0 ? text : (origValue.slice(-1) === ',' ? text : ',' + text);
            			$('#project-tag').val(origValue);
            			$this.html('添加+');
            			$this.parent().appendTo(tagList);
            			form.valid();

            			return false;
            		}
            	})
			};
		addTag.on('click', func);

		var form = $(create),
			submit = $('#submit'),
			next = $('#next'),
			previous = $('#previous'),
			rules = {
				'project-name': 'required',
				'money': {
					number: true,
				},
				'limit': {
					number: true,
				},
				'reward-time': {
					number: true,
				}
            // 'project-city': 'required',
            // 'project-location': 'required',
            // 'project-time': {
            // number: true,
            // required: true
            // },
            // 'project-type': 'required',
            // 'project-info': 'required'
      		},
            id = 0;
        form.validate({
        	rules: rules,
        	messages: {
        		'project-tag': '请添加标签'
        	}
        })
        next.on('click', function () {
        	if (form.data('status') === 1) {
        		if (!form.valid()) {
        			return false;
        		}
        		var data = form.serialize();
        		$.ajax({
        			type: 'post',
        			url: '/api/crowdfunding/project/',
        			data: data,
        		}).then(
        		function (data) {
        			id = data.id;
        			form.trigger('next');
        		},
        		function (data) {
        			var response = data.responseJSON,
        			errorInInfo = $.map(response, function (v, i) {
        				return i in rules ? i : null;
        			})
        			form.validate().showErrors(response);
        		}
        		)
        	}
        })

        var feedback = $('.reward-info'),
            packages = $('.reward-scheme'),
            addFeedback = $('.js-add-reward'),
            addPackages = $('.js-add-scheme'),
            feedbackCount = 1,
            packagesCount = 1,
            variable =/\{\{\s*(\w+)\s*\}\}/g,
            feedbackListTemplate = '<li class="mr-12 left"><input name="feedback" value="{{ counter }}" type="checkbox">回报{{ counter }}</li>',
            feedbackTemplate = '<div class="panel"><div class="panel-header relative"><div class="close absolute" data-dismiss="panel">×</div><h4>回报{{ feedbackCount }}</h4></div><div class="panel-body"><div><label class="mr-12 green left" for="content">回报描述:</label><input type="text" name="content" class="input"></div><div class="clear"><label class="mr-12 green left" for="reward-pic">回报图片:</label><input type="file" id="reward-pic" name="reward-pic" class="input"><div class="left"><div class="imagePreview"></div><button type="button" class="btn bg-green-light white readTrigger">上传</button><input type="text" class="project" name="project"><input type="text" class="imageId" name="idcard_image"></div></div><div class="clear"><button type="button" class="saveFeedback btn right bg-green-light white">保存</button></div></div></div>',
            packagesTemplate = '<div class="panel"><div class="panel-header relative"><div class="close absolute" data-dismiss="panel">×</div><h4>回馈方案{{ packagesCount }}</h4></div><div class="panel-body"><div><label class="mr-12 green left" for="reward-money">支持金额:</label><input type="text" id="reward-money" name="money" class="input"></div><div><label class="mr-12 green left" for="reward-restrict">名额限制:</label><input type="text" id="reward-restrict" name="limit" class="input"></div><div class="clear"><input type="text" class="project" name="project"><label class="mr-12 green left" for="reward-payback">对应回报</label><ul class="reward-payback-list clear"><li class="mr-12 left"><input name="feedback" value="1" type="checkbox">回报1</li></ul></div><div><label class="mr-12 green left" for="type">投资类型</label><div class="clear"><div class="left mr-12"><input name="type" value="0" type="radio">普通赞助者</div><div class="left"><input name="type" value="1" type="radio">合伙人</div></div></div><div><label class="mr-12 green left" for="reward-time">回报时间:</label><input type="text" id="reward-time" name="reward-time" class="input"></div><div class="clear"><button type="button" class="savePackages btn right bg-green-light white">保存</button></div></div></div>';

        addFeedback.on('click', function () {
        	var newFeedback = $(feedbackTemplate.replace(variable, feedbackCount)).insertBefore(addFeedback).slideDown(),
        	imageUpload = new ImageUpload.ImageUpload({
        		input: newFeedback.find('input[type=file]'),
        		readTrigger: newFeedback.find('.readTrigger'),
        		imagePreview: newFeedback.find('.imagePreview'),
        		url: 'http://citi.oott.me/api/image/',
        		uploadOnRead: true,
        		data: {
        			'type': 2,
        		},
        		imageRead: function () {
        			this.readTrigger.hide();
        		},
        		callbacks: {
        			201: function (response) {
        				newFeedback.find('.imageId').val(response.id);
        			}
        		}
        	});
        	newFeedback.find('.project').val(id);
        	packages.trigger('addFeedback', feedbackCount);
        	feedbackCount = feedbackCount + 1;
        })
        addPackages.on('click', function () {
        	var newPackages = $(packagesTemplate.replace(variable, packagesCount)).insertBefore(addPackages).slideDown();
        	newPackages.find('.reward-payback-list').html(function () {
        		var str = '',
        		i;
        		for (i= 1; i < feedbackCount; i = i + 1) {
        			str = str + '<li class="mr-12 left"><input name="feedback" value="' + i + '" type="checkbox">回报' + i + '</li>'
        		}
        		return str;
        	})
        	newPackages.find('.project').val(id);
        	packagesCount = packagesCount + 1;
        })

        addFeedback.trigger('click');
        addPackages.trigger('click');

        packages.on('addFeedback', function (event, text) {
        	packages.find('.panel').each(function () {
        		$(this).find('.reward-payback-list').append($(feedbackListTemplate.replace(variable, text)));
        	})
        })
        $(document).on('close', '.panel .close', function (event) {
        	var $this = $(event.target),
            	parent = $this.parents('.panel'),
            	index = parent.parent().children().index(parent),
            	nextSibling = parent.nextUntil('.add-reward'),
            	isFeedback = parent.parent().hasClass('reward-info');
        	parent.slideUp(function () {
        		parent.remove();
        		nextSibling.each(function (i) {
        			var heading = $(this).find('h4');
        			heading.text(heading.text().slice(0, -1) + (index + i + 1));
        		})
        	})
        	if (isFeedback) {
        		packages.find('.reward-payback-list').each(function () {
        			var $$this = $(this),
        				inputList;
        			$$this.children().last().remove();
        			inputList = $$this.find('input');
        			$$this.data('checkedValue') && $.each($$this.data('checkedValue').split(','), function (i, v) {
        				if (i > index) {
        					inputlist.eq(i - 1).prop('checked', true);
        				}
        			})
        		});
        		feedbackCount = feedbackCount - 1;
        	}
        })
		$(document).on('click', '.reward-payback-list  input', function (event) {
			var $this = $(this),
				ul = $this.parents('.reward-payback-list'),
				checkedValue = [];
			ul.find('input:checked').each(function () {
				checkedValue.push($(this).val());
			})
			ul.data('checkedValue', checkedValue.join(','))
		})
		$(document).on('click', '.saveFeedback, .savePackages, .panel .close', function () {
			var $this = $(this),
				that = this,
				parent = $this.parents('.panel'),
				isFeedback = $this.hasClass('saveFeedback'),
				isClose = $this.hasClass('close'),
				id = parent.data('id'),
				data = parent.find('input:not([name=feedback])').serialize(),
				url = isFeedback ? '/api/crowdfunding/feedback/' : '/api/crowdfunding/package/';
			if (!isClose && !isFeedback) {
				data = data + isClose && !isFeedback ?
							'&feedback=[' + parent.find('.reward-payback-list').data('checkedValue')
							.split(',').reduce(function (prev, next) {return prev + ',' + next}) + ']'
						: '';
			}
			if (id) {
				data = '&id=' + id;
				url = url + id;
			}
			if (isClose) {
				data = '';
			}
			if (isClose && !id) {
				$this.trigger('close');
			}
			$.ajax({
				type: 'post',
				url: url,
				data: data
			}).then(
				function (data) {
					if (!isClose) {
						parent.data('id', data.id);
					} else {
						$this.trigger('close');
					}
				},
				function (data) {
					if (data.error_code === 10034) {
						console.log(false);
					}
				}
			)
		})
	})
})