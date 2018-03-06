/* bender-tags: editor */
/* bender-ckeditor-plugins: widgetselection */

( function() {
	'use strict';

	bender.editor = true;

	function testKeyCombination( editor, eventData, callCount ) {
		var addFillersStub = sinon.stub( CKEDITOR.plugins.widgetselection, 'addFillers' );

		editor.document.fire( 'keydown', new CKEDITOR.dom.event( eventData ) );

		// Test has to be async because widgetSelection.addFillers is called inside setTimeout.
		setTimeout( function() {
			resume( function() {
				addFillersStub.restore();
				assert.areSame( callCount, addFillersStub.callCount, 'addFillers call count' );
			} );
		}, 50 );

		wait();
	}

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}
		},

		'test `ctrl + a` key combination': function() {
			var editor = this.editor;
			this.editorBot.setHtmlWithSelection( '<p contenteditable="false">Non-editable</p><p>This ^is text</p>' );

			testKeyCombination( editor, { keyCode: 65, ctrlKey: true }, 1 );
		},

		'test ctrl + alt + a key combination': function() {
			var editor = this.editor;
			this.editorBot.setHtmlWithSelection( '<p contenteditable="false">Non-editable</p><p>This ^is text</p>' );

			testKeyCombination( editor, { keyCode: 65, ctrlKey: true, altKey: true }, 0 );
		}
	} );

} )();
