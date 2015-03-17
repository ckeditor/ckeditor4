/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: mathjax,dialog,toolbar,preview,clipboard,basicstyles,sourcearea */
/* global widgetTestsTools */

( function() {
	'use strict';

	CKEDITOR.disableAutoInline = true;

	var mathJaxLib = CKEDITOR.config.mathJaxLib = bender.config.mathJaxLibPath;

	if ( !mathJaxLib ) {
		throw new Error( 'bender.config.mathJaxLibPath should be defined with the path to MathJax lib (MathJax.js?config=TeX-AMS_HTML).' );
	}

	bender.editors = {
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
	};

	var tools = widgetTestsTools,
		tcs = {
			init: function() {
				// frameWrapper mock
				CKEDITOR.plugins.mathjax.frameWrapper = function() {
					return {
						setValue: function() {}
					};
				};
			},

			'test dialog trim MathJax tags': function() {
				var editor = this.editors.classic;

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
				var editor = this.editors.integration_with_preview_plugin;

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
				var editor = this.editors.with_iframe;

				editor.on( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 2, editor.document.getElementsByTag( 'iframe' ).count(), 'There should be two iFrames.' );
					} );
				} );

				editor.focus();
				bender.tools.emulatePaste( editor, editor.document.getElementsByTag( 'p' ).getItem( 0 ).$.innerHTML );

				wait();
			},

			'test not a widget': function() {
				var editor = this.editors.only_one_widget;

				assert.areSame( 1, editor.document.getElementsByTag( 'iframe' ).count(), 'There should be only one widget.' );
			},

			// #11777
			'test &amp; encoding': function() {
				var editor = this.editors.classic,
					bot = this.editorBots.classic;

				// Create an empty mathjax widget and set the content later, in WYSIWYG mode.
				bot.setData( '<p><span class="math-tex">\\(\\)</span></p>', function() {
					var widget = tools.obj2Array( editor.widgets.instances )[ 0 ],
						data;

					widget.setData( 'math', '\\(&\\)' );

					data = editor.getData();

					// Check if it is not possible to create a text node with not encoded ampersand.
					assert.areSame( '<p><span class="math-tex">\\(&amp;\\)</span></p>', data );

					bot.setData( data, function() {
						assert.areSame( '<p><span class="math-tex">\\(&amp;\\)</span></p>', editor.getData(), '& should not change after loading data.' );

						widget = tools.obj2Array( editor.widgets.instances )[ 0 ];
						assert.areSame( '\\(&\\)', widget.data.math, 'data.math was loaded correctly' );
					} );
				} );
			},

			// #11777
			'test &amp;amp; encoding': function() {
				var editor = this.editors.classic,
					bot = this.editorBots.classic;

				// Create an empty mathjax widget and set the content later, in WYSIWYG mode.
				bot.setData( '<p><span class="math-tex">\\(\\)</span></p>', function() {
					var widget = tools.obj2Array( editor.widgets.instances )[ 0 ],
						data;

					widget.setData( 'math', '\\(&amp;\\)' );

					data = editor.getData();

					assert.areSame( '<p><span class="math-tex">\\(&amp;amp;\\)</span></p>', data, '&amp; should be encoded properly.' );

					bot.setData( data, function() {
						assert.areSame( '<p><span class="math-tex">\\(&amp;amp;\\)</span></p>', editor.getData(), '&amp; should not change after loading data.' );

						widget = tools.obj2Array( editor.widgets.instances )[ 0 ];
						assert.areSame( '\\(&amp;\\)', widget.data.math, 'data.math was loaded correctly' );
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

	bender.test( tcs );
} )();