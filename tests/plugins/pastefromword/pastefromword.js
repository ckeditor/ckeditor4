/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: ../clipboard/_helpers/pasting.js */

/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editors = {
		inline: {
			creator: 'inline',
			name: 'inline'
		},

		indulgent: {
			name: 'indulgent',
			config: {
				pasteFromWordRemoveFontStyles: false,
				pasteFromWordRemoveStyles: false
			}
		}
	};

	bender.test( {
		spies: [],

		tearDown: function() {
			var spy;

			while ( spy = this.spies.pop() ) {
				spy.restore();
			}
		},

		'test whether default filter is loaded': function() {
			var editor = this.editors.inline;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( '<p>text <strong>text</strong></p>', evt.data.dataValue, 'Basic filter was applied' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<p>text <strong class="MsoNormal">text</strong></p>',
				method: 'paste'
			} );

			wait();
		},

		'test whether paste from word disabled the paste filter': function() {
			var editor = this.editors.indulgent,
				originalFilter = editor.pasteFilter;

			this.spies.push( {
				restore: function() {
					editor.pasteFilter = originalFilter;
				}
			} );

			// Plug some custom paste filter so on non Webkit/Blink browsers there is some.
			editor.pasteFilter = new CKEDITOR.filter( 'p strong' );

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.isTrue( evt.data.dontFilter, 'data.dontFilter' );

					assert.areSame( '<h1>text</h1><p>text <strong>text</strong></p>',
						evt.data.dataValue, 'paste filter was not applied' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<h1>text</h1><p>text <strong class="MsoNormal">text</strong></p>',
				method: 'paste',
				dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer()
			} );

			wait();
		},

		'test paste data structure': function() {
			if ( CKEDITOR.env.ie )
				assert.ignore();

			var editor = this.editors.inline,
				editable = editor.editable();

			CKEDITOR.env.ie && editable.once( 'beforepaste', function( evt ) {
				evt.cancel();
				return false;
			}, null, null, 1001 );

			editor.once( 'paste', function( evt ) {
				evt.cancel();

				resume( function() {
					assert.areSame( 'foo', evt.data.dataValue, 'dataValue' );
					assert.areSame( 'paste', evt.data.method, 'method' );
					assert.isInstanceOf( CKEDITOR.plugins.clipboard.dataTransfer, evt.data.dataTransfer, 'dataTransfer' );
				} );
			} );

			editor.once( 'dialogShow', function() {
				var dialog = editor._.storedDialogs.paste,
					frameDoc = dialog.getContentElement( 'general', 'editing_area' )
						.getInputElement().getFrameDocument();

				frameDoc.getBody().setHtml( 'foo' );

				dialog.fire( 'ok' );
				dialog.hide();
			} );

			setTimeout( function() {
				editor.execCommand( 'pastefromword' );
			} );
			this.wait();
		},

		'test showNotification in case of exception': function() {
			var editor = this.editors.inline;

			editor.once( 'beforeCleanWord', function( evt ) {
				evt.data.filter.addRules( {
					elements: {
						'^': function() {
							throw 'foo';
						}
					}
				} );
			} );

			this.spies.push( sinon.stub( editor, 'showNotification', function() {
				resume( function() {
					assert.isTrue( true );
				} );
			} ) );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<p>text <strong class="MsoNormal">text</strong></p>',
				method: 'paste'
			} );

			wait();
		},

		'test keep custom class': function() {
			bender.editorBot.create( {
				name: 'keep_custom_class',
				config: {
					coreStyles_bold: {
						element: 'span',
						attributes: { 'class': 'customboldclass' },
						overrides: [ 'strong', 'b' ]
					},
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.once( 'paste', function( evt ) {
					var dataValue = evt.data.dataValue;
					resume( function() {
						assert.areSame( '<p>Foo <span class="customboldclass">bar</span> bom</p>', dataValue );
					} );
				}, null, null, 5 ); // Test PFW only.

				editor.fire( 'paste', {
					type: 'auto',
					dataValue: '<p style="margin: 0cm 0cm 8pt;"><font face="Calibri">Foo <b style="mso-bidi-font-weight: normal;">bar</b> bom</font></p>'
				} );

				wait();
			} );
		},

		// #11976 - lists look differently when HTML is taken directly from the clipboard instead of pastebin.
		'test paste list on Webkit, Blink and Gecko': function() {
			if ( !( CKEDITOR.env.webkit || CKEDITOR.env.gecko ) ) {
				assert.ignore();
			}

			var editor = this.editors.inline;

			assertPasteEvent( editor,
				{ dataValue: CKEDITOR.document.getById( 'pastedHtmlList1' ).getValue() },
				function( data ) {
					assert.isInnerHtmlMatching( '<ul><li>item1</li><li>item2</li><li>item3</li></ul>', data.dataValue );
				},
				null, true
			);
		},

		// #11376 - test pasting a list with a Word 2010 / IE11 output.
		'test paste list on Word 2010 + IE': function() {
			if ( !CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var editor = this.editors.inline;

			assertPasteEvent( editor,
				{ dataValue: CKEDITOR.document.getById( 'pastedHtmlList2' ).getValue() },
				function( data ) {
					assert.isInnerHtmlMatching( '<ul><li><strong>hello</strong></li><li><strong>world</strong></li><li><strong>abc</strong></li></ul>', data.dataValue );
				},
				null, true
			);
		}
	} );
} )();
