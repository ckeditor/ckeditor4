( function() {
	'use strict';

	/* exported contextTools */

	window.contextTools = {
		/*
		 * @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
		 */
		_assertToolbarVisible: function( expected, context, msg ) {
			assert.areSame( expected, context.toolbar._view.parts.panel.isVisible(), msg || 'Toolbar visibility' );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {CKEDITOR.editor} editor Editor instance for which balloontoolbar context should be created.
		 * @param {String[]} widgetNames List of widget names to be set as `options.widgets`.
		 * @param {String/String[]} buttons List of buttons to be set as `options.buttons`.
		 * @returns {CKEDITOR.plugins.balloontoolbar.context}
		 */
		_getContextStub: function( editor, widgetNames, buttons ) {
			return editor.balloonToolbars.create( {
				widgets: widgetNames,
				buttons: buttons || null
			} );
		}
	};
} )();
