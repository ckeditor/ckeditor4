/* bender-tags: image,13351 */
/* bender-ckeditor-plugins: image,button,toolbar,link */
( function() {
	'use strict';

	bender.editor = {
		creator: 'inline',
		config: {
			removeDialogTabs: 'image:Link'
		}
	};

	var SRC = '%BASE_PATH%_assets/img.gif';
	var defaultExpectedOutput = ( '<p>x<a href="#"><img alt="" src="' + SRC + '" style="height:10px;width:10px;" /></a>x</p>' ).toLowerCase();

	function keepLinkTest( bot, htmlWithSelection, expectedOutput ) {
		bot.editor.focus();
		bender.tools.selection.setWithHtml( bot.editor, htmlWithSelection );
		bot.dialog( 'image', function( dialog ) {
			dialog.getContentElement( 'info', 'txtUrl' ).setValue( SRC );

			// Setting up txtHeight and txtWidth so the test will be unified across browsers
			// without them, all browsers except of IE8 have style attribute empty, but IE8 sets it anyway.
			dialog.getContentElement( 'info', 'txtWidth' ).setValue( 10 );
			dialog.getContentElement( 'info', 'txtHeight' ).setValue( 10 );

			dialog.getButton( 'ok' ).click();

			assert.areSame( expectedOutput, this.editorBot.getData( true ) );
		} );
	}

	bender.test( {
		// https://dev.ckeditor.com/ticket/13351.
		'keep link after editing (selected link)': function() {
			// IE8 isn't able to select link from outside.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			keepLinkTest( this.editorBot, '<p>x[<a href="#"><img alt="" src="' + SRC + '" /></a>]x</p>', defaultExpectedOutput );
		},

		// https://dev.ckeditor.com/ticket/13351.
		'keep link after editing (selected image)': function() {
			keepLinkTest( this.editorBot, '<p>x<a href="#">[<img alt="" src="' + SRC + '" />]</a>x</p>', defaultExpectedOutput );
		},

		// https://dev.ckeditor.com/ticket/13351.
		'keep link after editing (selected text, new image)': function() {
			keepLinkTest( this.editorBot, '<p>x<a href="#">[old content]</a>x</p>', defaultExpectedOutput );
		},

		// https://dev.ckeditor.com/ticket/13351.
		'keep link after editing (selected link, new image)': function() {
			// IE8 isn't able to select link from outside.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			keepLinkTest( this.editorBot, '<p>x[<a href="#">old content</a>]x</p>', defaultExpectedOutput );
		}
	} );
} )();
//]]>
