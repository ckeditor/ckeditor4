/* bender-tags: editor */
/* bender-ckeditor-plugins: widgetselection */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			creator: 'replace'
		},
		divarea: {
			creator: 'replace',
			config: {
				extraPlugins: 'divarea'
			}
		}
	};

	// This function fires keydown event on a given element and propagates to all parents,
	// including the document to mimic event bubbling.
	function fireBubblingKeyEvent( element, eventData ) {
		var elementsChain = element.getParents();

		if ( element instanceof CKEDITOR.dom.element ) {
			elementsChain.unshift( element.getDocument() );
		}

		for ( var i = elementsChain.length - 1; i >= 0; i-- ) {
			elementsChain[ i ].fire( 'keydown', new CKEDITOR.dom.event( eventData ) );
		}
	}

	function testKeyCombination( eventHost, eventData, callCount ) {
		var addFillersStub = sinon.stub( CKEDITOR.plugins.widgetselection, 'addFillers' );

		fireBubblingKeyEvent( eventHost, eventData );

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
			var editor = this.editors.classic;
			this.editorBots.classic.setHtmlWithSelection( '<p contenteditable="false">Non-editable</p><p>This ^is text</p>' );

			testKeyCombination( editor.editable(), { keyCode: 65, ctrlKey: true }, 1 );
		},

		'test ctrl + alt + a key combination': function() {
			var editor = this.editors.classic;
			this.editorBots.classic.setHtmlWithSelection( '<p contenteditable="false">Non-editable</p><p>This ^is text</p>' );

			testKeyCombination( editor.editable(), { keyCode: 65, ctrlKey: true, altKey: true }, 0 );
		},

		// (#1719)
		'test ctrl + a in the same document but outside of the editable': function() {
			var eventData = {
					keyCode: 65,
					ctrlKey: true
				},
				focusTrap = CKEDITOR.document.getById( 'focus-trap' );

			this.editorBots.divarea.setHtmlWithSelection( '<ul><li>Sample text</li></ul><p>Paragraph</p><ul><li>Sample ^text</li></ul>' );

			focusTrap.focus();

			testKeyCombination( focusTrap, eventData, 0 );
		}
	} );

} )();
