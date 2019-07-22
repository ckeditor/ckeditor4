/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: undo,tableselection,image */
/* bender-include: ../../_helpers/tableselection.js */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},

		// (#3278)
		'test check if collapse selection is not copied': function( editor, bot ) {
			var img = '<img alt="" src="http://cdn.ckeditor.com/4.12.1/full-all/samples/img/logo.svg" style="height:50px; width:172px">';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'before' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.areSame( img, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

} )();
