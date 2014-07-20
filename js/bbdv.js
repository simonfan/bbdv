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


	var backbone = require('lowercase-backbone'),
		$        = require('jquery');

	var executeDirectives = require('bbdv/execute-directives');

	var _initialize = backbone.view.prototype.initialize;



	function findDirectedElements($root, selector) {
		var $directed = $root.find(selector);

		// check if $root has directives
		if ($root.is(selector)) {
			$directed = $directed.add($root);
			// $el.add() creates a NEW SELECTION :)
			// it does not add to the original jq object.
		}

		return $directed;
	}


	var bbdv = module.exports = backbone.view.extend({

		initialize: function initializeDirectiveView(options) {

			_initialize.call(this, options);

			// set up options.
			_.each(['namespace'], function (opt) {
				this[opt] = options[opt] || this[opt];
			}, this);

			// find directed elements.
			var selector  = this.selector(this.namespace),
				$directed = findDirectedElements(this.$el, selector);


			// execute directives
			// keep variables in cache befoer loop
			var namespace  = this.namespace,
				directives = this.directives;

			_.each($directed, function (el) {

				executeDirectives.call(this, $(el), namespace, directives);

			}, this);

		},

		directives: {},

		namespace: 'dir',

		selector: function buildSelector(namespace) {
			// the selector
			return ':data-prefix(' + namespace + ')';
		},


	});
});
