/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog,dialogui */

( function() {
	'use strict';

	var container = new CKEDITOR.dom.element( 'div' );

	bender.test( {
		'test CKEDITOR.ui.dialog.radio wai-aria role=radiogroup': function() {
			var htmlList = [];

			new CKEDITOR.ui.dialog.radio( this.getDialogMockup(), this.getMockupRadioDefinition(), htmlList );

			container.setHtml( htmlList.join( '' ) );

			var wrapper = container.findOne( '.cke_dialog_ui_radio' );

			assert.areSame( 'radiogroup', wrapper.getAttribute( 'role' ), 'Role "radiogroup" for set for the container' );
		},

		'test CKEDITOR.ui.dialog.labeledElement wai-aria role': function() {
			var outputHtml = [],
				contentFunction = function() {
					return '';
				};

			new CKEDITOR.ui.dialog.labeledElement( this.getDialogMockup(), {}, outputHtml, contentFunction );

			container.setHtml( outputHtml.join( '' ) );

			var labeled = container.findOne( '.cke_dialog_ui_labeled_content' );

			assert.areSame( 'presentation', labeled.getAttribute( 'role' ), 'Role "presentation" set for labeled content' );
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