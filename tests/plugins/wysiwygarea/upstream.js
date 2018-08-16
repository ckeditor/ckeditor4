/* bender-tags: upstream */

( function() {
	'use strict';

	bender.test( {
		// (#1907)
		// Tracks upstream bug for https://bugzilla.mozilla.org/show_bug.cgi?id=1327244
		'test gecko dropping a selection from iframe (requires focus)': function() {
			if ( !CKEDITOR.env.gecko ) {
				assert.ignore();
			}
			// Short note: this test is based on focuses to iframe > body - as listening to iframe focus alone
			// was not working on FF, as opposed to Chrome.
			var frame = CKEDITOR.document.getById( 'gecko-focus-hijack-regression' ),
				focusHost = CKEDITOR.document.getById( 'focus-host' ),
				frameDoc = frame.getFrameDocument(),
				frameBody = frameDoc.getBody(),
				rng = new CKEDITOR.dom.range( frameDoc );

			frameBody.once( 'focus', function() {
				focusHost.once( 'focus', function() {
					// Once the frame gets focused second time, resume the suite and assert that the selection has not been modified.
					frameBody.once( 'focus', function() {
						resume( function() {
							// If the following assertion fails that's great news! Maybe it means that FF fixed a bug.
							assert.areSame( '', frameDoc.getSelection().getSelectedText(), 'Looks like FF team did something about https://bugzilla.mozilla.org/show_bug.cgi?id=1327244 🙀' );

							// In that case just uncomment the following assertion, this is what ensures that it actually works as expected.
							// assert.areSame( 'Fir', frameDoc.getSelection().getSelectedText(), 'Proper text remains selected' );
						} );
					} );

					// Firefox won't be happy if it's not given some extra time to switch focus.
					window.setTimeout( function() {
						frameBody.focus();
					}, 100 );
				} );

				focusHost.focus();
			} );

			rng.setStart( frameBody.getFirst(), 0 );
			rng.setEnd( frameBody.getFirst(), 3 );

			frameDoc.getSelection().selectRanges( [ rng ] );

			frameBody.focus();

			wait();
		}
	} );

} )();
