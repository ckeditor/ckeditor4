/* bender-tags: editor */

bender.editor = {};

'use strict';

bender.test( {
	// (#4293)
	'test invoke CKEDITOR.inlineAll after creating some editor': function() {
		var spy = sinon.spy( CKEDITOR, 'error' ),
			elementId = 'editorInlined',
			element = CKEDITOR.document.getById( elementId );

		element.$.contentEditable = true;

		CKEDITOR.inline( elementId, {
			on: {
				instanceReady: function() {
					resume( function() {
						spy.restore();
						assert.areSame( 0, spy.callCount, 'Error count' );
					} );
				}
			}
		} );

		// We simulate running it after asynchronously loading CKEditor (e.g. in framework integration).
		CKEDITOR.inlineAll();

		wait();
	}
} );
