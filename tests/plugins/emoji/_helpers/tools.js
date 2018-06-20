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
		notSupportEnvironment: CKEDITOR.env.ie && CKEDITOR.env.version < 11
	};
} )();
