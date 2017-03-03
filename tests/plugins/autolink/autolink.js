'use strict';

/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: autolink,clipboard */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global assertPasteEvent */

bender.editor = {
	config: {
		allowedContent: true,
		pasteFilter: null
	}
};

bender.test( {
	'test normal link': function() {
		var pastedText = 'https://placekitten.com/g/180/300',
			expected = '<a href="' + pastedText + '">' + pastedText + '</a>';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: expected, type: 'html' } );
	},

	'test fake link': function() {
		var pastedText = 'https//placekitten.com/g/190/300';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	'test link with HTML tags': function() {
		var pastedTexts = [
			'https://<br>placekitten.com/g/200/301',
			'https://<br/>placekitten.com/g/200/302',
			'https://<br />placekitten.com/g/200/303',
			'https://place<b>kitten</b>.com/g/200/303'
		];

		var pastedText;

		while ( ( pastedText = pastedTexts.pop() ) ) {
			this.editor.once( 'paste', function( evt ) {
				evt.cancel();

				assert.areSame( -1, evt.data.dataValue.search( /<a / ), 'text was not auto linked: ' + pastedText );
			}, null, null, 900 );

			this.editor.execCommand( 'paste', pastedText );
		}
	},

	// #13419
	'test link with quotation marks': function() {
		var pastedText = 'https://foo.bar/?bam="bom"',
			expected = '<a href="https://foo.bar/?bam=%22bom%22">https://foo.bar/?bam="bom"</a>';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: expected, type: 'html' } );
	},

	'test link with text after': function() {
		var pastedText = 'https://placekitten.com/g/210/300 nope';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	'test link with text before': function() {
		var pastedText = 'nope https://placekitten.com/g/220/300';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	'test link with text attached before': function() {
		var pastedText = 'nopehttps://placekitten.com/g/230/300';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	'test various valid links': function() {
		var pastedTexts = [
			'https://placekitten.com/g/180/300',
			'http://giphy.com/gifs/space-nasa-test-GDiDCTh9AjbiM',
			'https://www.google.pl/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=ebay',
			'http://www.legia.sport.pl/legia/1,139320,18079195.html#MTstream',
			'http://a.b-c.de'
		];

		var pastedText;

		while ( ( pastedText = pastedTexts.pop() ) ) {
			this.editor.once( 'paste', function( evt ) {
				evt.cancel();

				assert.areSame( '<a href="' + pastedText + '">' + pastedText + '</a>', evt.data.dataValue );
			}, null, null, 900 );

			this.editor.execCommand( 'paste', pastedText );
		}
	},

	'test various invalid links': function() {
		var pastedTexts = [
			'https://placekitten.com/g/181/300.',
			'http://giphy.com?search',
			'https://www.google.pl,,,,',
			'http:///a'
		];

		var pastedText;

		while ( ( pastedText = pastedTexts.pop() ) ) {
			this.editor.once( 'paste', function( evt ) {
				evt.cancel();

				assert.areSame( pastedText, evt.data.dataValue );
			}, null, null, 900 );

			this.editor.execCommand( 'paste', pastedText );
		}
	},

	'test pasting multiple links': function() {
		var pastedText = 'http://en.wikipedia.org/wiki/Weasel http://en.wikipedia.org/wiki/Weasel';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	'test pasting whole paragraph': function() {
		var pastedText =
			'A multi-channel operating <a href="http://en.wikipedia.org/wiki/Strategy">strategy</a>' +
			'drives the enabler, while the enablers strategically embrace the game-changing, ' +
			'<a id="organic" href="http://en.wikipedia.org/wiki/Organic">organic</a> and cross-enterprise cultures.';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	'test content that is a link': function() {
		var pastedText = '<a href="http://en.wikipedia.org/wiki/Weasel">Weasel</a>';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	'test type is changed once a link is created': function() {
		var pastedText = 'https://placekitten.com/g/180/300',
			expected = '<a href="' + pastedText + '">' + pastedText + '</a>';

		assertPasteEvent( this.editor, { dataValue: pastedText, type: 'text' }, { dataValue: expected, type: 'html' } );
	},

	'test type is not changed if link was not found': function() {
		var pastedText = 'foo bar';

		assertPasteEvent( this.editor, { dataValue: pastedText, type: 'text' }, { dataValue: pastedText, type: 'text' } );
	},

	'test internal paste is not autolinked': function() {
		var	editor = this.editor,
			pastedText = 'https://foo.bar/g/185/310';

		this.editor.once( 'paste', function( evt ) {
			evt.data.dataTransfer.sourceEditor = editor;
		}, null, null, 1 );

		this.editor.once( 'paste', function( evt ) {
			evt.cancel();

			assert.areSame( pastedText, evt.data.dataValue );
		}, null, null, 900 );

		this.editor.execCommand( 'paste', pastedText );
	}
} );
