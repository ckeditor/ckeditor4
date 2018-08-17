/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: codesnippet,undo,toolbar */

( function() {
	'use strict';

	var objToArray = bender.tools.objToArray,
		highlighter;

	bender.editors = {
		asyncHighlighter: {
			name: 'asyncHighlighter',
			config: {
				on: {
					pluginsLoaded: function() {
						highlighter = new CKEDITOR.plugins.codesnippet.highlighter( {
							init: function( ready ) {
								ready();
							},
							languages: {
								php: 'PHP',
								javascript: 'JS'
							}
						} );

						this.plugins.codesnippet.setHighlighter( highlighter );
					}
				}
			}
		}
	};

	bender.test( {
		'test undo snapshot while highlighting (async)': function() {
			var bot = this.editorBots.asyncHighlighter,
				editor = bot.editor;

			bot.setHtmlWithSelection( '<p>foo^</p>' );
			editor.resetUndo();

			highlighter.highlighter = function( code, language, callback ) {
				setTimeout( function() {
					resume( function() {
						callback( '<span style="color:red">' + code + '</span>' );
						editor.fire( 'saveSnapshot' );

						editor.execCommand( 'undo' );
						assert.areSame( '<p>foo</p>', editor.getData(), 'Undo does not record highlighting step' );
					} );
				}, 50 );
			};

			editor.insertHtml( '<pre><code class="language-php">php</code></pre>' );
			assert.areSame( 1, objToArray( editor.widgets.instances ).length, 'A single widget instance created' );

			wait();
		},

		'test undo after editing sinppet with dialog and synchronous highlighter': function() {
			var bot = this.editorBots.asyncHighlighter,
				editor = bot.editor;

			highlighter.highlighter = function( code, language, callback ) {
				callback( '<span style="color:red">' + code + '</span>' );
			};

			bot.setData( '<pre><code class="language-php">php</code></pre>', function() {
				editor.resetUndo();

				var widget = objToArray( editor.widgets.instances )[ 0 ];

				widget.focus();

				bot.dialog( 'codeSnippet', function( dialog ) {
					dialog.setValueOf( 'info', 'code', 'js' );
					dialog.setValueOf( 'info', 'lang', 'javascript' );
					dialog.getButton( 'ok' ).click();

					assert.areSame( '<pre><code class="language-javascript">js</code></pre>',
						editor.getData(), 'Snippet updated with dialog' );

					editor.execCommand( 'undo' );

					assert.areSame( '<pre><code class="language-php">php</code></pre>',
						editor.getData(), 'Changes were undone' );

					editor.execCommand( 'redo' );

					assert.areSame( '<pre><code class="language-javascript">js</code></pre>',
						editor.getData(), 'Changes were redone' );
				} );
			} );
		},

		'test undo after editing sinppet with dialog and asynchronous highlighter': function() {
			var bot = this.editorBots.asyncHighlighter,
				editor = bot.editor;

			highlighter.highlighter = function( code, language, callback ) {
				setTimeout( function() {
					callback( '<span style="color:red">' + code + '</span>' );
				}, 10 );
			};

			bot.setData( '<pre><code class="language-php">php</code></pre>', function() {
				editor.resetUndo();

				var widget = objToArray( editor.widgets.instances )[ 0 ];

				widget.focus();

				bot.dialog( 'codeSnippet', function( dialog ) {
					dialog.setValueOf( 'info', 'code', 'js' );
					dialog.setValueOf( 'info', 'lang', 'javascript' );
					dialog.getButton( 'ok' ).click();

					wait( function() {
						assert.areSame( '<pre><code class="language-javascript">js</code></pre>',
							editor.getData(), 'Snippet updated with dialog' );

						editor.execCommand( 'undo' );

						wait( function() {
							assert.areSame( '<pre><code class="language-php">php</code></pre>',
								editor.getData(), 'Changes were undone' );

							editor.execCommand( 'redo' );

							wait( function() {
								assert.areSame( '<pre><code class="language-javascript">js</code></pre>',
									editor.getData(), 'Changes were redone' );
							}, 50 );
						}, 50 );
					}, 50 );
				} );
			} );
		}
	} );
} )();
