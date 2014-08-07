define(function defBbdvParsers(require, exports) {

	var _ = require('lodash');

	// cache
	// TODO: study memory management.
	var _parsed = {};


	/**
	 * Parses a string into methodName and args.
	 * Example string: 'css:background-color'
	 *                 'attr:href'
	 *                 'val'
	 *                 'someMethod:arg1, arg2, arg3;'
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	var colonSplitter = /\s*:\s*/g,
		commaSplitter = /\s*,\s*/g,
		newline       = /\n/g;

	var methodStringRegExp = /\s*(.*?)\s*:\s*(.*)\s*/;

	function parseMethodStr(str) {
		// only do parsing if result is not found in cache.
		if (_parsed[str]) {
			return _parsed[str];
		}

		// remove newlines from str
		var _str = str.replace(newline, '');

		// create a var to hold the method invoking definition.
		var invocationDef = {};

		// attempt match with args
		if (str.indexOf(':') !== -1) {
			var match = str.match(methodStringRegExp);

			invocationDef.method = match[0];
			invocationDef.args   = match[1].split(commaSplitter);

		} else {
			// no colon in the string.
			// it is just a method
			invocationDef.method = str;
			invocationDef.args   = [];
		}

		// save to cache using original str value
		_parsed[str] = invocationDef;

		return invocationDef;
	}


	exports.execute = function execute(def /* args */) {

		var def = _.isObject(def) ? def : parseMethodStr(def);


	}

	exports.executeMethodString = function executeMethodString(methodStr) {



	};
});
