/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: mathjax,dialog,toolbar,preview,clipboard,basicstyles,undo,wysiwygarea */

( function() {
	'use strict';

	CKEDITOR.disableAutoInline = true;

	var mathJaxLib = bender.config.mathJaxLibPath;

	if ( !mathJaxLib ) {
		throw new Error( 'bender.config.mathJaxLibPath should be defined with the path to MathJax lib (MathJax.js?config=TeX-AMS_HTML).' );
	}

	var editor;

	function assertIFrame( iFrame ) {
		var doc = iFrame.getFrameDocument();

		assert.areSame( '1 + 1 = 2', bender.tools.compatHtml( doc.getById( 'preview' ).getElementsByTag( 'script' ).$[ 0 ].innerHTML ),
			'MathJax should create script element containing equation in preview.' );
		assert.areSame( '1 + 1 = 2', bender.tools.compatHtml( doc.getById( 'buffer' ).getElementsByTag( 'script' ).$[ 0 ].innerHTML ),
			'MathJax should create script element containing equation in buffer.' );

		assert.isTrue( parseInt( iFrame.getStyle( 'width' ), 10 ) > 0, 'Width of iFrame should be grater that 0.' );
		assert.isTrue( parseInt( iFrame.getStyle( 'height' ), 10 ) > 0, 'Height of iFrame should be grater that 0.' );
	}

	bender.test( {
		checkMathJax: function( config ) {
			var iFrame = editor.document.getElementsByTag( 'iframe' ).getItem( 0 );

			editor.focus();

			if ( config.when )
				config.when( iFrame, editor );

			// iFrame can change, so it must be reloaded.
			iFrame = editor.document.getElementsByTag( 'iframe' ).getItem( 0 );

			CKEDITOR.once( 'mathJaxUpdateDone', function() {
				resume( function() {
					assertIFrame( iFrame );

					if ( config.then )
						config.then( iFrame, editor );
				} );
			} );

			wait();
		},

		'async:init': function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}

			var tc = this;

			editor = new CKEDITOR.replace( 'editor_mathjax', {
				mathJaxLib: mathJaxLib,
				extraAllowedContent: 'p{font-size}',
				extraPlugins: 'font',
				on: {
					instanceReady: function() {
						editor.setData( '<p>A<span class="math-tex">\\(1 + 1 = 2\\)</span>B</p>' );
					}
				}
			} );

			CKEDITOR.once( 'mathJaxUpdateDone', function() {
				tc.callback();
			} );
		},

		'test copy style when element is created': function() {
			editor.focus();

			CKEDITOR.once( 'mathJaxUpdateDone', function() {
				resume( function() {
					var iFrame = editor.document.getElementsByTag( 'iframe' ).getItem( 0 );
					assertIFrame( iFrame );
					assert.areSame( '10px', iFrame.getFrameDocument().getById( 'preview' ).getComputedStyle( 'font-size' ) );
				} );
			} );

			editor.setData( '<p style="font-size:10px">A<span class="math-tex">\\(1 + 1 = 2\\)</span>B</p>' );

			wait();
		},

		'test copy style when outer text format changed': function() {
			this.checkMathJax( {
				when: function( iFrame, editor ) {
					editor.getSelection().selectElement( editor.document.getElementsByTag( 'p' ).getItem( 0 ) );

					editor.applyStyle( new CKEDITOR.style( {
						element: 'span',
						attributes: { 'style': 'font-size: 20px;' }
					} ) );
				},
				then: function( iFrame ) {
					assert.areSame( '20px', floor( iFrame.getFrameDocument().getById( 'preview' ).getComputedStyle( 'font-size' ) ) );
				}
			} );
		},

		'test double bold command': function() {
			this.checkMathJax( {
				when: function( iFrame, editor ) {
					editor.getSelection().selectElement( editor.document.getElementsByTag( 'p' ).getItem( 0 ) );

					editor.execCommand( 'bold' );
					editor.execCommand( 'bold' );
				},
				then: function( iFrame, editor ) {
					assert.areSame( 0, editor.document.getElementsByTag( 'strong' ).count() );
				}
			} );
		},

		'test undo': function() {
			var that = this;

			this.checkMathJax( {
				when: function( iFrame, editor ) {
					editor.getSelection().selectElement( editor.document.getElementsByTag( 'p' ).getItem( 0 ) );

					editor.execCommand( 'bold' );
				},
				then: function() {
					that.checkMathJax( {
						when: function( iFrame, editor ) {
							editor.execCommand( 'undo' );
						},
						then: function( iFrame, editor ) {
							assert.areSame( 0, editor.document.getElementsByTag( 'strong' ).count() );
						}
					} );
				}
			} );
		},

		'test paste': function() {
			var html = editor.editable().getHtml();

			CKEDITOR.once( 'mathJaxUpdateDone', function() {
				setTimeout( function() {
					resume( function() {
						var iFrame = editor.document.getElementsByTag( 'iframe' ).getItem( 0 );
						assertIFrame( iFrame );
					} );
				}, 1 );

			} );

			editor.setData( '', function() {
				editor.execCommand( 'paste', html );
			} );

			wait();
		},

		'test preview in dialog': function() {
			bender.editorBot.create( {
				name: 'editor_preview_in_dialog',
				config: {
					mathJaxLib: mathJaxLib
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.openDialog( 'mathjax', function( dialog ) {
					var widgetMock = { data: { math: '\\(1 + 1 = 2\\)' } };
					dialog.on( 'show', function() {
						dialog.setupContent( widgetMock );

						var previewDomId = dialog.getContentElement( 'info', 'preview' ).domId,
							iFrame = CKEDITOR.document.getById( previewDomId ).getElementsByTag( 'iframe' ).getItem( 0 );

						CKEDITOR.on( 'mathJaxUpdateDone', function() {
							resume( function() {
								assertIFrame( iFrame, '1 + 1 = 2' );
							} );
						} );
					} );
				} );
				wait();
			} );
		}
	} );

	function floor( value ) {
		return Math.floor( value.replace( 'px', '' ) ) + 'px';
	}
} )();