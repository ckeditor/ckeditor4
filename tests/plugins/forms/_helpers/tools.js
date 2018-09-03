( function() {
	'use strict';
	window.formsTools = {
		/**
		 * Asserts required attribute of an form element.
		 *
		 * @param {Object} setup Test setup object
		 * @param {String} setup.html Html string to be set as editor data
		 * @param {String} setup.type Type of tested form element
		 * @param {Boolean} setup.expected Whenever form dialog should have required field selected
		 * */
		assertRequiredAttribute: function( setup ) {
			return function() {
				var bot = this.editorBot;

				bot.setHtmlWithSelection( setup.html );

				bot.dialog( setup.type, function( dialog ) {
					assert[ setup.expected ? 'isTrue' : 'isFalse' ]( dialog.getValueOf( 'info', 'required' ) );
					dialog.destroy();
				} );
			};
		}
	};
} )();
