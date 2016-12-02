/* bender-tags: 4.6.1, tc, 11064, widgetselection */
/* bender-ckeditor-plugins: wysiwygarea, widgetselection, clipboard */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFilter: null
		}
	};

	bender.test( {

		init: function() {
			this.widgetselection = CKEDITOR.plugins.widgetselection;
			this.compareOptions = {
				fixStyles: true,
				compareSelection: false
			};
		},

		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			this.widgetselection.startFiller = null;
			this.widgetselection.endFiller = null;
		},

		'test paste normal content': function() {
			bender.tools.selection.setWithHtml( this.editor, '{}' );
			bender.tools.emulatePaste( this.editor, '<p>Plain text</p>' );

			this.assertAfterPasteContent( '<p>Plain text</p>', 'Content pasted without changes.' );
			this.wait();
		},

		'test paste content with filler on the beginning': function() {
			bender.tools.selection.setWithHtml( this.editor, '{}' );
			bender.tools.emulatePaste( this.editor, '<div data-cke-filler-webkit="start" data-cke-temp="1" style="">&nbsp;</div><p>Plain text</p>' );

			this.assertAfterPasteContent( '<p>Plain text</p>', 'Filler removed on paste.' );
			this.wait();
		},

		'test paste content with filler on the end': function() {
			bender.tools.selection.setWithHtml( this.editor, '{}' );
			bender.tools.emulatePaste( this.editor, '<p>Plain text</p><div data-cke-filler-webkit="end" data-cke-temp="1" style="">&nbsp;</div>' );

			this.assertAfterPasteContent( '<p>Plain text</p>', 'Filler removed on paste.' );
			this.wait();
		},

		'test paste content with filler on the beginning and end': function() {
			bender.tools.selection.setWithHtml( this.editor, '{}' );
			bender.tools.emulatePaste( this.editor,
				'<div data-cke-filler-webkit="start" data-cke-temp="1" style="">&nbsp;</div><p>Plain text</p><div data-cke-filler-webkit="end" data-cke-temp="1" style="">&nbsp;</div>' );

			this.assertAfterPasteContent( '<p>Plain text</p>', 'Filler removed on paste.' );
			this.wait();
		},

		assertAfterPasteContent: function( html, msg ) {
			var tc = this;

			this.editor.on( 'afterPaste', function( evt ) {
				evt.removeListener();
				tc.resume( function() {
					assert.areSame( html, tc.editor.getData(), msg );
				} );
			} );
		}
	} );
} )();
