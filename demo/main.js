define(['bbdv', 'backbone', 'jquery'], function (bbdv, Backbone, $) {

	var model = window.model = new Backbone.Model();

	var dview = bbdv.extendDirectives({


		hideIf: function hideIf($el, condition) {
			console.log(condition);
		},

		showIf: {
			fn: function showIf($el, conditions, hideCondition) {
				console.log(hideCondition)

				console.log('hide when ' + hideCondition);

				_.each(conditions, function (condition, attr) {

					console.log('if ' + attr + ' === ' + condition + ' show');
				})
			},

			args: ['hideIf'],
		}
	});


	window.view = dview({
		model: model,
		el: $('#bbdv-demo')
	});


	console.log('incorporate:');

	view.incorporate('<div data-dir data-dir-hide-if="condiiton"></div>');

});
