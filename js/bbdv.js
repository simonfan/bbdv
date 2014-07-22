//     Bbdv
//     (c) simonfan
//     Bbdv is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module Bbdv
 */

define(function defBbdv(require, exports, module) {
	'use strict';

	require('jquery-selector-data-prefix');

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

			// parse out directives.
			var directives = this.directives;
			// transform directives in hash mapping
			// from directive namespace to directive method.
			directives = _.isArray(directives) ? _.zipObject(directives, directives) : directives;
			this.directives = _.reduce(directives, function (directives, fn, ns) {

				// fn may be either a function by itself or
				// a string that refers to a method of the view object.
				directives[aux.camelCase(ns)] = _.isFunction(fn) ? fn : this[fn];

				// return the directives.
				return directives;

			}, {}, this);

			// execute directives
			// keep variables in cache befoer loop
			var namespace  = this.namespace;

			_.each($directed, function (el) {

				executeDirectives.call(this, $(el), namespace, this.directives);

			}, this);

		},

		/**
		 * Array where the directive names are defined.
		 * The names defined here should have a corresponding method on the object.
		 * @type {Array}
		 */
		directives: [],

		namespace: 'dir',

		selector: function buildSelector(namespace) {
			// the selector
			return ':data-prefix(' + namespace + ')';
		},


	});


	bbdv.assignStatic('extendDirectives', function () {

		// extensions to be set onto the extended object.
		var extensions;

		// clone current directives array.
		var directives = _.clone(this.prototype.directives);

		if (arguments.length === 1) {
			// arguments = [{ directiveNamespace: directiveMethod }]
			extensions = arguments[0];

			directives = _.union(directives, _.keys(extensions));


		} else if (arguments.length === 2) {
			// arguments = [directiveNamespace, directiveMethod]
			extensions = {};
			extensions[arguments[0]] = arguments[1];

			directives.push(arguments[0]);
		}

		// set new directives onto extensions object.
		extensions.directives = directives;


		// extend and return.
		return this.extend(extensions);
	});
});
