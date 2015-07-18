var template = 'hello, {{ name }}, this is {{ place}}';
var str = {name: 'feather', place: 'wuhan'};
var reg = /\{\{\s*(\w+)\s*\}\}/g;
template.replace(reg, function (_, value) {
	return str[value]
})
var test = [{"id": 9, "project": 2, "user": 1, "email": "admin@admin.com", "content": "评论内容", "datetime": "2014-07-28T08:22:00Z", "parent": null, "children": [] }, {"id": 10, "project": 2, "user": 1, "email": "admin@admin.com", "content": "评论内容", "datetime": "2014-07-28T08:43:12Z", "parent": null, "children": [{"id": 11, "project": 2, "user": null, "email": null, "content": "修改评论", "datetime": "2014-07-28T08:55:35Z", "parent": 10, "children": [{"id": 13, "project": 2, "user": 1, "email": "admin@admin.com", "content": "评论内容", "datetime": "2014-07-28T08:43:25Z", "parent": 11, "children": [] }, {"id": 14, "project": 2, "user": 1, "email": "admin@admin.com", "content": "评论内容", "datetime": "2014-07-28T08:43:27Z", "parent": 11, "children": [{"id": 15, "project": 2, "user": 1, "email": "admin@admin.com", "content": "评论内容", "datetime": "2014-07-28T08:43:33Z", "parent": 14, "children": [] } ] } ] } ] }, {"id": 12, "project": 2, "user": 1, "email": "admin@admin.com", "content": "评论内容", "datetime": "2014-07-28T08:43:18Z", "parent": null, "children": [] }, {"id": 16, "project": 2, "user": 1, "email": "admin@admin.com", "content": "评论内容", "datetime": "2014-07-28T08:45:31Z", "parent": null, "children": [] } ];
var template2 = '<li class="list clear"> <div class="left"> <div class="left round-icon"> <div class="round-icon-wrap"> <div class="round"></div> </div> </div> </div> <div class="right list-info title-small"> <p>沙发</p> </div> <div class="list-main"> <div class="list-person"><p class="normal green mr-12 inline-block">{{ email }}</p><span class="title-small">{{ datetime }}</span></div> <div class="list-comment inline-block">{{ content }}</div> </div>{{ child }}</li>';
var time = 0;
var generateHTML = function (str, num) {
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
			return v[value] || '';
		})
		if (v.children.length > 0) {
			time = time + 1;
			result = result.replace('{{ child }}', '<ul class="comment ' + (time % 2 === 1 ? 'odd': 'even') + '">' + generateHTML(v.children, 100) + '</ul>');
		}
	})
	return result
};
