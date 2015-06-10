/* bender-tags: image,13351 */
/* bender-ckeditor-plugins: image,button,toolbar,link */
( function() {
	'use strict';

	bender.editor = {
		creator: 'inline',
		config: {
			autoParagraph: false,
			removeDialogTabs: 'image:Link'
		}
	};

	var SRC = '%BASE_PATH%_assets/img.gif';
	var defaultExpectedOutput = '<a href="#"><img alt="" src="' + SRC + '" style="height:10px;width:10px;" /></a>';

	function keepLinkTest( bot, htmlWithSelection, expectedOutput ) {
		bot.editor.focus();
		bot.setHtmlWithSelection( htmlWithSelection );
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
		// #13351.
		'keep link after editing (selected link)': function() {
			keepLinkTest( this.editorBot, '[<a href="#"><img alt="" src="' + SRC + '" /></a>]', defaultExpectedOutput );
		},

		// #13351.
		'keep link after editing (selected image)': function() {
			keepLinkTest( this.editorBot, '<a href="#">[<img alt="" src="' + SRC + '" />]</a>', defaultExpectedOutput );
		},

		// #13351.
		'keep link after editing (selected text, new image)': function() {
			keepLinkTest( this.editorBot, '<a href="#">[old content]</a>', defaultExpectedOutput );
		},

		// #13351.
		'keep link after editing (selected link, new image)': function() {
			keepLinkTest( this.editorBot, '[<a href="#">old content</a>]', defaultExpectedOutput );
		}
	} );
} )();
//]]>
