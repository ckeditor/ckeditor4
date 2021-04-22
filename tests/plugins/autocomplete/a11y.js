/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete,divarea,sourcearea */

( function() {
	'use strict';

	bender.editor = {};

	var configDefinition = {
		textTestCallback: textTestCallback,
		dataCallback: dataCallback
	};

	bender.test( {
		// (#4617)
		'test autocomplete adds correct ARIA attributes to the editor\'s editable': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, configDefinition ),
				viewElement = autoComplete.view.element,
				viewElementId = viewElement.getAttribute( 'id' );

			assert.areSame( viewElementId, editable.getAttribute( 'aria-controls' ), 'Wrong value for [aria-controls] attribute' );
			assert.areSame( 'list', editable.getAttribute( 'aria-autocomplete' ), 'Wrong value for [aria-autocomplete] attribute' );
			assert.areSame( 'false', editable.getAttribute( 'aria-expanded' ), 'Wrong value for [aria-expanded] attribute' );
			assert.areSame( '', editable.getAttribute( 'aria-activedescendant' ), 'Wrong value for [aria-activedescendant] attribute' );

			autoComplete.destroy();
		}
	} );

	function textTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function dataCallback( matchInfo, callback ) {
		return callback( [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' }, { id: 3, name: 'item3' } ] );
	}

} )();
