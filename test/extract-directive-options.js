define(['bbdv/extract-directive-options', 'should'], function (extract, should) {



	describe('bbdv extract-directive-options', function () {


		it(':)', function () {

			var options = extract('dir', ['one', 'two', ''], {

				notDirective: 'value',
				dir: 'not-in',

				dirOneOpt1: 'one-v1',
				dirOne: 'not-in',
				dirOneOpt2: 'one-v2'
			});

			console.log(options);

		});

	});

});
