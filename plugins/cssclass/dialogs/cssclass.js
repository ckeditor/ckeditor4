/**
 * The cssclass plugin dialog window definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add( 'cssclassDialog', function( editor ) {
	return {

		// Basic properties of the dialog window: title, minimum size.
		title: 'CSS/style Properties',
		minWidth: 400,
		minHeight: 200,

		// Dialog window content definition.
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-basic',
				label: 'Basic Settings',

				// The tab content.
				elements: [
					{
						// Text input field for the css class.
						type: 'text',
						id: 'cssclass',
						label: 'CSS class name(s)',

						// Called by the main setupContent method call on dialog initialization.
						setup: function( element ) {
							if (element.getAttribute("class")==null)
								this.setValue("");
							else 
								this.setValue( element.getAttribute("class") );
						},

						// Called by the main commitContent method call on dialog confirmation.
						commit: function( element ) {
							element.setAttribute("class",this.getValue());
						}
					},
					{
						// Text input field for the style text
						type: 'text',
						id: 'style',
						label: 'CSS style additional rule',

						// Called by the main setupContent method call on dialog initialization.
						setup: function( element ) {
							if (element.getAttribute("style")==null)
								this.setValue("");
							else 
								this.setValue( element.getAttribute("style") );
						},

						// Called by the main commitContent method call on dialog confirmation.
						commit: function( element ) {
							element.setAttribute("style",this.getValue());
						}
					}
					
				]
			}
		],

		// Invoked when the dialog is loaded.
		onShow: function() {

			// Get the selection from the editor.
			var selection = editor.getSelection();

			// Get the element at the start of the selection.
			var element = selection.getStartElement();

			// Get the <cssclass> element closest to the selection, if it exists.
			//if ( element )
			//	element = element.getAscendant( 'cssclass', true );

			// Create a new <cssclass> element if it does not exist.
			if ( !element) {
				element = editor.document.createElement( 'p' );

				// Flag the insertion mode for later use.
				this.insertMode = true;
			}
			else
				this.insertMode = false;

			// Store the reference to the <cssclass> element in an internal property, for later use.
			this.element = element;

			// Invoke the setup methods of all dialog window elements, so they can load the element attributes.
			if ( !this.insertMode )
				this.setupContent( this.element );
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {

			// The context of this function is the dialog object itself.
			// http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
			var dialog = this;

			var cssclass = this.element;

			// Invoke the commit methods of all dialog window elements, so the <cssclass> element gets modified.
			this.commitContent( cssclass );
		}
	};
});
