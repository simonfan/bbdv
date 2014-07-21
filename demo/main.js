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



});
