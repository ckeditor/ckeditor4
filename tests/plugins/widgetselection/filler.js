/* bender-tags: 4.6.1, tc, 11064, widgetselection */
/* bender-ckeditor-plugins: widgetselection */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		init: function() {
			this.widgetselection = CKEDITOR.plugins.widgetselection;
			this.compareOptions = {
				fixStyles: true,
				compareSelection: true,
				normalizeSelection: true
			};
		},

		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			this.widgetselection.startFiller = null;
			this.widgetselection.endFiller = null;
		},

		'test createFiller': function() {
			assert.isTrue( !!this.widgetselection.createFiller, 'createFiller function exists' );

			var startFiller = this.widgetselection.createFiller(),
				endFiller = this.widgetselection.createFiller( true );

			assert.isTrue( startFiller.getAttribute( 'data-cke-temp' ) == 1 );
			assert.isTrue( startFiller.getAttribute( 'data-cke-filler-webkit' ) == 'start' );

			assert.isTrue( endFiller.getAttribute( 'data-cke-temp' ) == 1 );
			assert.isTrue( endFiller.getAttribute( 'data-cke-filler-webkit' ) == 'end' );
		},

		'test hasFiller': function() {
			assert.isTrue( !!this.widgetselection.hasFiller, 'hasFiller function exists' );

			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>This is text</p>' );
			assert.isFalse( this.widgetselection.hasFiller( editor.editable() ) );

			bender.tools.selection.setWithHtml( editor, '<div data-cke-filler-webkit="start">&nbsp;</div><p>This is text</p>' );
			assert.isTrue( this.widgetselection.hasFiller( editor.editable() ) );

			bender.tools.selection.setWithHtml( editor, '<p>This is text</p><div data-cke-filler-webkit="end">&nbsp;</div>' );
			assert.isTrue( this.widgetselection.hasFiller( editor.editable() ) );
		},

		'test removeFiller': function() {
			assert.isTrue( !!this.widgetselection.removeFiller, 'removeFiller function exists' );

			var editor = this.editor,
				editable = editor.editable();


			bender.tools.selection.setWithHtml( editor,
				'<div data-cke-filler-webkit="start" data-cke-temp="1">{}&nbsp;</div><p contenteditable="false">Non-editable</p><p>This is text</p>' );

			this.widgetselection.removeFiller( editable.findOne( 'div[data-cke-filler-webkit]' ), editable );

			assert.isInnerHtmlMatching( '<p contenteditable="false">Non-editable</p><p>^This is text</p>',
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );


			bender.tools.selection.setWithHtml( editor,
				'<p>This is text</p><p contenteditable="false">Non-editable</p><div data-cke-filler-webkit="end" data-cke-temp="1">{}Filler text</div>' );

			this.widgetselection.removeFiller( editable.findOne( 'div[data-cke-filler-webkit]' ), editable );

			assert.isInnerHtmlMatching( '<p>This is text</p><p contenteditable="false">Non-editable</p><p>Filler text^</p>',
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		}
	} );
} )();
