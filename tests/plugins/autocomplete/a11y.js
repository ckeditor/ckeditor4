/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete,divarea */

( function() {
	'use strict';

	bender.editor = {};

	var autoCompleteConfig = {
			textTestCallback: textTestCallback,
			dataCallback: dataCallback
		},
		ESC = 27,
		ARROW_UP = 38,
		ARROW_DOWN = 40,
		// I always mess up this name…
		ARIA_ACTIVEDESCENDANT = 'aria-activedescendant';

	bender.test( {
		// (#4617)
		'test autocomplete adds correct ARIA attributes to the editor\'s editable (divarea)': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig ),
				viewElement = autoComplete.view.element,
				viewElementId = viewElement.getAttribute( 'id' );

			assert.areSame( viewElementId, editable.getAttribute( 'aria-controls' ),
				'Wrong value for [aria-controls] attribute' );
			assert.areSame( 'list', editable.getAttribute( 'aria-autocomplete' ),
				'Wrong value for [aria-autocomplete] attribute' );
			assert.areSame( 'false', editable.getAttribute( 'aria-expanded' ),
				'Wrong value for [aria-expanded] attribute' );
			assert.areSame( '', editable.getAttribute( ARIA_ACTIVEDESCENDANT ),
				'Wrong value for [' + ARIA_ACTIVEDESCENDANT + '] attribute' );

			autoComplete.destroy();
		},

		// (#4617)
		'test autocomplete does not add correct ARIA attributes to the editor\'s editable (wysiwygarea)': function() {
			bender.editorBot.create( {
				name: 'wysiwygarea',
				config: {
					plugins: 'autocomplete,wysiwygarea'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable(),
					autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				assert.isFalse( editable.hasAttribute( 'aria-controls' ),
					'The [aria-controls] attribute is present' );
				assert.isFalse( editable.hasAttribute( 'aria-autocomplete' ),
					'The [aria-autocomplete] attribute is present' );
				assert.isFalse( editable.hasAttribute( 'aria-expanded' ),
					'The [aria-expanded] attribute is present' );
				assert.isFalse( editable.hasAttribute( ARIA_ACTIVEDESCENDANT ),
					'The [' + ARIA_ACTIVEDESCENDANT + '] attribute is present' );

				autoComplete.destroy();
			} );
		},

		// (#4617)
		'test opening and closing autocomplete changes the value of [aria-expanded] attribute': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

			this.editorBot.setHtmlWithSelection( '' );

			assert.areSame( 'false', editable.getAttribute( 'aria-expanded' ),
				'Wrong initial value for [aria-expanded] attribute' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assert.areSame( 'true', editable.getAttribute( 'aria-expanded' ),
				'Wrong value for [aria-expanded] attribute after opening autocomplete' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ESC } ) );

			assert.areSame( 'false', editable.getAttribute( 'aria-expanded' ),
				'Wrong value for [aria-expanded] attribute after closing autocomplete' );

			autoComplete.destroy();
		},

		// (#4617)
		'test opening and closing autocomplete changes the value of [aria-activedescendant] attribute': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig ),
				attributeName = ARIA_ACTIVEDESCENDANT,
				selectedItem,
				selectedItemId;

			this.editorBot.setHtmlWithSelection( '' );

			assert.areSame( '', editable.getAttribute( attributeName ),
				'Wrong initial value for [' + attributeName + '] attribute' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			selectedItem = autoComplete.view.getItemById( autoComplete.view.selectedItemId );
			selectedItemId = selectedItem.getAttribute( 'id' );

			assert.areSame( selectedItemId, editable.getAttribute( attributeName ),
				'Wrong value for [' + attributeName + '] attribute after opening autocomplete' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ESC } ) );

			assert.areSame( '', editable.getAttribute( attributeName ),
				'Wrong value for [' + attributeName + '] attribute after closing autocomplete' );

			autoComplete.destroy();
		},

		// (#4617)
		'test pressing Arrow Up key triggers [aria-activedescendant] attribute update to the selected item': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig ),
				attributeName = ARIA_ACTIVEDESCENDANT,
				selectedItem,
				selectedItemId;

			this.editorBot.setHtmlWithSelection( '' );

			assert.areSame( '', editable.getAttribute( attributeName ),
				'Wrong initial value for [' + attributeName + '] attribute' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ARROW_UP } ) );

			selectedItem = autoComplete.view.getItemById( autoComplete.view.selectedItemId );
			selectedItemId = selectedItem.getAttribute( 'id' );

			assert.areSame( selectedItemId, editable.getAttribute( attributeName ),
				'Wrong value for [' + attributeName + '] attribute after opening autocomplete' );

			autoComplete.destroy();
		},

		// (#4617)
		'test pressing Arrow Down key triggers [aria-activedescendant] attribute update to the selected item': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig ),
				attributeName = ARIA_ACTIVEDESCENDANT,
				selectedItem,
				selectedItemId;

			this.editorBot.setHtmlWithSelection( '' );

			assert.areSame( '', editable.getAttribute( attributeName ),
				'Wrong initial value for [' + attributeName + '] attribute' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ARROW_DOWN } ) );

			selectedItem = autoComplete.view.getItemById( autoComplete.view.selectedItemId );
			selectedItemId = selectedItem.getAttribute( 'id' );

			assert.areSame( selectedItemId, editable.getAttribute( attributeName ),
				'Wrong value for [' + attributeName + '] attribute after opening autocomplete' );

			autoComplete.destroy();
		},

		// (#4617)
		'test mouseover triggers [aria-activedescendant] attribute update to the selected item': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig ),
				target,
				targetId;

			this.editorBot.setHtmlWithSelection( '' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			target = autoComplete.view.element.getLast();
			targetId = target.getAttribute( 'id' );

			autoComplete.view.element.fire( 'mouseover', new CKEDITOR.dom.event( { target: target.$ } ) );

			assert.areSame( targetId, editable.getAttribute( ARIA_ACTIVEDESCENDANT ),
				'Wrong value for [' + ARIA_ACTIVEDESCENDANT + '] attribute' );

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
