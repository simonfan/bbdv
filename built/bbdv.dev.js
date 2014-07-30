define('bbdv/aux',['require','exports','module'],function defAux(require, exports, module) {

	/**
	 * Copied from Epeli's underscore.string "camelize"
	 * https://github.com/epeli/underscore.string/blob/master/lib/underscore.string.js
	 *
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	exports.camelCase = function camelCase(str) {
		return str.replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
	};


	/**
	 * Creates a Regular Expression to capture property name.
	 *
	 *
	 */
	exports.buildPrefixRegExp = function buildPrefixRegExp(prefix) {
		return new RegExp('^' + prefix + '([A-Z$_].*$|$)');
	};

	/**
	 * Returns the string with the first letter to lowercase.
	 */
	exports.lowercaseFirst = function lowercaseFirst(str) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	};

	/**
	 * Returns the string with the first letter to uppercase.
	 */
	exports.uppercaseFirst = function uppercaseFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
});

define('bbdv/extract-directive-arguments',['require','exports','module','lodash','bbdv/aux'],function (require, exports, module) {

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

define('bbdv/execute-directives',['require','exports','module','lodash','bbdv/extract-directive-arguments','bbdv/aux'],function defExecuteDirectives(require, exports, module) {

	var _ = require('lodash');

	var extractDirectiveArgs = require('bbdv/extract-directive-arguments'),
		aux                  = require('bbdv/aux');

	/**
	 * [exports description]
	 * @param  {[type]} context             [description]
	 * @param  {[type]} $el                 [description]
	 * @param  {[type]} namespace           [description]
	 * @param  {[type]} dirNamespaces [description]
	 * @return {[type]}                     [description]
	 */
	module.exports = function executeDirectives($el, namespace, directives) {

		// extract options from the $el.data()
		var directiveArgs = extractDirectiveArgs(namespace, _.keys(directives), $el.data());

		// run context
		_.each(directiveArgs, function (dirArg, dirNs) {

			// get fn
			var dirFn = directives[dirNs];

			if (_.isFunction(dirFn)) {
				// invoke
				dirFn.call(this, $el, dirArg);

			} else {
				// is object
				// { fn: dirFn, args: [], exclude: [] }

				// exclude
				if (dirFn.exclude) {
					_.each(dirFn.exclude, function (prop) {
						delete dirArg[prop];
					});
				}

				// invoke
				dirFn.fn.call(this, $el, dirArg);
			}

		}, this);

	}

});

//     bbdv
//     (c) simonfan
//     bbdv is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module bbdv
 */

define('bbdv',['require','exports','module','lowercase-backbone','jquery','lodash','bbdv/execute-directives','bbdv/aux'],function defbbdv(require, exports, module) {
	

	var backbone = require('lowercase-backbone'),
		$        = require('jquery')
		_        = require('lodash');

	var executeDirectives = require('bbdv/execute-directives'),
		aux               = require('bbdv/aux');

	var _initialize = backbone.view.prototype.initialize;

	function findDirectedElements($root, selector) {
		var $directed;

		// check if $root has directives
		if ($root.is(selector)) {
			$directed = $root.add($root.find(selector));
			// $el.add() creates a NEW SELECTION :)
			// it does not add to the original jq object.
		} else {
			$directed = $root.find(selector);
		}

		return $directed;
	}


	var bbdv = module.exports = backbone.view.extend({

		initialize: function initializeDirectiveView(options) {

			_initialize.call(this, options);

			// set up options.
			_.each(['namespace', 'directives'], function (opt) {
				this[opt] = options[opt] || this[opt];
			}, this);

			// find directed elements.
			var selector  = this.selector(this.namespace),
				$directed = findDirectedElements(this.$el, selector);

			// parse out directive functions
			this.directives = _.reduce(this.directives, function (directives, fn, ns) {

				// fn may be either a function by itself or
				// a string that refers to a method of the view object.
				directives[aux.camelCase(ns)] = _.isString(fn) ? this[fn] : fn;

				// return the directives.
				return directives;

			}, {}, this);

			// execute directives
			// keep variables in cache befoer loop
			var namespace  = this.namespace,
				directives = this.directives;

			_.each($directed, function (el) {

				executeDirectives.call(this, $(el), namespace, directives);

			}, this);

		},

		/**
		 * Define directives here.
		 * @type {Object}
		 */
		directives: {},

		namespace: 'dir',

		selector: function buildSelector(namespace) {

			return '[data-' + namespace + ']';

			// the selector
		//	return ':data-prefix(' + namespace + ')';
		},


	});

	bbdv.assignStatic('directive', function () {

		if (_.isObject(arguments[0])) {

			// arguments = [{ directineNamespace: directiveFn_or_directiveFnName }]
			_.assign(this.prototype.directives, arguments[0]);

		} else {
			// arguments = [directiveNamespace, directiveFn_or_directiveFnName ]
			this.prototype.directives[arguments[0]] = arguments[1];

		}

	});


	bbdv.assignStatic('extendDirectives', function (directives) {

		// directives = { directineNamespace: directiveFn }
		// requires directiveFn to be a real function


		var inheritedDirectives = _.create(this.prototype.directives);
		_.assign(inheritedDirectives, directives);

		var extended = this.extend({ directives: inheritedDirectives });

		return extended;
	});
});

