( function() {
	'use strict';
	window.emojiTools = {
		runAfterInstanceReady: function( editor, bot, testCase ) {
			// Emoji are loaded on instance ready, we need to wait for it.
			if ( editor.status !== 'ready' ) {
				editor.once( 'instanceReady', function() {
					resume( function() {
						testCase( editor, bot );
					} );
				}, null, null, 100 );
				wait();
			} else {
				testCase( editor, bot );
			}
		},
		clearAutocompleteModel: function( autocomplete ) {
			var model = autocomplete.model;
			delete model.data;
			delete model.lastRequestId;
			delete model.query;
			delete model.range;
			delete model.selectedItemId;
		},
		assertIsNullOrUndefined: function( value ) {
			assert.isTrue( value === undefined || value === null );
		},
		getEmojiPanelBlock: function( panel ) {
			var keys = CKEDITOR.tools.object.keys( panel._.panel._.blocks );
			return keys.length === 1 ? panel._.panel._.blocks[ keys[ 0 ] ] : null;
		}
	};
} )();
