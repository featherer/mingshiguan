'use strict';
define(['jquery'], function ($) {
	var Publisher =  (function () {
		var traverse = function (action, subscribers, type, arg, context) {
			var subscribers = subscribers[type],
			i,
			max = subscribers ? subscribers.length : 0;

			for (i = 0; i < max; i = i + 1) {
				if (action === 'trigger') {
					subscribers[i].fn.call(subscribers[i].context, arg);
				} else {
					if (subscribers[i].fn === arg && subscribers[i].context === context) {
						subscribers.splice(i, 1);
					}
				}
			}
		};
		return {
			make: function (obj) {
				var i;
				for (i in Publisher) {
					if (Publisher.hasOwnProperty(i) && typeof Publisher[i] === 'function' && i !== 'make') {
						obj[i] = Publisher[i];
					}
				}
				obj.subscribers = {};
				return obj;
			},
			on: function (type, fn, context) {
				fn = typeof fn === 'function' ? fn : context[fn];

				if (typeof this.subscribers[type] === 'undefined') {
					this.subscribers[type] = [];
				}
				this.subscribers[type].push({fn: fn, context: context || null});
				return this;
			},
			off: function (type, fn, context) {
				traverse('off', this.subscribers, type, fn, context || null);
				return this;
			},
			trigger: function (type, arg) {
				traverse('trigger', this.subscribers, type, arg);
				return this;
			},
		}
	})();
	return {
		Publisher: Publisher 
	}
})