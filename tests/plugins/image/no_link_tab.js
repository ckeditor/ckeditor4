/* bender-tags: editor,unit,image */
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
		bot.setHtmlWithSelection( htmlWithSelection );
		bot.dialog( 'image', function( dialog ) {
			dialog.getContentElement( 'info', 'txtUrl' ).setValue( SRC );
			dialog.getContentElement( 'info', 'txtWidth' ).setValue( 10 );
			dialog.getContentElement( 'info', 'txtHeight' ).setValue( 10 );

			dialog.getButton( 'ok' ).click();

			assert.areSame( expectedOutput, this.editorBot.getData( true ) );
		} );
	}

	// tests fixes for bugs reported in #13351
	bender.test( {
		'keep link after editing (selected link)': function() {
			keepLinkTest( this.editorBot, '[<a href="#"><img alt="" src="' + SRC + '" /></a>]', defaultExpectedOutput );
		},

		'keep link after editing (selected image)': function() {
			keepLinkTest( this.editorBot, '<a href="#">[<img alt="" src="' + SRC + '" />]</a>', defaultExpectedOutput );
		},

		'keep link after editing (selected text, new image)': function() {
			keepLinkTest( this.editorBot, '<a href="#">[old content]</a>', defaultExpectedOutput );
		},

		'keep link after editing (selected link, new image)': function() {
			keepLinkTest( this.editorBot, '[<a href="#">old content</a>]', defaultExpectedOutput );
		}
	} );
} )();
//]]>
