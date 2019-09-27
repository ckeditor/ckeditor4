/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: tableselection,clipboard,image,list,link,basicstyles */
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
			if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
				assert.ignore();
			}
		},

		// (#3278)
		'test copied image is not nested in table': function( editor, bot ) {
			var img = '<img alt="" src="http://cdn.ckeditor.com/4.12.1/full-all/samples/img/logo.svg" style="height:50px; width:172px">';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'image' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( img, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied image (partial selection) is not nested in table': function( editor, bot ) {
			var img = '<img alt="" src="http://cdn.ckeditor.com/4.12.1/full-all/samples/img/logo.svg" style="height:50px; width:172px">';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'image-partial' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( img, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied text is not nested in table': function( editor, bot ) {
			var text = '1.1';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'text' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied text (partial selection) is not nested in table': function( editor, bot ) {
			var text = '1.1';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'text-partial' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied formatted text is not nested in table': function( editor, bot ) {
			var text = '<em>1.1</em>';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'formatted-text' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied formatted text (partial selection) is not nested in table': function( editor, bot ) {
			var text = '<em>1.1</em>';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'formatted-text-partial' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied text with image is not nested in table': function( editor, bot ) {
			var text = 'Hello!<img alt="" src="http://cdn.ckeditor.com/4.12.1/full-all/samples/img/logo.svg" style="height:50px; width:172px">';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'text-with-image' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied link is not nested in table': function( editor, bot ) {
			var text = '<a href="https://cksource.com/">https://cksource.com/</a>';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'link' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied list is not nested in table': function( editor, bot ) {
			var text = '<ol><li>dar</li><li>jar</li><li>mar</li></ol>';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'list' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied text in nested table is not nested in table': function( editor, bot ) {
			var text = 'Help me, I am nested!';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'text-nested-table' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		},

		// (#3278)
		'test copied two cells ARE nested in table': function( editor, bot ) {
			var text = '<table border="1" cellpadding="1" cellspacing="1" style="width:500px" data-cke-table-faked-selection-table="">' +
				'<tbody><tr><td class="cke_table-faked-selection">start</td><td class="cke_table-faked-selection">end</td></tr></tbody></table>';

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'two-cells' ).getValue() );

			editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.beautified.html( text, CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

} )();
