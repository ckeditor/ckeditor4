/* bender-tags: editor */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	bender.editors = {
		inline: {
			creator: 'inline',
			name: 'foo'
		},
		classic: {
			creator: 'replace',
			name: 'bar'
		}
	};

	var tests = {
		'test element.getEditor': function() {
			var inlineEditor = this.editors.inline,
				classicEditor = this.editors.classic,
				firstParagraph = inlineEditor.editable().findOne( 'p' ),
				firstParagraphClassic = classicEditor.editable().findOne( 'p' );

			// Inline editor.
			assert.isNull( firstParagraph.getEditor(), 'Paragraph from the editable' );
			assert.areSame( inlineEditor, CKEDITOR.document.findOne( '#foo' ).getEditor(), '#foo element editor' );

			// Classic editor.
			assert.isNull( firstParagraphClassic.getEditor(), 'Paragraph from the editable' );
			assert.areSame( classicEditor, CKEDITOR.document.findOne( '#bar' ).getEditor(), '#foo element editor' );

			// Dummy node.
			assert.isNull( CKEDITOR.document.findOne( '#baz' ).getEditor(), 'Editor-less node' );
		},

		'test element.getEditor deoptimized': function() {
			var inlineEditor = this.editors.inline,
				classicEditor = this.editors.classic,
				firstParagraph = inlineEditor.editable().findOne( 'p' ),
				firstParagraphClassic = classicEditor.editable().findOne( 'p' );

			// Inline editor.
			assert.areSame( inlineEditor, firstParagraph.getEditor( false ), 'Paragraph from the editable' );
			assert.areSame( inlineEditor, inlineEditor.editable().getEditor( false ), 'Getting an editor based on editable itself' );
			assert.areSame( inlineEditor, CKEDITOR.document.findOne( '#foo' ).getEditor( false ), '#foo element editor' );

			// Classic editor.
			assert.areSame( classicEditor, firstParagraphClassic.getEditor( false ), 'Paragraph from the editable' );
			assert.areSame( classicEditor, classicEditor.editable().getEditor( false ), 'Getting an editor based on editable itself' );
			assert.areSame( classicEditor, CKEDITOR.document.findOne( '#bar' ).getEditor( false ), '#foo element editor' );

			// Dummy node.
			assert.isNull( CKEDITOR.document.findOne( '#baz' ).getEditor( false ), 'Editor-less node' );
		},

		// https://dev.ckeditor.com/ticket/16600
		'test element.getEditor deoptimized with uninitialized editor': function() {
			CKEDITOR.document.getBody().append( CKEDITOR.dom.element.createFromHtml( '<textarea id="editor1" name="editor1"></textarea>' ) );
			CKEDITOR.replace( 'editor1' );

			assert.isNull( CKEDITOR.document.getBody().getEditor( false ) );
		}
	};

	bender.test( tests );
} )();
