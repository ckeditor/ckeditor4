/* bender-tags: editor */
/* bender-ckeditor-plugins: link,toolbar,basicstyles */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		tearDown: function() {
			var dialog = CKEDITOR.dialog.getCurrent();

			if ( dialog ) {
				dialog.hide();
			}
		},

		// #476
		'test editing anchor': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.dialog( 'anchor', function( dialog ) {
				dialog.setValueOf( 'info', 'txtName', 'foo' );
				dialog.getButton( 'ok' ).click();

				var range = new CKEDITOR.dom.range( editor.document );
				range.selectNodeContents( editor.editable().findOne( '[data-cke-real-element-type=anchor]' ) );
				range.select();

				bot.dialog( 'anchor', function( dialog ) {
					dialog.setValueOf( 'info', 'txtName', 'bar' );
					dialog.getButton( 'ok' ).click();
					assert.isInnerHtmlMatching( '<p><a id="bar" name="bar"></a></p>', this.editor.getData() );
				} );
			} );
		},

		// #501
		'test double-click on anchor is opening anchor dialog': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<p><a name="foo" id="foo"></a></p>', function() {

				var range = new CKEDITOR.dom.range( editor.document );
				range.selectNodeContents( editor.editable().findOne( '[data-cke-real-element-type=anchor]' ) );
				range.select();

				editor.once( 'dialogShow', function( evt ) {
					resume( function() {
						assert.areSame( evt.data._.name, 'anchor', 'Anchor dialog has been opened.' );
					} );
				} );

				editor.fire( 'doubleclick', {
					element: editor.editable().findOne( '[data-cke-real-element-type=anchor]' )
				} );

				wait();
			} );
		},

		// (#3437)
		'test getModel when selection is inside anchor\'s text': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<p><a id="test" name="test">Foobar</a></p>', function() {
				var range = editor.createRange(),
					anchor = editor.editable().findOne( '#test' ),
					textNode = anchor.getChild( 0 );

				range.selectNodeContents( textNode );
				range.select();

				bot.dialog( 'anchor', function( dialog ) {
					assert.areSame( 'test', dialog.getValueOf( 'info', 'txtName' ) );
					assert.areSame( anchor, dialog.getModel( editor ) );
				} );
			} );
		},

		// (#3863)
		'test preserve duplicate anchors after editing word with custom style': function() {
			var editor = this.editor,
				bot = this.editorBot,
				html = '<p><a id="test" name="test"><strong>text</strong></a></p>';

			bot.setData( html, function() {
				var range = editor.createRange(),
					anchor = editor.editable().findOne( '#test' ),
					textNode = anchor.getChild( 0 );

				range.selectNodeContents( textNode );
				range.select();

				bot.dialog( 'anchor', function( dialog ) {
					dialog.setValueOf( 'info', 'txtName', 'duplicate-test' );
					dialog.getButton( 'ok' ).click();

					assert.areSame( anchor, dialog.getModel( editor ) );
				} );

			} );
		},

		// (#4728)
		'test prevent duplicate anchors in selected multi words with styles': function() {
			var editor = this.editor,
				bot = this.editorBot,
				template = '[<p>Simple <a id="multiTest" name="multiTest" data-cke-saved-name="multiTest"><strong>text</strong></a></p>]',
				expected = '<p><a id="multiTestResult" name="multiTestResult">Simple <strong>text</strong></a></p>';

			bot.setHtmlWithSelection( template );
			bot.dialog( 'anchor', function( dialog ) {
				dialog.setValueOf( 'info', 'txtName', 'multiTestResult' );
				dialog.getButton( 'ok' ).click();

				assert.beautified.html( expected, editor.getData() );
			} );
		}
	} );
}() );
