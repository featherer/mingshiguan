'use strict';
require(['jquery', 'jquery.cropbox', 'app/form', 'imageUpload'], function ($, _, __, ImageUpload) {
	$(document).ready(function () {
		
		// sign content
		var form = $(sign),
			submit = $('#submit'),
			skip = $('#skip'),
			email,
			isIgnored = true,
			rules = {
				email: {
					email: true,
					required: true
				},
				password1: 'required',
				password2: {
					required: true,
					equalTo: '#password'
				},
				nickname: 'required',
				'native': 'required',
				occupation: 'required',
			};

		// form validate
		form.validate({
			rules: rules,
			messages: {
				idcard_image: '请上传证件照'
			}
		})

		// form to skip
		$('.js-sign-content > div').eq(2).on('change', function () {
			var formItem = $(this).find('input, select').not('#image'),
				formItemArray = $.makeArray(formItem),
				result = $.map(formItemArray, function (v) {
					return $(v).val() === '' ? null : true;
				});
			if (isIgnored === true && result.length > 0) {
				formItem.each(function () {
					$(this).rules('add', {
						required: true
					})
				})
				isIgnored = false;
			} else if (result.length === 0 && isIgnored === false) {
				formItem.each(function () {
					$(this).rules('remove');
				})
				isIgnored = true;
				form.valid();
			}
		})
		var first = $('.imageWrap'),
			imageUpload = new ImageUpload.ImageUpload({
				input: first.find('input[type=file]'),
				readTrigger: first.find('img'),
				uploadTrigger: first.find('#imageUpload'),
				imagePreview: first.find('.imagePreview'),
				cancelTrigger: first.find('#imageCancel'),
				url: 'http://citi.oott.me/api/image/',
				data: {
					'type': 0,
					'image': function () {
						return this.imagePreview.find('img').data('cropbox').getBlob();
					}
				},
				imageModify: function () {
					this.readTrigger.hide();
					this.uploadTrigger.show();
					this.cancelTrigger.show();
					this.imagePreview.find('img')
					.cropbox({
						width: 300,
						height: 200,
						zoom: 3,
						result: {
							cropX: 0,
							cropY: 0,
							cropW: 300,
							cropH: 200
						}
					}).parent().find('button').on('click', function () {
						return false;
					});
				},
				callbacks: {
					201: function (response) {
						this.imagePreview.find('img').attr({
							width: 200,
							height: 300, 
							src: response.url
						}).data('cropbox').remove();
						$('#imageId').val(response.id);
					}
				},
				cancel: function () {
					this.uploadTrigger.hide();
					this.cancelTrigger.hide();
					this.readTrigger.show();
					this.imagePreview.find('img').data('cropbox').remove();
				}
		});

		submit.on('click', function () {
			if (!form.valid()) {
				return false;
			}
			email = $('#email').val();
			var data = form.serialize();
			$.ajax({
				type: 'post',
				url: '?next=/accounts/register',
				data: data,
			}).then(
				function (data) {
					submit.hide();
					nextaction();
					$('.success a').text(email);
					$('<button class="btn bg-green-light" type="button"><a href="' +
						data.direct_url + '" class="white">去邮箱</a></button>')
					.appendTo(submit.parent()).siblings().hide();
				},
				function (data) {
					var response = data.responseJSON,
						errorInInfo = $.map(response, function (v, i) {
							return i in rules ? i : null;
						})
					form.validate().showErrors(response);
					if (errorInInfo.length > 0) {
						$('#previous').trigger('click');
					}
				}
			)
			return false;
		})
		skip.on('click', function () {
			submit.trigger('click');
		})
	})
})