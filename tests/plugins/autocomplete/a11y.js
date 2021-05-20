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
		// Avoid attribute misspell in many places. Support IDE auto-complete.
		ARIA_ACTIVEDESCENDANT = 'aria-activedescendant',
		autoComplete;

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'autocomplete' );
		},

		tearDown: function() {
			autoComplete && autoComplete.destroy();
		},

		// (#4617)
		'test autocomplete adds correct ARIA attributes to the editor\'s editable (divarea)': function() {
			var editor = this.editor,
				editable = editor.editable(),
				viewElement,
				viewElementId;

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
					editable = editor.editable();

				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				assert.isFalse( editable.hasAttribute( 'aria-controls' ),
					'The [aria-controls] attribute is present' );
				assert.isFalse( editable.hasAttribute( 'aria-autocomplete' ),
					'The [aria-autocomplete] attribute is present' );
				assert.isFalse( editable.hasAttribute( 'aria-expanded' ),
					'The [aria-expanded] attribute is present' );
				assert.isFalse( editable.hasAttribute( ARIA_ACTIVEDESCENDANT ),
					'The [' + ARIA_ACTIVEDESCENDANT + '] attribute is present' );
			} );
		},

		// (#4617)
		'test opening and closing autocomplete changes the value of [aria-expanded] attribute': function() {
			var editor = this.editor,
				editable = editor.editable(),
				attributeName = 'aria-expanded';

			autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

			this.editorBot.setHtmlWithSelection( '' );

			assert.areSame( 'false', editable.getAttribute( attributeName ),
				'Wrong initial value for [aria-expanded] attribute' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assert.areSame( 'true', editable.getAttribute( attributeName ),
				'Wrong value for [aria-expanded] attribute after opening autocomplete' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ESC } ) );

			assert.areSame( 'false', editable.getAttribute( attributeName ),
				'Wrong value for [aria-expanded] attribute after closing autocomplete' );
		},

		// (#4617)
		'test opening and closing autocomplete does not add or change the value of [aria-expanded] attribute for iframe-based editor': function() {
			bender.editorBot.create( {
				name: 'wysiwygarea-toggling-aria-expanded',
				config: {
					plugins: 'autocomplete,wysiwygarea'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable(),
					attributeName = 'aria-expanded';

				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				bot.setHtmlWithSelection( '' );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );

				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ESC } ) );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );
			} );
		},

		// (#4617)
		'test opening and closing autocomplete changes the value of [aria-activedescendant] attribute': function() {
			var editor = this.editor,
				editable = editor.editable(),
				attributeName = ARIA_ACTIVEDESCENDANT,
				selectedItem,
				selectedItemId;

			autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

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
		},

		// (#4617)
		'test opening and closing autocomplete does not add or change the value of [aria-activedescendant] attribute for iframe-based editor': function() {
			bender.editorBot.create( {
				name: 'wysiwygarea-toggling-' + ARIA_ACTIVEDESCENDANT,
				config: {
					plugins: 'autocomplete,wysiwygarea'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable(),
					attributeName = ARIA_ACTIVEDESCENDANT;

				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				bot.setHtmlWithSelection( '' );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );

				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ESC } ) );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );
			} );
		},

		// (#4617)
		'test pressing Arrow Up key triggers [aria-activedescendant] attribute update to the selected item': function() {
			var editor = this.editor,
				editable = editor.editable(),
				attributeName = ARIA_ACTIVEDESCENDANT,
				selectedItem,
				selectedItemId;

			autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

			this.editorBot.setHtmlWithSelection( '' );

			assert.areSame( '', editable.getAttribute( attributeName ),
				'Wrong initial value for [' + attributeName + '] attribute' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ARROW_UP } ) );

			selectedItem = autoComplete.view.getItemById( autoComplete.view.selectedItemId );
			selectedItemId = selectedItem.getAttribute( 'id' );

			assert.areSame( selectedItemId, editable.getAttribute( attributeName ),
				'Wrong value for [' + attributeName + '] attribute after opening autocomplete' );
		},

		// (#4617)
		'test pressing Arrow Up key does not add or change the value of [aria-activedescendant] attribute in the iframe-based editor': function() {
			bender.editorBot.create( {
				name: 'wysiwygarea-arrow-up-' + ARIA_ACTIVEDESCENDANT,
				config: {
					plugins: 'autocomplete,wysiwygarea'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable(),
					attributeName = ARIA_ACTIVEDESCENDANT;

				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				bot.setHtmlWithSelection( '' );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ARROW_UP } ) );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );
			} );
		},

		// (#4617)
		'test pressing Arrow Down key triggers [aria-activedescendant] attribute update to the selected item': function() {
			var editor = this.editor,
				editable = editor.editable(),
				attributeName = ARIA_ACTIVEDESCENDANT,
				selectedItem,
				selectedItemId;

			autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

			this.editorBot.setHtmlWithSelection( '' );

			assert.areSame( '', editable.getAttribute( attributeName ),
				'Wrong initial value for [' + attributeName + '] attribute' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ARROW_DOWN } ) );

			selectedItem = autoComplete.view.getItemById( autoComplete.view.selectedItemId );
			selectedItemId = selectedItem.getAttribute( 'id' );

			assert.areSame( selectedItemId, editable.getAttribute( attributeName ),
				'Wrong value for [' + attributeName + '] attribute after opening autocomplete' );
		},

		// (#4617)
		'test pressing Arrow Down key does not add or change the value of [aria-activedescendant] attribute in the iframe-based editor': function() {
			bender.editorBot.create( {
				name: 'wysiwygarea-arrow-down-' + ARIA_ACTIVEDESCENDANT,
				config: {
					plugins: 'autocomplete,wysiwygarea'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable(),
					attributeName = ARIA_ACTIVEDESCENDANT;

				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				bot.setHtmlWithSelection( '' );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ARROW_DOWN } ) );

				assert.isFalse( editable.hasAttribute( attributeName ),
					'The [' + attributeName + '] attribute is present' );
			} );
		},

		// (#4617)
		'test mouseover triggers [aria-activedescendant] attribute update to the selected item': function() {
			var editor = this.editor,
				editable = editor.editable(),
				target,
				targetId;

			autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

			this.editorBot.setHtmlWithSelection( '' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			target = autoComplete.view.element.getLast();
			targetId = target.getAttribute( 'id' );

			autoComplete.view.element.fire( 'mouseover', new CKEDITOR.dom.event( { target: target.$ } ) );

			assert.areSame( targetId, editable.getAttribute( ARIA_ACTIVEDESCENDANT ),
				'Wrong value for [' + ARIA_ACTIVEDESCENDANT + '] attribute' );
		},

		// (#4617)
		'test mouseover does not add or update the value of [aria-activedescendant] attribute in the iframe-based editor': function() {
			bender.editorBot.create( {
				name: 'wysiwygarea-mouseover',
				config: {
					plugins: 'autocomplete,wysiwygarea'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable(),
					target;

				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				bot.setHtmlWithSelection( '' );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				target = autoComplete.view.element.getLast();

				autoComplete.view.element.fire( 'mouseover', new CKEDITOR.dom.event( { target: target.$ } ) );

				assert.isFalse( editable.hasAttribute( ARIA_ACTIVEDESCENDANT ),
					'The [' + ARIA_ACTIVEDESCENDANT + '] attribute is present' );
			} );
		},

		// (#4617)
		'test destroying autocomplete removes unnecessary ARIA attributes': function() {
			var editor = this.editor,
				editable = editor.editable(),
				autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

			autoComplete.destroy();
			autoComplete = null;

			assert.areSame( 'none', editable.getAttribute( 'aria-autocomplete' ),
				'The [aria-autocomplete] attribute is not set to none' );
			assert.isFalse( editable.hasAttribute( 'aria-expanded' ), 'The [aria-expanded] attribute is present' );
			assert.isFalse( editable.hasAttribute( 'aria-controls' ), 'The [aria-controls] attribute is present' );
			assert.isFalse( editable.hasAttribute( ARIA_ACTIVEDESCENDANT ),
				'The [' + ARIA_ACTIVEDESCENDANT + '] attribute is present' );
		},

		// (#4617)
		'test destroying autocomplete does not add additional [aria-autocomplete] attribute for iframe-based editor': function() {
			bender.editorBot.create( {
				name: 'wysiwygarea-destroy',
				config: {
					plugins: 'autocomplete,wysiwygarea'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable(),
					autoComplete = new CKEDITOR.plugins.autocomplete( editor, autoCompleteConfig );

				autoComplete.destroy();
				autoComplete = null;

				assert.isFalse( editable.hasAttribute( 'aria-autocomplete' ),
					'The [aria-autocomplete] attribute is present' );
				assert.isFalse( editable.hasAttribute( 'aria-expanded' ), 'The [aria-expanded] attribute is present' );
				assert.isFalse( editable.hasAttribute( 'aria-controls' ), 'The [aria-controls] attribute is present' );
				assert.isFalse( editable.hasAttribute( ARIA_ACTIVEDESCENDANT ),
					'The [' + ARIA_ACTIVEDESCENDANT + '] attribute is present' );
			} );
		}
	} );

	function textTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function dataCallback( matchInfo, callback ) {
		return callback( [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' }, { id: 3, name: 'item3' } ] );
	}
} )();
