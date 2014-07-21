define(function defExecuteDirectives(require, exports, module) {

	var _ = require('lodash');

	var extractDirectiveArgs = require('bbdv/extract-directive-arguments'),
		aux                  = require('bbdv/aux');

	/**
	 * [exports description]
	 * @param  {[type]} context             [description]
	 * @param  {[type]} $el                 [description]
	 * @param  {[type]} namespace           [description]
	 * @param  {[type]} directiveNamespaces [description]
	 * @return {[type]}                     [description]
	 */
	module.exports = function executeDirectives(context, $el, namespace, directiveNamespaces) {

		// camelCase all directive namespaces
		directiveNamespaces = _.map(directiveNamespaces, aux.camelCase);

		// extract options from the $el.data()
		var directiveArgs = extractDirectiveArgs(namespace, directiveNamespaces, $el.data());

		// run context
		_.each(directiveArgs, function (dirArg, dirNs) {

			// get fn and invoke it.
			context[dirNs].call(this, $el, dirArg);

		}, this);

	}

});
