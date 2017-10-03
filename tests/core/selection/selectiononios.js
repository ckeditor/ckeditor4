/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea, basicstyles, toolbar, floatingspace, colorbutton, link, colordialog */

( function() {
	'use strict';

	if ( !CKEDITOR.env.iOS ) {
		bender.ignore();
		return;
	}

	function onDialogShow( editor ) {
		editor.on( 'dialogShow', function( evt ) {
			setTimeout( function() {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', '#ff3333' );
				dialog.getButton( 'ok' ).click();
				resume();
			}, 0 );
		} );
	}

	function openColorDialog( frame ) {
		setTimeout( function() {
			frame = document.querySelector( '.cke_panel_frame' );
			frame.contentDocument.querySelector( '.cke_colormore' ).click();
		}, 0 );

		wait();
	}

	bender.test( {
		'test changing text color': function() {
			bender.editorBot.create( {
				name: 'editor1',
				creator: 'inline'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					frame;

				editor.on( 'dialogHide', function() {
					assert.areEqual( '<p>Lore<span style="color:#ff3333">m ips</span>um</p>', editor.getData() );
				} );

				onDialogShow( editor );
				bender.tools.selection.setWithHtml( editor, '<p>Lore{m ips}um</p>' );

				txtColorBtn.click( editor );
				openColorDialog( frame );
			} );
		},

		'test loosing selection on iOS': function() {
			bender.editorBot.create( {
				name: 'editor2',
				creator: 'inline'
			}, function( bot ) {
				var editor = bot.editor,
					input = editor.document.getById( 'input' );

				bender.tools.selection.setWithHtml( editor, '<p>Lore{m ips}um</p>' );

				input.focus();
				assert.areEqual( 4, editor._.savedSelection.getRanges()[ 0 ].startOffset );
				assert.areEqual( 9, editor._.savedSelection.getRanges()[ 0 ].endOffset );

				editor.focus();
				assert.areEqual( 4, editor.getSelection().getRanges()[ 0 ].startOffset );
				assert.areEqual( 9, editor.getSelection().getRanges()[ 0 ].endOffset );
			} );
		}

		// TODO: test with link, test with fake selection
	} );
} )();
