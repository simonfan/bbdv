define(['bbdv/extract-directive-arguments', 'should'], function (extractDirectiveArgs, should) {



	describe('bbdv extract-directive-arguments', function () {


		it(':)', function () {

			var args = extractDirectiveArgs('dir', ['one', 'two'], {

				notDirective: 'value',
				dir: 'not-in',

				dirOne: 'option-for-one',

				// these will be ignored, as
				// dirOne is set.
				dirOneOpt1: 'one-v1',
				dirOneOpt2: 'one-v2',

				dirTwoOpt1: 'two-v1',
				dirTwoOpt2: 'two-v2',
			});


			args.one.should.eql('option-for-one');
			args.two.opt1.should.eql('two-v1');
			args.two.opt2.should.eql('two-v2');
		});



		it('specificity', function () {
			var args = extractDirectiveArgs('bind', ['', 'out', 'outWhen'], {

				bindName: 'bind:value',
				bindLastName: 'bind:value',
				bindOutName: 'bind-out:name',
				bindOutWhenName: 'bind-out-when:data',
				bindOutWhenLastName: 'bind-out-when:lastName'
			});

			args[''].should.eql({
				name: 'bind:value',
				lastName: 'bind:value',
			});

			args.out.should.eql({
				name: 'bind-out:name',
			});

			args.outWhen.should.eql({
				name: 'bind-out-when:data',
				lastName: 'bind-out-when:lastName'
			});
		})
	});

});
