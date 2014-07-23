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

			var args = [$el, dirArg];

			// get fn
			var dirFn = directives[dirNs];

			if (_.isFunction(dirFn)) {
				// invoke
				dirFn.apply(this, args);

			} else {
				// is object
				// { fn: dirFn, args: [] }

				// pick extra args if required
				if (dirFn.args && dirFn.args.length > 0) {

					args = args.concat(_.map(dirFn.args, function (a) {
						return directiveArgs[a];
					}));
				}

				// invoke
				dirFn.fn.apply(this, args);
			}

		}, this);

	}

});
