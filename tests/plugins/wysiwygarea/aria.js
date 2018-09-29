/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.test( {
		'test editor#ariaEditorHelpLabel event - handled': function() {
			var fired = 0;

			bender.editorBot.create( {
				name: 'editor1',
				config: {
					removePlugins: 'a11yhelp',
					on: {
						pluginsLoaded: function() {
							this.on( 'ariaEditorHelpLabel', function( evt ) {
								evt.data.label = 'foo';
								fired += 1;
							} );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor,
					iframe = editor.window.getFrame(),
					describedBy = iframe.getAttribute( 'aria-describedby' );

				assert.areSame( 1, fired, 'event was fired once' );
				assert.isNotNull( describedBy, 'iframe has aria-describedby attribute' );
				var label = editor.ui.space( 'contents' ).findOne( '#' + describedBy );
				assert.isNotNull( label, 'label element exists within top space' );
				assert.areSame( 'foo', label.getHtml(), 'label\'s content' );
				if ( CKEDITOR.env.ie )
					assert.areSame( editor.title + ', foo', iframe.getAttribute( 'title' ), 'on IE title contains label' );
			} );
		},

		'test editor#ariaEditorHelpLabel event - not handled': function() {
			var fired = 0;

			bender.editorBot.create( {
				name: 'editor2',
				config: {
					removePlugins: 'a11yhelp',
					on: {
						pluginsLoaded: function() {
							this.on( 'ariaEditorHelpLabel', function() {
								fired += 1;
							} );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor,
					describedBy = editor.window.getFrame().getAttribute( 'aria-describedby' );

				assert.areSame( 1, fired, 'event was fired once' );
				assert.isNull( describedBy, 'iframe does not have aria-describedby attribute' );
			} );
		},

		// (#1904)
		'test editor role and [aria-multiline] attribute': function() {
			bender.editorBot.create( {
				name: 'role-textbox'
			}, function( bot ) {
				var editor = bot.editor,
					frame = editor.editable().getWindow().getFrame();

				assert.areSame( 'textbox', frame.getAttribute( 'role' ), 'editor frame has appropriate role' );
				assert.areSame( 'true', frame.getAttribute( 'aria-multiline' ),
					'editor frame has appropriate value of [aria-multiline] attribute' );
			} );
		},

		// (#1904)
		'test initial value of [aria-readonly] attribute (writable editor)': function() {
			bender.editorBot.create( {
				name: 'readonly-initial-writable'
			}, function( bot ) {
				var editor = bot.editor,
					readonlyAttr = editor.editable().getWindow().getFrame().getAttribute( 'aria-readonly' );

				assert.areSame( 'false', readonlyAttr, 'editor frame has appropriate value of [aria-readonly] attribute' );
			} );
		},

		// (#1904)
		'test initial value of [aria-readonly] attribute (readonly editor)': function() {
			bender.editorBot.create( {
				name: 'readonly-initial-readonly',
				config: {
					readOnly: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					readonlyAttr = editor.editable().getWindow().getFrame().getAttribute( 'aria-readonly' );

				assert.areSame( 'true', readonlyAttr, 'editor frame has appropriate value of [aria-readonly] attribute' );
			} );
		},

		// (#1904)
		'test update value of [aria-readonly] attribute': function() {
			bender.editorBot.create( {
				name: 'readonly-update',
				config: {
					readOnly: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					readonlyAttr;

				editor.setReadOnly( false );
				readonlyAttr = readonlyAttr = editor.editable().getWindow().getFrame().getAttribute( 'aria-readonly' );

				assert.areSame( 'false', readonlyAttr, 'editor frame has appropriate value of [aria-readonly] attribute' );
			} );
		}
	} );
} )();
