/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: list,toolbar,stylescombo,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {
		config: {
			stylesSet : [ {
				name: 'Square Bulleted List',
				element: 'ul',
				styles: { 'list-style-type': 'square' }
			} ],
			extraAllowedContent: '*[id]'
		},
		startupData: '<p><ul><li id="foo">foo</li></ul></p><p id="bar">bar</p>'
	};


	bender.test( {
		'test styles combo state': function() {
			var editor = this.editor,
				foo = editor.document.getById( 'foo' ),
				bar = editor.document.getById( 'bar' ),
				stylesCombo = editor.ui.get( 'Styles' );

			editor.focus();

			editor.getSelection().selectElement( bar );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, stylesCombo._.state, 'is disabled in paragraph' );

			editor.getSelection().selectElement( foo );
			assert.areSame( CKEDITOR.TRISTATE_OFF, stylesCombo._.state, 'is enabled in list' );

			editor.getSelection().selectElement( bar );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, stylesCombo._.state, 'is enabled when we are back in paragraph' );
		}
	} );
} )();