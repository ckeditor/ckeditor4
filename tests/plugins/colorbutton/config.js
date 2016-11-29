/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {
		config: {
			colorButton_normalizeBackground: false,
			extraAllowedContent: 'span{background}'
		}
	};

	bender.test( {
		'test config.normalizeBackground': function() {
			var input = '<p><span style="background:#ff0000">foo</span><span style="background:yellow">bar</span></p>';

			assert.areSame( input, this.editor.dataProcessor.toHtml( input ) );
		}
	} );
} )();
