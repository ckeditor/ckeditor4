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
		}
	} );
} )();
