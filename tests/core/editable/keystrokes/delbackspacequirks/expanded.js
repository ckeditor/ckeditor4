/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: list,table,undo */
/* global quirksTools */

( function( bd, bdf, b ) {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false
		}
	};

	bender.test( {
		setUp: function() {
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

		'test backspace and delete #15':				bd( '<div>x<p>x[x</p></div><div><p>y]y</p>y</div>',										'<div>x<p>x^y</p></div><div>y</div>' ),
		'test backspace and delete #16':				bd( '<div>x<p>x[x</p></div><div><div><div><p>y]y</p>y</div></div></div>',				'<div>x<p>x^y</p></div><div><div><div>y</div></div></div>' ),
		'test backspace and delete #17':				bd( '<div><div>x<div><p>x[x</p></div></div></div><div>y<p>y]y</p></div>',				'<div><div>x<div><p>x^y</p></div></div></div>' ),

		// Merge inline elements after keystroke.
		'test backspace and delete, merge #1':			bd( '<p>x<strong class="x">x[x</strong></p><p><strong class="y">y]y</strong>y</p>',		'<p>x<strong class="x">x^</strong><strong class="y">y</strong>y</p>' ),
		'test backspace and delete, merge #2':			bd( '<p>x<strong class="foo">x[x</strong></p><p><strong class="foo">y]y</strong>y</p>',	'<p>x<strong class="foo">x^y</strong>y</p>' ),

		// Boguses
		'test backspace and delete, bogus #1':			bd( '<p>x[x</p><p>]@</p>', '<p>x^@</p>' ),
		'test backspace and delete, bogus #2':			bd( '<p>x[x</p><p>x]@</p>', '<p>x^@</p>' ),
		'test backspace and delete, bogus #3':			bd( '<p>[@</p><p>]@</p>', '<p>^@</p>' ),
		'test backspace and delete, bogus #4':			bd( '<p>@[</p><p>]@</p>', '<p>^@</p>' ),

		// Merge inline elements after keystroke.
		'test backspace and delete, no action #1':		bdf( '<table><tbody><tr><td>x[x</td></tr></tbody></table><p>y]y</p>' ),
		'test backspace and delete, no action #2':		bdf( '<table><tbody><tr><td>x[x</td><td>zz</td></tr></tbody></table><p>y]y</p>' ),
		'test backspace and delete, no action #3':		bdf( '<span>xx[x</span><p>y]yy</p>' ),
		'test backspace and delete, no action #4':		bdf( '<p>xx[x</p><span>y]yy</span>' ),
		'test backspace and delete, no action #5':		bdf( '<p>x[xy]y</p>' ),
		'test backspace and delete, no action #6':		bdf( '<table><tbody><tr><td>x[x</td></tr></tbody></table><table><tbody><tr><td>y]y</td></tr></tbody></table>' )
	} );
} )( quirksTools.bd, quirksTools.bdf, quirksTools.b );