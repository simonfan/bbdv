define(function (require, exports, module) {

	var _ = require('lodash');

	var aux = require('bbdv/aux');


	function buildDirectiveKey(namespace, directiveNamespace) {
		return aux.camelCase(namespace + '-' + directiveNamespace);
	}


	/**
	 * Given a namespace and a directive namespace
	 * returns the regular expression for matching the
	 * directive prefiz.
	 *
	 * @param  {[type]} namespace          [description]
	 * @param  {[type]} directiveNamespace [description]
	 * @return {[type]}                    [description]
	 */
	function buildDirectivePrefixRegExp(dirkey) {
		// build the regexp.
		return aux.buildPrefixRegExp(dirkey);
	}



	/**
	 * Extracts directive options
	 * from a data set given a namespace and
	 * an array of directive namespaces.
	 *
	 * THIS FUNCTION IS HIGHLY VERTICALIZED FOR OPTIMIZATION
	 *
	 * @param  {[type]} namespace           [description]
	 * @param  {[type]} directiveNamespaces [description]
	 * @param  {[type]} data                [description]
	 * @return {[type]}                     [description]
	 */
	module.exports = function extractDirectiveArguments(namespace, directiveNamespaces, data) {
		// namespace defaults to empty string
		namespace = namespace || '';

		// sort directiveNamespaces according to 'specificity'
		// (string length)
		// pretty clever trick here :)
		directiveNamespaces.sort(function (a, b) {
			return b.length - a.length;
		});

		// objects to store cache.
		var directiveArgs = {};

		// loop through the full data only once.
		_.each(data, function (dataValue, dataKey) {

			// loop through the directive namespaces
			// attempting to find a valid option.
			_.any(directiveNamespaces, function (dirNs) {

				// build dirKey
				var dirKey = buildDirectiveKey(namespace, dirNs);

				// first check if there is already an option set
				// and if the option is of type String.
				// If so, that means that an exact match
				// was found before, thus no need for further finding options
				// as exact matches prevail over prefix matches
				if (_.has(directiveArgs, dirNs) && !_.isObject(directiveArgs[dirNs])) {
					// continue loop
					return false;
				}

				// try for exact match
				if (dirKey === dataKey) {
					// there is an exact match of key and dirkey
					directiveArgs[dirNs] = dataValue;


					// break loop
					return true;

				} else {
					// no exact match,
					// try to find prefixed values.


					// get the regular expression for the directive
					// using the directive Key
					var dirRegExp = aux.buildPrefixRegExp(dirKey);

					// try to match
					var match = dataKey.match(dirRegExp);

					if (match) {
						// set value onto options
						var dirArg = directiveArgs[dirNs];
						if (!dirArg) { dirArg = directiveArgs[dirNs] = {}; }

						// set value
						dirArg[aux.lowercaseFirst(match[1])] = dataValue;

						// break loop.
						return true;
					}

				}


				// continue loop
				return false;


			}, this);

		}, this);


		return directiveArgs;
	};

});
