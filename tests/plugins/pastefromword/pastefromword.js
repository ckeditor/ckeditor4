/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		spies: [],

		tearDown: function() {
			var spy;

			while ( spy = this.spies.pop() ) {
				spy.restore();
			}
		},

		'test whether default filter is loaded': function() {
			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( '<p>text <strong>text</strong></p>', evt.data.dataValue, 'Basic filter was applied' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<p>text <strong class="MsoNormal">text</strong></p>',
				method: 'paste',
				dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer()
			} );

			wait();
		},

		'test paste data structure': function() {
			if ( CKEDITOR.env.ie )
				assert.ignore();

			var editor = this.editor,
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
			var editor = this.editor;

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
				method: 'paste',
				dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer()
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
		}
	} );

} )();