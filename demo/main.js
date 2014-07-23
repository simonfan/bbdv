define(['bbdv', 'backbone', 'jquery'], function (bbdv, Backbone, $) {

	var model = window.model = new Backbone.Model();

	var view = bbdv.extendDirectives({


		hideIf: function hideIf($el, condition) {
			console.log(condition);
		},

		showIf: function showIf($el, conditions) {

			_.each(conditions, function (condition, attr) {

				console.log('if ' + attr + ' === ' + condition + ' show');
			})
		}
	});


	view({
		model: model,
		el: $('#bbdv-demo')
	});




	v1 = bbdv.extendDirectives({
		hide: true,
		show: false
	});

	v1.directive('aaaaqwe', 'qweqwe')

	v2 = v1.extendDirectives({
		hide: false,
		lalala: 'a',
	});

	v2.directive('aaaa', 'bbb');

	console.log(v1.prototype.directives);
	console.log(v2.prototype.directives);

});
