( function() {
	'use strict';
	window.formsTools = {
		/**
		 * Asserts 'required' attribute of a form element.
		 *
		 * @param {Object} options
		 * @param {String} options.html Html string to be set as editor data.
		 * @param {String} options.type Type of tested form element.
		 * @param {Boolean} options.expected Whenever form dialog should have required field selected.
		 * */
		assertRequiredAttribute: function( options ) {
			return function() {
				var bot = this.editorBot;

				bot.setHtmlWithSelection( options.html );

				bot.dialog( options.type, function( dialog ) {
					assert[ options.expected ? 'isTrue' : 'isFalse' ]( dialog.getValueOf( 'info', 'required' ) );
					dialog.destroy();
				} );
			};
		}
	};
} )();
