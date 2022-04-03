/* bender-tags: editor */

( function() {
	'use strict';

	CKEDITOR.disableAutoInline = true;
	CKEDITOR.config.plugins = 'basicstyles,toolbar';

	var ARIA_ATTRIBUTE = 'aria-readonly';

	bender.editors = {
		framed: {
			name: 'framed'
		},
		framedStartReadOnly: {
			name: 'framedStartReadOnly',
			config: {
				readOnly: true
			}
		},

		inline: {
			name: 'inline',
			creator: 'inline'
		},
		inlineStartReadOnly: {
			name: 'inlineStartReadOnly',
			creator: 'inline',
			config: {
				readOnly: true
			}
		},
		inlineNoCE: {
			name: 'inlineNoCE',
			creator: 'inline'
		},

		divarea: {
			name: 'divarea',
			config: {
				extraPlugins: 'divarea'
			}
		},

		divareaStartReadOnly: {
			name: 'divareaStartReadOnly',
			config: {
				extraPlugins: 'divarea',
				readOnly: true
			}
		}
	};

	function keyTester( editor ) {
		var keystrokeHandler = editor.keystrokeHandler,
			blockedKeys = keystrokeHandler.blockedKeystrokes,
			numAssert = 1;

		return {
			assertKeyBlocked: function( key, expected, msg ) {
				assert.areSame(
					blockedKeys[ key ],
					expected,
					msg || '(' + numAssert++ + ') ' + key + ' key is' + ( expected ? '' : 'n\'t' ) + ' blocked' );
			}
		};
	}

	bender.test( {
		'init': function() {
			var name;

			for ( name in bender.editors ) {
				bender.editors[ name ].dataProcessor.writer.sortAttributes = true;
			}
		},

		// These tests need to be first as other ones modifies the read-only state of editors.
		// (#1904)
		'test startup aria-readonly value (framed)': createAriaReadonlyInitialTest( 'framed', 'false' ),

		// (#1904)
		'test startup aria-readonly value (framedStartReadOnly)': createAriaReadonlyInitialTest( 'framedStartReadOnly', 'true' ),

		// (#1904)
		'test startup aria-readonly value (divarea)': createAriaReadonlyInitialTest( 'divarea', 'false' ),

		// (#1904)
		'test startup aria-readonly value (divareaStartReadOnly)': createAriaReadonlyInitialTest( 'divareaStartReadOnly', 'true' ),

		// (#1904)
		'test startup aria-readonly value (inline)': createAriaReadonlyInitialTest( 'inline', 'false' ),

		// (#1904)
		'test startup aria-readonly value (inlineNoCE)': createAriaReadonlyInitialTest( 'inlineNoCE', 'true' ),

		// (#1904)
		'test startup aria-readonly value (inlineStartReadOnly)': createAriaReadonlyInitialTest( 'inlineStartReadOnly', 'true' ),

		'test BACKSPACE in read-only mode: framed': function() {
			var editor = this.editors.framed,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 0 );

			editor.setReadOnly( true );
			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: framed config.readOnly=true': function() {
			var editor = this.editors.framedStartReadOnly,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: inline': function() {
			var editor = this.editors.inline,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 0 );

			editor.setReadOnly( true );
			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: inline config.readOnly=true': function() {
			var editor = this.editors.inlineStartReadOnly,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: inline no contenteditable attribute': function() {
			var editor = this.editors.inlineNoCE,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: divarea': function() {
			var editor = this.editors.divarea,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 0 );

			editor.setReadOnly( true );
			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		// (#1904)
		'test updating aria-readonly attribute (framed)': createAriaReadonlySwitchingTest( 'framed' ),

		// (#1904)
		'test updating aria-readonly attribute (divarea)': createAriaReadonlySwitchingTest( 'divarea' ),

		// (#1904)
		'test updating aria-readonly attribute (inline)': createAriaReadonlySwitchingTest( 'inline' )
	} );

	function createAriaReadonlyInitialTest( editorName, expectedValue ) {
		return function() {
			var editor = bender.editors[ editorName ],
				editable = editor.editable();

			assert.areSame( expectedValue, editable.getAttribute( ARIA_ATTRIBUTE ) );
		};
	}

	function createAriaReadonlySwitchingTest( editorName ) {
		return function() {
			var editor = bender.editors[ editorName ],
				editable = editor.editable(),
				attributeAfterSettingReadOnly;

			assert.areSame( 'false', editable.getAttribute( ARIA_ATTRIBUTE ), 'aria-readonly for writable editor' );

			editor.setReadOnly( true );
			attributeAfterSettingReadOnly = editable.getAttribute( ARIA_ATTRIBUTE );
			editor.setReadOnly( false );

			assert.areSame( 'true', attributeAfterSettingReadOnly, 'aria-readonly for readonly editor' );
		};
	}
} )();
