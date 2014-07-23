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
