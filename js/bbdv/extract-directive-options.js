define(function (require, exports, module) {

	var _ = require('lodash');

	var aux = require('bbdv/aux');

	function buildDirectiveRegExp(namespace, directiveNamespace) {


		var prefix = aux.camelCase(namespace + '-' + directiveNamespace);

		console.log(prefix)


		return aux.buildPrefixRegExp(prefix);
	}

	module.exports = function extractDirectiveOptions(namespace, directiveNamespaces, data) {


		// namespace defaults to empty string
		namespace = namespace || '';

		var directiveRegExps = {},
			directiveOptions = {};

		// loop through the full data only once.
		_.each(data, function (value, key) {


			// loop only until one ns is found
			// when one is found, return immediately.
			_.any(directiveNamespaces, function (dirns) {

				// get the regular expression for the directive.
				var dirregexp = directiveRegExps[dirns];
				if (!dirregexp) {
					// if no dirregexp was found in cache,
					// build a new one and cache it.
					dirregexp = directiveRegExps[dirns] = buildDirectiveRegExp(namespace, dirns);
				}

				// try to match
				var match = key.match(dirregexp);

				if (match) {

					// set value onto options
					var diroptions = directiveOptions[dirns];
					if (!diroptions) {
						// if no options were previously defined
						// create one
						diroptions = directiveOptions[dirns] = {};
					}

					diroptions[aux.lowercaseFirst(match[1])] = value;

					// break loop.
					return true;
				} // else return undefined.

			}, this);

		}, this);


		return directiveOptions;
	};

});
