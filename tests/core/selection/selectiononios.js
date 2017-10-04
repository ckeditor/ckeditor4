/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea, basicstyles, toolbar, floatingspace, colorbutton, image2, link, colordialog, justify */

( function() {
	'use strict';

	if ( !CKEDITOR.env.iOS ) {
		bender.ignore();
		return;
	}

	function onDialogShow( editor, pageId, elementId, value ) {
		editor.on( 'dialogShow', function( evt ) {
			setTimeout( function() {
				var dialog = evt.data;
				dialog.setValueOf( pageId, elementId, value );
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
		// #948
		'test loosing selection': function() {
			bender.editorBot.create( {
				name: 'editor1',
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
		},

		'test selection on double blur': function() {
			bender.editorBot.create( {
				name: 'editor2',
				creator: 'inline'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					frame;

				editor.on( 'dialogHide', function() {
					assert.areEqual( '<p>Lore<span style="color:#ff3333">m ips</span>um</p>', editor.getData() );
				} );

				onDialogShow( editor, 'picker', 'selectedColor', '#ff3333' );
				bender.tools.selection.setWithHtml( editor, '<p>Lore{m ips}um</p>' );

				txtColorBtn.click( editor );
				openColorDialog( frame );
			} );
		},

		'test selection on text': function() {
			bender.editorBot.create( {
				name: 'editor3',
				creator: 'inline'
			}, function( bot ) {
				var editor = bot.editor,
				linkButton = editor.ui.get( 'Link' ),
				unlinkButton = editor.ui.get( 'Unlink' );

				editor.on( 'dialogHide', function() {
					assert.areEqual( '<p><a href="http://foo.com">Lorem</a> ipsum</p>', editor.getData() );

					unlinkButton.click( editor );
					assert.areEqual( '<p>Lorem ipsum</p>', editor.getData() );
				} );

				onDialogShow( editor, 'info', 'url', 'foo.com' );
				bender.tools.selection.setWithHtml( editor, '<p>{Lorem} ipsum</p>' );

				linkButton.click( editor );
				wait();
			} );
		},

		'test selection on image2': function() {
			bender.editorBot.create( {
				name: 'editor4',
				creator: 'inline',
				extraPlugins: 'image2',
				config: {
					extraAllowedContent: 'figure a[id]'
				}
			}, function( bot ) {
				var editor = bot.editor,
					linkButton = editor.ui.get( 'Link' );

				editor.on( 'dialogHide', function() {
					assert.areEqual(
						'<figure id="image" class="image"><a href="http://foo.com"><img alt="" src="../../_assets/lena.jpg" /></a><figcaption><a href="http://foo.com">Caption</a></figcaption></figure>',
						editor.getData()
					);
				} );

				linkButton.click( editor );
				onDialogShow( editor, 'info', 'url', 'foo.com' );

				bender.tools.selection.setWithHtml( editor, '[<figure id="image" class="image"><img alt="" src="../../_assets/lena.jpg" /><figcaption>Caption</figcaption></figure>]' );
				wait();
			} );
		}
	} );
} )();
