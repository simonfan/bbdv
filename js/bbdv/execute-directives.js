define(function defExecuteDirectives(require, exports, module) {

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

			if (dirNs === '') {
				// call default
				var fn = directives[''] || directives['default'];
				fn.call(this, $el, dirArg);
			} else {

				// get fn and invoke it.
				directives[dirNs].call(this, $el, dirArg);
			}


		}, this);

	}

});
