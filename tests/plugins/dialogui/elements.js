/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog,dialogui */

( function() {
	'use strict';

	bender.test( {
		'test CKEDITOR.ui.dialog.radio wai-aria role=radiogroup': function() {
			var htmlList = [],
				// We're also checking if class="cke_dialog_ui_radio" so we'll be sure that's wrapper, and
				// not any other element.
				radiogroupRegEx = /role="radiogroup"[^>]+class="cke_dialog_ui_radio"/g;

			new CKEDITOR.ui.dialog.radio( this.getDialogMockup(), this.getMockupRadioDefinition(), htmlList );

			htmlList = htmlList.join( '' );

			assert.areNotEqual( -1, htmlList.search( radiogroupRegEx ), 'Radiogroup not found in wrapper div' );
		},

		'test CKEDITOR.ui.dialog.labeledElement wai-aria role': function() {
			var outputHtml = [],
				contentFunction = function() { return ''; },
				radiogroupRegEx = /<div[^>]+class="cke_dialog_ui_labeled_content"[^>]+role="presentation"/;

			new CKEDITOR.ui.dialog.labeledElement( this.getDialogMockup(), {}, outputHtml, contentFunction );

			outputHtml = outputHtml.join( '' );

			assert.areNotEqual( -1, outputHtml.search( radiogroupRegEx ), 'No role="presentation" attribute in div.cke_dialog_ui_labeled_content.' );
		},

		// Returns the simplest possible radio dialog element definition.
		getMockupRadioDefinition: function() {
			return {
				items: [
					// At least one item is required.
					[ 'val', 'label' ]
				],
				type: 'radio'
			};
		},

		// Returns the simplest possible object that mimics a `CKEDITOR.dialog` variable.
		getDialogMockup: function() {
			return {
				_: {
					focusList: []
				},
				on: function() {}
			};
		}
	} );
} )();