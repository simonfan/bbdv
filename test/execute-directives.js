define(['bbdv/execute-directives', 'should', 'jquery'], function (executeDirectives, should, $) {



	describe('bbdv execute-directives', function () {


		beforeEach(function () {

			this.$el = $([
				'<div id="root"',
					'data-bind-out-name="html"',
					'data-bind-out-color="css:background-color"',
				'>',
					'<input id="name-input" data-bind-name="value">',
					'<input id="color-input" data-bind-color="value">',
				'</div>',
			].join(' ')).appendTo($('body'));

		});


		it(':)', function () {

			var executed = {
				out: {},
				'': {},
			};

			console.log(this.$el.html())


			var directives = {
				out: function ($el, options) {

					executed.out[$el.prop('id')] = options;

				},
				'': function ($el, options) {
					executed[''][$el.prop('id')] = options;
				}
			};

			executeDirectives(this.$el, 'bind', directives);


			console.log(executed);
		});

	});

});
