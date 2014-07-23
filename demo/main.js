define(['bbdv', 'backbone', 'jquery'], function (bbdv, Backbone, $) {

	var model = window.model = new Backbone.Model();

	var view = bbdv.extendDirectives({


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


	view({
		model: model,
		el: $('#bbdv-demo')
	});

});
