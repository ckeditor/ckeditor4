/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.test( {
		'test editor#ariaEditorHelpLabel event - handled': function() {
			var fired = 0;

			bender.editorBot.create( {
				name: 'editor1',
				creator: 'inline',
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
					describedBy = editor.editable().getAttribute( 'aria-describedby' );

				assert.areSame( 1, fired, 'event was fired once' );
				assert.isNotNull( describedBy, 'editable has aria-describedby attribute' );
				var label = editor.ui.space( 'top' ).findOne( '#' + describedBy );
				assert.isNotNull( label, 'label element exists within top space' );
				assert.areSame( 'foo', label.getHtml(), 'label\'s content' );
			} );
		},

		'test editor#ariaEditorHelpLabel event - unhandled': function() {
			var fired = 0;

			bender.editorBot.create( {
				name: 'editor2',
				creator: 'inline',
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
					describedBy = editor.editable().getAttribute( 'aria-describedby' );

				assert.areSame( 1, fired, 'event was fired once' );
				assert.isNull( describedBy, 'editable does not have has aria-describedby attribute' );
			} );
		},

		// (#1904)
		'test initial value of [aria-readonly] attribute (writable editor)': function() {
			bender.editorBot.create( {
				name: 'readonly-initial-writable',
				creator: 'inline'
			}, function( bot ) {
				var editor = bot.editor,
					readonlyAttr = editor.editable().getAttribute( 'aria-readonly' );

				assert.areSame( 'false', readonlyAttr, 'editable has appropriate value of [aria-readonly] attribute' );
			} );
		},

		// (#1904)
		'test initial value of [aria-readonly] attribute (readonly editor)': function() {
			bender.editorBot.create( {
				name: 'readonly-initial-readonly',
				creator: 'inline',
				config: {
					readOnly: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					readonlyAttr = editor.editable().getAttribute( 'aria-readonly' );

				assert.areSame( 'true', readonlyAttr, 'editable has appropriate value of [aria-readonly] attribute' );
			} );
		},

		// (#1904)
		'test update value of [aria-readonly] attribute': function() {
			bender.editorBot.create( {
				name: 'readonly-update',
				creator: 'inline',
				config: {
					readOnly: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					readonlyAttr;

				editor.setReadOnly( false );
				readonlyAttr = editor.editable().getAttribute( 'aria-readonly' );

				assert.areSame( 'false', readonlyAttr, 'editable has appropriate value of [aria-readonly] attribute' );
			} );
		}
	} );
} )();
