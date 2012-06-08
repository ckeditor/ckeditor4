/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @file Horizontal Rule plugin.
 */

(function() {
	var horizontalruleCmd = {
		canUndo: false, // The undo snapshot will be handled by 'insertElement'.
		exec: function( editor ) {
			var hr = editor.document.createElement( 'hr' ),
				range = editor.createRange();

			editor.insertElement( hr );

			// If there's nothing or a non-editable block followed by, establish a new paragraph
			// to make sure cursor is not trapped.
			range.moveToPosition( hr, CKEDITOR.POSITION_AFTER_END );
			var next = hr.getNext();
			if ( !next || next.type == CKEDITOR.NODE_ELEMENT && !next.isEditable() )
				range.fixBlock( true, editor.config.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' );

			range.select();
		},
		context: 'hr'
	};

	var pluginName = 'horizontalrule';

	// Register a plugin named "horizontalrule".
	CKEDITOR.plugins.add( pluginName, {
		lang: [ 'af', 'ar', 'bg', 'bn', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en-au', 'en-ca', 'en-gb', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr-ca', 'fr', 'gl', 'gu', 'he', 'hi', 'hr', 'hu', 'is', 'it', 'ja', 'ka', 'km', 'ko', 'lt', 'lv', 'mk', 'mn', 'ms', 'nb', 'nl', 'no', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr-latn', 'sr', 'sv', 'th', 'tr', 'ug', 'uk', 'vi', 'zh-cn', 'zh' ],
		init: function( editor ) {
			if ( editor.blockless )
				return;

			editor.addCommand( pluginName, horizontalruleCmd );
			editor.ui.addButton && editor.ui.addButton( 'HorizontalRule', {
				label: editor.lang.horizontalrule.toolbar,
				command: pluginName
			});
		}
	});
})();
