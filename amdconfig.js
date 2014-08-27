require.config({
	urlArgs: 'bust=0.6858062276151031',
	baseUrl: '/js',
	paths: {
		requirejs: '../bower_components/requirejs/require',
		text: '../bower_components/requirejs-text/text',
		mocha: '../node_modules/mocha/mocha',
		should: '../node_modules/should/should',
		bbdv: 'bbdv',
		backbone: '../bower_components/backbone/backbone',
		'jquery-selector-data-prefix': '../bower_components/jquery-selector-data-prefix/built/jquery-selector-data-prefix',
		'jquery-meta-data': '../bower_components/jquery-meta-data/built/jquery-meta-data',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		jquery: '../bower_components/jquery/dist/jquery',
		'lowercase-backbone': '../bower_components/lowercase-backbone/built/lowercase-backbone',
		'requirejs-text': '../bower_components/requirejs-text/text',
		qunit: '../bower_components/qunit/qunit/qunit',
		subject: '../bower_components/subject/built/subject',
		underscore: '../bower_components/underscore/underscore',
		swtch: '../bower_components/swtch/built/swtch',
		'bb-rendered-view': '../bower_components/bb-rendered-view/built/bb-rendered-view'
	},
	shim: {
		backbone: {
			exports: 'Backbone',
			deps: [
				'jquery',
				'underscore'
			]
		},
		underscore: {
			exports: '_'
		},
		mocha: {
			exports: 'mocha'
		},
		should: {
			exports: 'should'
		}
	}
});
