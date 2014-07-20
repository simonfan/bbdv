define(function defExecuteDirectives(require, exports, module) {

	var _ = require('lodash');

	var extractDirectiveOptions = require('bbdv/extract-directive-options');


	/**
	 * Run directives
	 * @param  {[type]} $el        [description]
	 * @param  {[type]} namespace  [description]
	 * @param  {[type]} directives [description]
	 * @return {[type]}            [description]
	 */
	module.exports = function executeDirectives($el, namespace, directives) {

		var directiveOptions = extractDirectiveOptions(namespace, _.keys(directives), $el.data());

		console.log(directiveOptions)

		_.each(directiveOptions, function (diropts, dirns) {

			// get fn
			directives[dirns].call(this, $el, diropts);

		}, this);

	}

});
