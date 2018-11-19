/* bender-tags: editor */

( function() {
	bender.test( {
		// Purpose of this test is to detect whenever browser implements `focusOptions.preventScroll`.
		// Failing test means we should update `CKEDITOR.dom.element.prototype.focus` to drop usage of fallback for this browser.
		// Note: this test fails when refreshed on Edge, but on first run it passes. It looks like Edge doesn't focus editable element on refresh.
		// (#2420)
		'test native focus options': function() {
			if ( CKEDITOR.env.chrome || CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
				assert.ignore();
			}
			var document = CKEDITOR.document,
				container = document.findOne( '.container' ),
				editable = document.findOne( '.editable' );

			editable.$.focus( { preventScroll: true } );

			setTimeout( function() {
				resume( function() {
					assert.isFalse( container.$.scrollTop === 0 );
				} );
			} );
			wait();
		}
	} );

} )();
