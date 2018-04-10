/* bender-tags: editor */
/* bender-ckeditor-plugins: list,table,undo */
/* global quirksTools */

( function( bd, bdf, b, df ) {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false
		}
	};

	bender.test( {
		setUp: function() {
			// Preventing removing empty <small> tag.
			delete CKEDITOR.dtd.$removeEmpty.small;

			if ( !CKEDITOR.env.webkit )
				assert.ignore();
		},

		'test backspace records undo snapshots': function() {
			var editor = this.editor,
				tc = this;

			this.editorBot.setData( '', function() {
				editor.resetUndo();

				b( '<p>x[x</p><p>y]y</p>', '<p>x^y</p>' ).call( tc );

				editor.execCommand( 'undo' );
				assert.areSame( '<p>xx</p><p>yy</p>', editor.getData(), 'after 1st undo' );

				editor.execCommand( 'undo' );
				assert.areSame( '', editor.getData(), 'after 2nd undo' );
			} );
		},

		'test no snapsot when case not handled': function() {
			var editor = this.editor,
				tc = this;

			this.editorBot.setData( '', function() {
				editor.resetUndo();

				bdf( '<span>x[x</span><p>y]y</p>' ).call( tc );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state );
			} );
		},

		'test delete on two paragraphs in read-only mode': function() {
			this.editor.setReadOnly( true );

			try {
				df( '<p>[Test</p><p>Test]</p>', '<p>[Test</p><p>Test]</p>' ).call( this );
			} catch ( e ) {
				throw e;
			} finally {
				this.editor.setReadOnly( false );
			}
		},

		'test backspace and delete #1':					bd( '<p>xx[x</p><p>y]yy</p>',															'<p>xx^yy</p>' ),
		'test backspace and delete #2':					bd( '<div>xx[x</div><div>y]yy</div>',													'<div>xx^yy</div>' ),
		'test backspace and delete #3':					bd( '<p>x<strong>x[x</strong></p><p>y]yy</p>',											'<p>x<strong>x^</strong>yy</p>' ),
		'test backspace and delete #4':					bd( '<p>x<strong>x[x</strong></p><p><strong>y]y</strong>y</p>',							'<p>x<strong>x^y</strong>y</p>' ),
		'test backspace and delete #5':					bd( '<p>xx[x</p><p><strong>y]y</strong>y</p>',											'<p>xx^<strong>y</strong>y</p>' ),

		'test backspace and delete #6':					bd( '<p>xx[x</p><p>z</p><p>y]yy</p>',													'<p>xx^yy</p>' ),
		'test backspace and delete #7':					bd( '<p>xx[x</p><hr /><p>y]yy</p>',														'<p>xx^yy</p>' ),
		'test backspace and delete #8':					bd( '<p>xx[x</p><hr /><hr /><hr /><p>y]yy</p>',											'<p>xx^yy</p>' ),
		'test backspace and delete #9':					bd( '<p>xx[x</p><div>z<em>z</em>z</div><p>y]yy</p>',									'<p>xx^yy</p>' ),
		'test backspace and delete #10':				bd( '<p>xx[x</p><table><tbody><tr><td>qq</td></tr></tbody></table><p>y]yy</p>',			'<p>xx^yy</p>' ),

		'test backspace and delete #11':				bd( '<ul><li>x[x<li></ul><p>y]y</p>',													'<ul><li>x^y</li></ul>' ),
		'test backspace and delete #12':				bd( '<ul><li>xx<ul><li>nn</li><li>m[m</li></ul></li></ul><p>y]y</p>',					'<ul><li>xx<ul><li>nn</li><li>m^y</li></ul></li></ul>' ),
		'test backspace and delete #13':				bd( '<ul><li>xx<ul><li>n[n</li><li>mm</li></ul></li></ul><p>y]y</p>',					'<ul><li>xx<ul><li>n^y</li></ul></li></ul>' ),
		'test backspace and delete #14':				bd( '<ul><li>xx<ul><li>n[n</li><li>mm</li></ul></li><li>ww</li></ul><p>y]y</p>',		'<ul><li>xx<ul><li>n^y</li></ul></li></ul>' ),

		'test backspace and delete #15':				bd( '<div>x<p>x[x</p></div><div><p>y]y</p>y</div>',										'<div>x<p>x^y</p>y</div>' ),
		'test backspace and delete #16':				bd( '<div>x<p>x[x</p></div><div><div><div><p>y]y</p>y</div></div></div>',				'<div>x<p>x^y</p><div><div>y</div></div></div>' ),
		'test backspace and delete #17':				bd( '<div><div>x<div><p>x[x</p></div></div></div><div>y<p>y]y</p></div>',				'<div><div>x<div><p>x^y</p></div></div></div>' ),

		// Merge inline elements after keystroke.
		'test backspace and delete, merge #1':			bd( '<p>x<strong class="x">x[x</strong></p><p><strong class="y">y]y</strong>y</p>',		'<p>x<strong class="x">x^</strong><strong class="y">y</strong>y</p>' ),
		'test backspace and delete, merge #2':			bd( '<p>x<strong class="foo">x[x</strong></p><p><strong class="foo">y]y</strong>y</p>',	'<p>x<strong class="foo">x^y</strong>y</p>' ),

		// Boguses
		'test backspace and delete, bogus #1':			bd( '<p>x[x</p><p>]@</p>', '<p>x^@</p>' ),
		'test backspace and delete, bogus #2':			bd( '<p>x[x</p><p>x]@</p>', '<p>x^@</p>' ),
		'test backspace and delete, bogus #3':			bd( '<p>[@</p><p>]@</p>', '<p>^@</p>' ),
		'test backspace and delete, bogus #4':			bd( '<p>@[</p><p>]@</p>', '<p>^@</p>' ),

		// https://dev.ckeditor.com/ticket/12503.
		'test backspace and delete, bogus #5':			bd( '<h1>{Foo</h1><p>bar</p><p><small>baz}</small></p>', '<h1>^@!</h1>' ),

		// Merge inline elements after keystroke.
		'test backspace and delete, no action #1':		bdf( '<span>xx[x</span><p>y]yy</p>' ),
		'test backspace and delete, no action #2':		bdf( '<p>xx[x</p><span>y]yy</span>' ),
		'test backspace and delete, no action #3':		bdf( '<p>x[xy]y</p>' ),

		// Tables #541
		// jscs:disable maximumLineLength
		'test backspace and delete, tables #1':	bd( '<table><tbody><tr><td>x[x</td></tr></tbody></table><p>y]y</p>', '<table><tbody><tr><td>x^</td></tr></tbody></table><p>y</p>' ),
		'test backspace and delete, tables #2':	bd( '<table><tbody><tr><td>x[x</td><td>zz</td></tr></tbody></table><p>y]y</p>', '<table><tbody><tr><td>x^</td><td>@</td></tr></tbody></table><p>y</p>' ),
		'test backspace and delete, tables #3':	bd( '<table><tbody><tr><td>x[x</td></tr></tbody></table><table><tbody><tr><td>y]y</td></tr></tbody></table>', '<table><tbody><tr><td>x^</td></tr></tbody></table><table><tbody><tr><td>y</td></tr></tbody></table>' ),
		'test backspace and delete, tables #4':	bd( '<p>x[x</p><table><tbody><tr><td>aa</td><td>b]b</td></tr><tr><td>cc</td><td>dd</td></tr></tbody></table><p>zz</p>', '<p>x^</p><table><tbody><tr><td>@</td><td>b</td></tr><tr><td>cc</td><td>dd</td></tr></tbody></table><p>zz</p>' ),
		'test backspace and delete, tables #5':	bd( '<p>xx</p><table><tbody><tr><td>aa</td><td>bb</td></tr><tr><td>c[c</td><td>dd</td></tr></tbody></table><p>z]z</p>', '<p>xx</p><table><tbody><tr><td>aa</td><td>bb</td></tr><tr><td>c^</td><td>@</td></tr></tbody></table><p>z</p>' ),
		'test backspace and delete, tables + paragraphs #1':	bd( '<table><tbody><tr><td><p>x[x</p></td></tr></tbody></table><p>y]y</p>', '<table><tbody><tr><td><p>x^</p></td></tr></tbody></table><p>y</p>' ),
		'test backspace and delete, tables + paragraphs #2':	bd( '<table><tbody><tr><td><p>x[x</p></td><td>zz</td></tr></tbody></table><p>y]y</p>', '<table><tbody><tr><td><p>x^</p></td><td>@</td></tr></tbody></table><p>y</p>' ),
		'test backspace and delete, tables + paragraphs #3':	bd( '<table><tbody><tr><td><p>x[x</p></td></tr></tbody></table><table><tbody><tr><td><p>y]y</p></td></tr></tbody></table>' , '<table><tbody><tr><td><p>x^</p></td></tr></tbody></table><table><tbody><tr><td><p>y</p></td></tr></tbody></table>' ),
		'test backspace and delete, tables + paragraphs #4':	bd( '<p>x[x</p><table><tbody><tr><td><p>aa</p></td><td><p>b]b</p></td></tr><tr><td><p>cc</p></td><td><p>dd</p></td></tr></tbody></table><p>zz</p>' , '<p>x^</p><table><tbody><tr><td>@</td><td><p>b</p></td></tr><tr><td><p>cc</p></td><td><p>dd</p></td></tr></tbody></table><p>zz</p>' ),
		'test backspace and delete, tables + paragraphs #5':	bd( '<p>xx</p><table><tbody><tr><td><p>aa</p></td><td><p>bb</p></td></tr><tr><td><p>c[c</p></td><td><p>dd</p></td></tr></tbody></table><p>z]z</p>' , '<p>xx</p><table><tbody><tr><td><p>aa</p></td><td><p>bb</p></td></tr><tr><td><p>c^</p></td><td>@</td></tr></tbody></table><p>z</p>' )
		// jscs:enable maximumLineLength

	} );
} )( quirksTools.bd, quirksTools.bdf, quirksTools.b, quirksTools.df );
