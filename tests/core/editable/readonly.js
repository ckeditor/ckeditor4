/* bender-tags: editor,unit */

( function() {
	'use strict';

	CKEDITOR.disableAutoInline = true;
	CKEDITOR.config.plugins = 'basicstyles,toolbar';

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
		}
	} );
} )();