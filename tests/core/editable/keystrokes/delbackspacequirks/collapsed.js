/* bender-tags: editor */
/* bender-ckeditor-plugins: list,table,undo */
/* global quirksTools */

( function( t ) {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false
		}
	};

	// Import utilities from tools.
	var BACKSPACE = t.BACKSPACE,
		DEL = t.DEL,
		assertKeystroke = t.assertKeystroke,
		assertRemovingSpaces = t.assertRemovingSpaces,
		d = t.d,
		b = t.b,
		df = t.df,
		bf = t.bf;

	function ignoreIt() {
		assert.ignore();
	}

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.env.webkit )
				assert.ignore();
		},

		// --- MISC -----------------------------------------------------------

		// (#3819)
		'test backspace key use when carret between two visual spaces did not split content': assertRemovingSpaces( BACKSPACE, 6 ),

		// (#3819)
		'test delete key use when carret before two visual spaces did not split content': assertRemovingSpaces( DEL, 5 ),

		'test backspace records undo snapshots': function() {
			var editor = this.editor,
				tc = this;

			this.editorBot.setData( '', function() {
				editor.resetUndo();

				b( '<p>x</p><p>{}y</p>', '<p>x^y</p>' ).call( tc );

				editor.execCommand( 'undo' );
				assert.areSame( '<p>x</p><p>y</p>', editor.getData(), 'after 1st undo' );

				editor.execCommand( 'undo' );
				assert.areSame( '', editor.getData(), 'after 2nd undo' );
			} );
		},

		'test no snapsot when case not handled': function() {
			var editor = this.editor,
				tc = this;

			this.editorBot.setData( '', function() {
				editor.resetUndo();

				bf( '<p>x[y]z</p>' ).call( tc );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state );
			} );
		},

		'test backspace on two paragraphs in read-only mode': function() {
			this.editor.setReadOnly( true );

			try {
				bf( '<p>Test</p><p>{}Test</p>', '<p>Test</p><p>^Test</p>' ).call( this );
			} catch ( e ) {
				throw e;
			} finally {
				this.editor.setReadOnly( false );
			}
		},

		'test CTRL+backspace works as backspace when merging blocks':		assertKeystroke( BACKSPACE, CKEDITOR.CTRL, 0,	'<p>x</p><p>{}y</p>',	'<p>x^y</p>' ),
		'test SHIFT+backspace works as backspace when merging blocks':		assertKeystroke( BACKSPACE, CKEDITOR.SHIFT, 0,	'<p>x</p><p>{}y</p>',	'<p>x^y</p>' ),
		'test CTRL+delete works as delete when merging blocks':				assertKeystroke( DEL, CKEDITOR.CTRL, 0,			'<p>x{}</p><p>y</p>',	'<p>x^y</p>' ),
		'test SHIFT+delete works as delete when merging blocks':			assertKeystroke( DEL, CKEDITOR.SHIFT, 0,		'<p>x{}</p><p>y</p>',	'<p>x^y</p>' ),

		'test CTRL+backspace is not handled when not merging blocks':		assertKeystroke( BACKSPACE, CKEDITOR.CTRL, 1,	'<p>x{}y</p>',			'<p>x^y</p>' ),
		'test SHIFT+backspace is not handled when not merging blocks':		assertKeystroke( BACKSPACE, CKEDITOR.SHIFT, 1,	'<p>x{}y</p>',			'<p>x^y</p>' ),
		'test CTRL+delete is not handled when not merging blocks':			assertKeystroke( DEL, CKEDITOR.CTRL, 1,			'<p>x{}y</p>',			'<p>x^y</p>' ),
		'test SHIFT+delete is not handled when not merging blocks':			assertKeystroke( DEL, CKEDITOR.SHIFT, 1,		'<p>x{}y</p>',			'<p>x^y</p>' ),

		// --- BACKSPACE ------------------------------------------------------

		'test backspace #1':				b( '<p>x</p><p>[]y</p>',											'<p>x^y</p>' ),
		'test backspace #2': CKEDITOR.env.safari ? ignoreIt :
											b( '<p>x</p><p><strong>[]y</strong></p>',							[
																													'<p>x<strong>^y</strong></p>',
																													'<p>x^<strong>y</strong></p>' // For WebKit (https://dev.ckeditor.com/ticket/13709).
																												] ),
		'test backspace #3': CKEDITOR.env.safari ? ignoreIt :
											b( '<p>x</p><p><a href="z">[]y</a></p>',							[
																													'<p>x<a href="z">^y</a></p>',
																													'<p>x^<a href="z">y</a></p>' // For WebKit (https://dev.ckeditor.com/ticket/13709).
																												] ),
		'test backspace #4':				b( '<p>x</p><blockquote><p>[]y</p></blockquote>',					'<p>x^y</p>' ),
		'test backspace #5':				b( '<h1>x</h1><p>[]y</p>',											'<h1>x^y</h1>' ),
		'test backspace #6':				b( '<p>x</p><h1>[]y</h1>',											'<p>x^y</p>' ),
		'test backspace #7':				b( '<p>x</p><p>[]f<strong>o</strong>o</p>',							'<p>x^f<strong>o</strong>o</p>' ),
		'test backspace #8':				b( '<div><p>x</p></div><blockquote><p>[]y</p></blockquote>',		'<div><p>x^y</p></div>' ),

		'test backspace #9': CKEDITOR.env.safari ? ignoreIt :
											b( '<div><p><strong>f<em>oo</em></strong></p></div><blockquote><p><u>{}y</u></p></blockquote>',
																												[
																													'<div><p><strong>f<em>oo</em></strong><u>^y</u></p></div>',
																													'<div><p><strong>f<em>oo^</em></strong><u>y</u></p></div>' // For WebKit (https://dev.ckeditor.com/ticket/13709).
																												] ),
		'test backspace #10':				b( '<p>x</p><p>[]@</p>',											'<p>x^@!</p>' ),
		'test backspace #11':				b( '<ul><li><p>x</p><p>[]y</p></li></ul>',							'<ul><li><p>x^y</p></li></ul>' ),
		'test backspace #12':				b( '<table><tbody><tr><td><p>x</p><p>[]y</p></td></tr></tbody></table>',
																												'<table><tbody><tr><td><p>x^y</p></td></tr></tbody></table>' ),
		'test backspace #13':				b( '<aside><p>x</p></aside><section><p>[]y</p></section>',			'<aside><p>x^y</p></aside>' ),
		'test backspace #14':				b( '<aside><p>x</p></aside><section><p>[]y</p><p>z</p></section>',	'<aside><p>x^y</p></aside><section><p>z</p></section>' ),
		'test backspace #15':				b( '<p>a</p><hr /><p>[]y</p>',										'<p>a</p><p>^y</p>' ),
		'test backspace #16':				b( '<hr /><p>[]y</p>',												'<p>^y</p>' ),
		'test backspace #17':				b( '<p>a</p><hr id="h1" /><hr id="h2" /><p>[]y</p>',				'<p>a</p><hr id="h1" /><p>^y</p>' ),

		// Merge inline elements after keystroke.
		'test backspace, merge #1':		b( '<p><em>x</em></p><p><em>[]y</em></p>',							'<p><em>x^y</em></p>' ),

		'test backspace, merge #2': CKEDITOR.env.safari ? ignoreIt :
										b( '<p><em id="x">x</em></p><p><em id="y">[]y</em></p>',			[
																												'<p><em id="x">x</em><em id="y">^y</em></p>',
																												'<p><em id="x">x^</em><em id="y">y</em></p>' // For WebKit (https://dev.ckeditor.com/ticket/13709).
																											] ),
		'test backspace, merge #3': CKEDITOR.env.safari ? ignoreIt :
										b( '<p><a href="x">x</a></p><p><a href="y">[]y</a></p>',			[
																												'<p><a href="x">x</a><a href="y">^y</a></p>',
																												'<p><a href="x">x^</a><a href="y">y</a></p>' // For WebKit (https://dev.ckeditor.com/ticket/13709).
																											] ),
		'test backspace, merge #4':		b( '<p><em>x</em></p><div><p><em>[]y</em></p><p>z</p></div>',		'<p><em>x^y</em></p><div><p>z</p></div>' ),
		'test backspace, merge #5':		b( '<p id="foo">x</p><p id="bar">[]y</p>',							'<p id="foo">x^y</p>' ),
		'test backspace, merge #6':		b( '<p data-foo="x">x</p><p data-foo="y">[]y</p>',					'<p data-foo="x">x^y</p>' ),
		'test backspace, merge #7':		b( '<p style="color:red">x</p><p style="color:blue">[]y</p>',		'<p style="color:red">x^y</p>' ),

		'test backspace, merge #8': CKEDITOR.env.safari ? ignoreIt :
										b( '<p><em style="color:red">x</em></p><p><em style="color:blue">[]y</em></p>',
																											[
																												'<p><em style="color:red">x</em><em style="color:blue">^y</em></p>',
																												'<p><em style="color:red">x^</em><em style="color:blue">y</em></p>' // For WebKit (https://dev.ckeditor.com/ticket/13709).
																											] ),
		'test backspace, merge #9':		b( '<p style="color:red">x</p><p style="color:blue;text-align:right;">[]y</p>',
																												'<p style="color:red">x^y</p>' ),

		// Boguses.
		'test backspace, bogus #1':		b( '<p>@</p><p>[]y</p>',											'<p>^y</p>' ),
		'test backspace, bogus #2':		b( '<p>@</p><p>[]@</p>',											'<p>^@!</p>' ),
		'test backspace, bogus #3':		b( '<p>x</p><p>[]@</p>',											'<p>x^@!</p>' ),
		'test backspace, bogus #4':		b( '<p><br>@</p><p>[]@</p>',										'<p><br />^@!</p>' ),

		// False positives. Some of them are buggy, but it's a different case e.g. not merging blocks.
		// Note: The second pattern is just the first but after a selection normalization.
		'test backspace, no action #1':	bf( '<p>x</p><p>y{}y</p>', '<p>x</p><p>y^y</p>' ),
		'test backspace, no action #2':	bf( '<span>x</span><p>{}y</p>', '<span>x</span><p>^y</p>' ),
		'test backspace, no action #3':	bf( '<p>x</p><p><strong>y{}y</strong></p>', '<p>x</p><p><strong>y^y</strong></p>' ),
		'test backspace, no action #4':	bf( '<p>x</p><blockquote><p>y{}y</p></blockquote>', '<p>x</p><blockquote><p>y^y</p></blockquote>' ),
		'test backspace, no action #5':	bf( '<p>x</p><blockquote>z<p>{}y</p></blockquote>', '<p>x</p><blockquote>z<p>^y</p></blockquote>' ),
		'test backspace, no action #6':	bf( 'x<p>{}y</p>', 'x<p>^y</p>' ),
		'test backspace, no action #7':	bf( '<p>x</p>z<p>{}y</p>', '<p>x</p>z<p>^y</p>' ),

		// Handled by list or table plugin or editable, but not related to https://dev.ckeditor.com/ticket/9998.
		// This is just to control whether the fix for https://dev.ckeditor.com/ticket/9998 does not break some case which it should not handle at all.
		'test backspace, excluded #1':		b( '<ul><li>x</li><li>[]y</li></ul>',								'<ul><li>x^y</li></ul>' ),
		'test backspace, excluded #2':		b( '<p>x</p><ul><li>[]y</li></ul>',									'<p>x</p><p>^y</p>' ),
		'test backspace, excluded #3':		b( '<p>x</p><ul><li><h1>[]y</h1></li></ul>',							'<p>x</p><h1>^y</h1>' ),
		'test backspace, excluded #4':		b( '<p>x</p><ul><li><ol><li>[]y</li></ol></li><li>z</li></ul>',		'<p>x</p><ul><li>^y</li><li>z</li></ul>' ),
		'test backspace, excluded #5':		b( '<table><tbody><tr><td>x</td><td>[]y</td></tr></tbody></table>',	'<table><tbody><tr><td>x</td><td>^y</td></tr></tbody></table>' ),
		'test backspace, excluded #6':		b( '<table><tbody><tr><td><p>x</p></td><td><p>[]y</p></td></tr></tbody></table>',
																												'<table><tbody><tr><td><p>x</p></td><td><p>^y</p></td></tr></tbody></table>' ),
		'test backspace, excluded #7':		b( '<p>x</p><table><tbody><tr><td>[]y</td></tr></tbody></table>',	'<p>x^</p><table><tbody><tr><td>y</td></tr></tbody></table>' ),

		// --- DELETE ---------------------------------------------------------

		'test delete #1':					d( '<p>x[]</p><p>y</p>',												'<p>x^y</p>' ),
		'test delete #2':					d( '<p><strong>x[]</strong></p><p>y</p>',							'<p><strong>x^</strong>y</p>' ),
		'test delete #3':					d( '<p><a href="z">x[]</a></p><p>y</p>',								'<p><a href="z">x^</a>y</p>' ),
		'test delete #4':					d( '<blockquote><p>x[]</p></blockquote><p>y</p>',					'<blockquote><p>x^y</p></blockquote>' ),
		'test delete #5':					d( '<p>x[]</p><h1>y</h1>',											'<p>x^y</p>' ),
		'test delete #6':					d( '<h1>x[]</h1><p>y</p>',											'<h1>x^y</h1>' ),
		'test delete #7':					d( '<p>f<strong>o</strong>o[]</p><p>x</p>',							'<p>f<strong>o</strong>o^x</p>' ),
		'test delete #8':					d( '<blockquote><p>x[]</p></blockquote><div><p>y</p></div>',			'<blockquote><p>x^y</p></blockquote>' ),
		'test delete #9':					d( '<blockquote><p><u>x[]</u></p></blockquote><div><p><strong>f<em>oo</em></strong></p></div>',
																												'<blockquote><p><u>x^</u><strong>f<em>oo</em></strong></p></blockquote>' ),
		'test delete #10':					d( '<p>[]@</p><p>y</p>',												'<p>^y</p>' ),
		'test delete #13':					d( '<aside><p>x[]</p></aside><section><p>y</p></section>',			'<aside><p>x^y</p></aside>' ),
		'test delete #14':					d( '<aside><p>x[]</p></aside><section><p>y</p><p>z</p></section>',	'<aside><p>x^y</p></aside><section><p>z</p></section>' ),
		'test delete #15':					d( '<p>y[]</p><hr /><p>a</p>',										'<p>y^</p><p>a</p>' ),
		'test delete #16':					d( '<p>y[]</p><hr />',												'<p>y^</p>' ),
		'test delete #17':					d( '<p>y[]</p><hr id="h1" /><hr id="h2" /><p>a</p>',					'<p>y^</p><hr id="h2" /><p>a</p>' ),

		// Merge inline elements after keystroke.
		'test delete, merge #1':			d( '<p><em>x[]</em></p><p><em>y</em></p>',							'<p><em>x^y</em></p>' ),
		'test delete, merge #2':			d( '<p><em id="x">x[]</em></p><p><em id="y">y</em></p>',				'<p><em id="x">x^</em><em id="y">y</em></p>' ),
		'test delete, merge #3':			d( '<p><a href="x">x[]</a></p><p><a href="y">y</a></p>',				'<p><a href="x">x^</a><a href="y">y</a></p>' ),
		'test delete, merge #4':			d( '<p><em>x[]</em></p><div><p><em>y</em></p><p>z</p></div>',		'<p><em>x^y</em></p><div><p>z</p></div>' ),

		// Boguses.
		'test delete, bogus #1':			d( '<p>x[]</p><p>@</p>',												'<p>x^@!</p>' ),
		'test delete, bogus #2':			d( '<p>@[]</p><p>@</p>',												'<p>^@!</p>' ),
		'test delete, bogus #3':			d( '<p>[]@</p><p>x</p>',												'<p>^x</p>' ),
		'test delete, bogus #4':			d( '<p>[]@</p><p><br>@</p>',											'<p>^<br />@!</p>' ),

		// False positives. Some of them are buggy, but it's a different case e.g. not merging blocks.
		// Note: The second pattern is just the first but after a selection normalization.
		'test delete, no action #1':		df( '<p>x{}x</p><p>y</p>', '<p>x^x</p><p>y</p>' ),
		'test delete, no action #2':		df( '<p>x{}</p><span>y</span>', '<p>x^</p><span>y</span>' ),
		'test delete, no action #3':		df( '<p><strong>x{}x</strong></p><p>y</p>', '<p><strong>x^x</strong></p><p>y</p>' ),
		'test delete, no action #4':		df( '<blockquote><p>x{}x</p></blockquote><p>y</p>', '<blockquote><p>x^x</p></blockquote><p>y</p>' ),
		'test delete, no action #5':		df( '<blockquote><p>x{}</p>x</blockquote><p>y</p>', '<blockquote><p>x^</p>x</blockquote><p>y</p>' ),
		'test delete, no action #6':		df( '<p>x{}</p>y', '<p>x^</p>y' ),
		'test delete, no action #7':		df( '<p>y{}</p>y<p>z</p>', '<p>y^</p>y<p>z</p>' ),

		// Handled by list or table plugin or editable, but not related to https://dev.ckeditor.com/ticket/9998.
		// This is just to control whether the fix for https://dev.ckeditor.com/ticket/9998 does not break some case which it should not handle at all.
		'test delete, excluded #1':			d( '<ul><li>x[]</li><li>y</li></ul>',								'<ul><li>x^y</li></ul>' ),
		'test delete, excluded #2':			d( '<ul><li>x[]</li></ul><p>y</p>',									'<ul><li>x^y</li></ul>' ),
		'test delete, excluded #3':			d( '<ul><li><h1>x[]</h1></li></ul><p>y</p>',							'<ul><li><h1>x^y</h1></li></ul>' ),
		'test delete, excluded #4':			d( '<table><tbody><tr><td>x[]</td><td>y</td></tr></tbody></table>',	'<table><tbody><tr><td>x^</td><td>y</td></tr></tbody></table>' ),
		'test delete, excluded #5':			d( '<table><tbody><tr><td><p>x[]</p></td><td><p>y</p></td></tr></tbody></table>',
																												'<table><tbody><tr><td><p>x^</p></td><td><p>y</p></td></tr></tbody></table>' ),
		'test delete, excluded #6':			d( '<table><tbody><tr><td>x[]</td></tr></tbody></table><p>y</p>',	'<table><tbody><tr><td>x</td></tr></tbody></table><p>^y</p>' )
	} );
} )( quirksTools );
