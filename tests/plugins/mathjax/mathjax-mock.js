/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: mathjax,dialog,toolbar,preview,clipboard,basicstyles,sourcearea */

( function() {
	'use strict';

	CKEDITOR.disableAutoInline = true;

	var tools = widgetTestsTools,
		editors, bots,
		editorsDefinitions = {
			classic: {
				name: 'classic'
			},
			integration_with_preview_plugin: {
				name: 'integration_with_preview_plugin',
				config: {
					mathJaxLib: 'http://mathJaxLib-mock'
				}
			},
			with_iframe: {
				name: 'with_iframe',
				config: {
					extraPlugins: 'iframe'
				}
			},
			only_one_widget: {
				name: 'only_one_widget',
				config: {
					extraPlugins: 'iframe'
				}
			}
		},
		tcs = {
			'init': function() {
				// frameWrapper mock
				CKEDITOR.plugins.mathjax.frameWrapper = function( iFrame, editor ) {
					return {
						setValue: function( value ) {
						}
					};
				}
			},

			'test dialog trim MathJax tags': function() {
				var editor = editors[ 'classic' ];

				editor.openDialog( 'mathjax', function( dialog ) {
					var widgetMock = { data: { math: '	\\( X \\(1 + 1 = 2\\) Y \\) ' } };
					dialog.on( 'show', function() {
						dialog.setupContent( widgetMock );
						setTimeout( function() {
							resume( function() {
								assert.areSame( ' X \\(1 + 1 = 2\\) Y ', dialog.getValueOf( 'info', 'equation' ),
									'Dialog should leave sub string from first \\( to last \\).' );
								dialog.getButton( 'cancel' ).click();
							} );
						}, 50 );
					} );
				} );
				wait();
			},

			'test integration with preview plugin': function() {
				var editor = editors[ 'integration_with_preview_plugin' ];

				editor.once( 'contentPreview', function( evt ) {
					evt.cancel();
					resume( function() {
						assert.isTrue( !!evt.data.dataValue.match(
							new RegExp( '<script src="' + bender.tools.escapeRegExp( 'http://mathJaxLib-mock' ) + '([^"]+)?">' )
						) );
					} );
				} );

				editor.execCommand( 'preview' );

				wait();
			},

			'test conflict with iframe plugin': function() {
				var editor = editors[ 'with_iframe' ];

				editor.focus();
				bender.tools.emulatePaste( editor, editor.document.getElementsByTag( 'p' ).getItem( 0 ).$.innerHTML );

				assert.areSame( 2, editor.document.getElementsByTag( 'iframe' ).count(), 'There should be two iFrames.' );
			},

			'test not a widget': function() {
				var editor = editors[ 'only_one_widget' ];

				assert.areSame( 1, editor.document.getElementsByTag( 'iframe' ).count(), 'There should be only one widget.' );
			},

			// #11777
			'test &amp; encoding': function() {
				var editor = editors[ 'classic' ],
					bot = bots[ 'classic' ];

				// Create an empty mathjax widget and set the content later, in WYSIWYG mode.
				bot.setData( '<p><span class="math-tex">\\\(\\\)</span></p>', function() {
					var widget = tools.obj2Array( editor.widgets.instances )[ 0 ],
						data;

					widget.setData( 'math', '\\\(&\\\)' );

					data = editor.getData();

					// Check if it is not possible to create a text node with not encoded ampersand.
					assert.areSame( '<p><span class="math-tex">\\\(&amp;\\\)</span></p>', data );

					bot.setData( data, function() {
						assert.areSame( '<p><span class="math-tex">\\\(&amp;\\\)</span></p>', editor.getData(), '& should not change after loading data.' );

						widget = tools.obj2Array( editor.widgets.instances )[ 0 ];
						assert.areSame( '\\\(&\\\)', widget.data.math, 'data.math was loaded correctly' );
					} );
				} );
			},

			// #11777
			'test &amp;amp; encoding': function() {
				var editor = editors[ 'classic' ],
					bot = bots[ 'classic' ];

				// Create an empty mathjax widget and set the content later, in WYSIWYG mode.
				bot.setData( '<p><span class="math-tex">\\\(\\\)</span></p>', function() {
					var widget = tools.obj2Array( editor.widgets.instances )[ 0 ],
						data;

					widget.setData( 'math', '\\\(&amp;\\\)' );

					data = editor.getData();

					assert.areSame( '<p><span class="math-tex">\\\(&amp;amp;\\\)</span></p>', data, '&amp; should be encoded properly.' );

					bot.setData( data, function() {
						assert.areSame( '<p><span class="math-tex">\\\(&amp;amp;\\\)</span></p>', editor.getData(), '&amp; should not change after loading data.' );

						widget = tools.obj2Array( editor.widgets.instances )[ 0 ];
						assert.areSame( '\\\(&amp;\\\)', widget.data.math, 'data.math was loaded correctly' );
					} );
				} );
			}
		};

	tools.addTests( tcs, {
		name: 'default',
		widgetName: 'mathjax',
		extraPlugins: 'mathjax',
		extraAllowedContent: 'span{padding}',
		initialInstancesNumber: 2,
		dialog: 'mathjax',

		newData: [
			[ 'info', 'equation', '2 + 2 = 4' ]
		],
		newWidgetPattern: /<span class="math-tex">\\\(2 \+ 2 = 4\\\)<\/span>/,
		ignoreStyle: ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) ? true : false
	} );

	tools.addTests( tcs, {
		name: 'customClass',
		widgetName: 'mathjax',
		extraPlugins: 'mathjax',
		extraAllowedContent: 'span{padding}',
		editorConfig: {
			mathJaxClass: 'mjx'
		},

		initialInstancesNumber: 2,
		dialog: 'mathjax',

		newData: [
			[ 'info', 'equation', '2 + 2 = 4' ]
		],
		newWidgetPattern: /<span class="mjx">\\\(2 \+ 2 = 4\\\)<\/span>/,
		ignoreStyle: ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) ? true : false
	} );

	tools.addTests( tcs, {
		name: 'inline',
		creator: 'inline',
		widgetName: 'mathjax',
		extraPlugins: 'mathjax',
		extraAllowedContent: 'span{padding}',
		initialInstancesNumber: 2,
		dialog: 'mathjax',

		newData: [
			[ 'info', 'equation', '2 + 2 = 4' ]
		],
		newWidgetPattern: /<span class="math-tex">\\\(2 \+ 2 = 4\\\)<\/span>/,
		ignoreStyle: ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) ? true : false
	} );

	bender.tools.setUpEditors( editorsDefinitions, function( e, b ) {
		editors = e;
		bots = b;
		bender.test( tcs );
	} );

	function switchMode( editor, mode, callback ) {
		// Ensure async (that wait is called before resume).
		wait( function() {
			editor.setMode( mode, function() {
				resume( function() {
					assert.areSame( mode, editor.mode, 'incorrect mode' );
					callback();
				} );
			} );
		} );
	}
} )();