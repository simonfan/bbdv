//     bbdv
//     (c) simonfan
//     bbdv is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module bbdv
 */

define(function defbbdv(require, exports, module) {
	'use strict';

	var view = require('bb-rendered-view'),
		$    = require('jquery'),
		_    = require('lodash');

	var aux               = require('bbdv/aux'),
		executeDirectives = require('bbdv/execute-directives');

	var _init = view.prototype.initialize;


	var bbdv = module.exports = view.extend({

		initialize: function initializeDirectiveView(options) {

			_init.call(this, options);

			// set up options.
			_.each(['namespace', 'directives'], function (opt) {
				this[opt] = options[opt] || this[opt];
			}, this);

			// parse out directive functions
			this.directives = _.reduce(this.directives, function (directives, fn, ns) {

				// fn may be either a function by itself or
				// a string that refers to a method of the view object.
				directives[aux.camelCase(ns)] = _.isString(fn) ? this[fn] : fn;

				// return the directives.
				return directives;

			}, {}, this);

			console.log(this.directives);


			// execute the directives
			this.incorporate(this.$el);

		},

		/**
		 * Executes the directives on the element passed.
		 *
		 * @param  {[type]} $el [description]
		 * @return {[type]}     [description]
		 */
		incorporate: function incorporate($el) {

			// force the $el into a jquery object
			$el = $($el);


				// grap direct references in order not to look them up
				// during loops
			var directives = this.directives,
				namespace  = this.namespace;

				// build up the selector using the selector method.
			var selector   = this.selector(this.namespace),
				// find all descendants that match the selector
				// and add back those root els that also match.
				$directed  = $el.find(selector);

				// leave the addBack portion.
				//.addBack(selector);

			// execute the directives for each of the lements
			// selected.
			_.each($directed, function (el) {

				// invoke the executeDirectives
				// in the bbdv instance's context
				// passing the $el, namespace and directives as arguments.
				executeDirectives.call(this, $(el), namespace, directives);

			}, this);

			return this;
		},

		/**
		 * Define directives here.
		 * @type {Object}
		 */
		directives: {},

		namespace: 'dir',

		/**
		 * Builds the selector, based on the namespace of the
		 * directive view.
		 *
		 * Override in order to have custom selectors.
		 *
		 * @param  {[type]} namespace [description]
		 * @return {[type]}           [description]
		 */
		selector: function buildSelector(namespace) {

			return '[data-' + namespace + ']';

			// the selector
		//	return ':data-prefix(' + namespace + ')';
		},


	});



	/**
	 * Static directive definition method.
	 *
	 * @return {[type]} [description]
	 */
	bbdv.assignStatic('directive', function () {

		if (_.isObject(arguments[0])) {

			// arguments = [{ directineNamespace: directiveFn_or_directiveFnName }]
			_.assign(this.prototype.directives, arguments[0]);

		} else {
			// arguments = [directiveNamespace, directiveFn_or_directiveFnName ]
			this.prototype.directives[arguments[0]] = arguments[1];

		}

	});

	/**
	 * Extends the view and defines directives on the extended object.
	 *
	 * @param  {[type]} directives [description]
	 * @return {[type]}            [description]
	 */
	bbdv.assignStatic('extendDirectives', function (directives) {

		// directives = { directineNamespace: directiveFn }
		// requires directiveFn to be a real function


		var inheritedDirectives = _.create(this.prototype.directives);
		_.assign(inheritedDirectives, directives);

		var extended = this.extend({ directives: inheritedDirectives });

		return extended;
	});
});
