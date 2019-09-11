/* bender-tags: editor,dialog,div */
/* bender-ckeditor-plugins: dialog,toolbar,button,div,table,list */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		setUp: function() {
			var processor = this.editor.dataProcessor;

			// Avoid result impacted by padding block.
			processor.toDataFormat = CKEDITOR.tools.override( processor.toDataFormat, function( org ) {
				return function() {
					var data = org.apply( this, arguments );
					return data.replace( /<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\1>)?\s*(?=$|<\/body>)/gi, '' );
				};
			} );

			// Force result data un-formatted.
			this.editor.dataProcessor.writer._.rules = {};
		},

		'test create div': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bender.tools.testInputOut( 'create', function( source, output ) {
				bot.setHtmlWithSelection( source );
				bot.dialog( 'creatediv', function( dialog ) {
					// (#2423)
					assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ), 'Dialog should be in creation mode' );
					assert.isNull( dialog.getModel( editor ), 'Model should not be defined' );

					dialog.getButton( 'ok' ).click();
					assert.areEqual( bender.tools.compatHtml( output ), bot.getData( 1 ) );
				} );
			} );
		},

		// https://dev.ckeditor.com/ticket/13585
		'test create div from selection from 2 adjacent divs': function() {
			var bot = this.editorBot;

			bender.tools.testInputOut( 'create-divs', function( source, output ) {
				bot.setHtmlWithSelection( source );

				bot.dialog( 'creatediv', function( dialog ) {
					dialog.getButton( 'ok' ).click();
					assert.areEqual( bender.tools.compatHtml( output ), bot.getData( 1 ) );
				} );
			} );
		},

		// https://dev.ckeditor.com/ticket/13585
		'test create nested divs from selection from 2 adjacent divs': function() {
			var bot = this.editorBot;

			bender.tools.testInputOut( 'create-divs-nested', function( source, output ) {
				bot.setHtmlWithSelection( source );

				bot.dialog( 'creatediv', function( dialog ) {
					dialog.getButton( 'ok' ).click();
					assert.areEqual( bender.tools.compatHtml( output ), bot.getData( 1 ) );
				} );
			} );
		},

		'test edit div': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bender.tools.testInputOut( 'edit', function( source, output ) {
				bot.setHtmlWithSelection( source );
				bot.dialog( 'editdiv', function( dialog ) {
					// (#2423)
					assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ), 'Dialog should be in editing mode' );
					assert.areEqual( CKEDITOR.plugins.div.getSurroundDiv( editor ), dialog.getModel( editor ), 'Model should be defined' );

					var styleField = dialog.getContentElement( 'info', 'elementStyle' ),
					classField = dialog.getContentElement( 'info', 'class' );

					styleField.setValue( 'background-color:blue' );
					classField.setValue( 'my-div' );
					dialog.getButton( 'ok' ).click();

					assert.areEqual( bender.tools.compatHtml( output ), bot.getData( 1 ) );
				} );
			} );
		},

		'test remove div': function() {
			var bot = this.editorBot;

			bender.tools.testInputOut( 'remove', function( source, output ) {
				bot.setHtmlWithSelection( source );
				bot.execCommand( 'removediv' );
				assert.areEqual( bender.tools.compatHtml( output ), bot.getData( 1 ) );
			} );
		}
	} );
} )();
