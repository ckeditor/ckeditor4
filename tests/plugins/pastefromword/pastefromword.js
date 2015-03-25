/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
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
				dataValue: '<p>text <strong class="MsoNormal">text</strong></p>'
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