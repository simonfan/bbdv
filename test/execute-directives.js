define(['bbdv/execute-directives', 'should', 'jquery', 'lodash'],
function (executeDirectives      ,  should ,  $      ,  _      ) {



	describe('bbdv execute-directives', function () {


		beforeEach(function () {

			this.$div = $([
				'<div id="root"',
					'data-bind-out-name="html"',
					'data-bind-out-color="css:background-color"',
					'data-bind-name="data:name"',
					'data-bind-color="data:color"',
				'>',
				'</div>',
			].join(' ')).appendTo($('body'));


			this.$input = $([
				'<input id="name-input"',
					'data-bind-name="value"',
					'data-bind-out-color="css:color"',
				'>',
			].join(' ')).appendTo($('body'));

		});

		afterEach(function () {
			this.$div.remove();

			this.$input.remove();
		})

		it(':)', function () {

			// control.
			var executed = {
				out: {},
				'': {},
			};

			// define directives.
			var directives = {
				'': function ($el, options) {
					executed[''] = options;
				},
				out: function ($el, options) {
					executed.out = options;
				},
			};

			// run method
			executeDirectives(this.$div, 'bind', directives);

			// check that the directives were parsed in
			// "most specific order"
			// [out, ''];


			executed.out.should.eql({
				name: 'html',
				color: 'css:background-color'
			});

			executed[''].should.eql({
				name: 'data:name',
				color: 'data:color'
			})


		});

	});

});
