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

			// parse out directive functions
			this.directives = _.reduce(this.directives, function (directives, fn, ns) {

				// fn may be either a function by itself or
				// a string that refers to a method of the view object.
				directives[aux.camelCase(ns)] = _.isFunction(fn) ? fn : this[fn];

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
			// the selector
			return ':data-prefix(' + namespace + ')';
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
