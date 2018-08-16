/* bender-tags: editor,insertion */
/* global insertionDT */

( function() {
	'use strict';

	insertionDT.run( {
		autoParagraph: false,
		allowedContent: true
	}, {
		'plain text htmlification': function() {
			var a = this.createAssertInsertionFunction( 'body', '', 'insertText' );

			a.insertion = 'abc\r\ndef';
			a( '^', 'abc<br />def^',															'single line break' );
			a.insertion = 'abc\ndef';
			a( '^', 'abc<br />def^',															'single line break - LF only' );

			a.insertion = 'abc\r\n\r\ndef\r\nghi\r\n\r\njkl';
			a( '<p>foo^bar</p>',
					'<p>foo</p><p>abc</p><p>def<br />ghi</p><p>jkl^</p><p>bar</p>',				'2 LFs - wrapped blocks' );
			a.insertion = '\n\n\n\nfoo';
			a( '^', '<p>&nbsp;</p><p>&nbsp;</p><p>foo^</p>',									'4 LFs - empty blocks' );
			a.insertion = 'foo\n\n\nbar';
			a( '^', '<p>foo</p><p><br />bar^</p>',												'3 LFs - blocks and BR' );

			a.insertion = '\t';
			a( '^foo', '&nbsp;&nbsp; &nbsp;^foo',												'tab -> whitespaces x 4' );
			a.insertion = 'foo  bar';
			a( '^', 'foo &nbsp;bar^',															'consequent whitespaces' );
			a.insertion = 'foo\t  \n bar';
			a( '^', 'foo&nbsp;&nbsp; &nbsp; &nbsp;<br />&nbsp;bar^',							'whitespaces between tab and LF' );
			a.insertion = 'foo  \n\n  bar';
			a( '^', '<p>foo' + ( !CKEDITOR.env.needsNbspFiller ? ' &nbsp;' : '' ) + '</p><p>&nbsp; bar^</p>', 'whitespaces between paragraphs' );

			a.insertion = 'aaa\n2bbb\tccc\n\n  3ddd\n  4eee\n\t5fff\n\n\n6ggg  hhh\n';
			a( '^',
			'<p>aaa<br />2bbb&nbsp;&nbsp; &nbsp;ccc</p><p>&nbsp; 3ddd<br />&nbsp; 4eee<br />' +
			'&nbsp;&nbsp; &nbsp;5fff</p><p><br />6ggg &nbsp;hhh<br />^&nbsp;</p>',				'mixed LFs and tabs' );

			a.insertion = 'aa <bb cc';
			a( '^', 'aa &lt;bb cc^',															'html encoding' );
		},

		'empty and spaces insertions': function() {
			var a = this.createAssertInsertionFunction( 'body', '', 'insertText' );

			a.insertion = '';
			a( '^',						'^',													'empty into empty' );
			a( '<p>a^b</p>',			'<p>a^b</p>',											'empty into paragraph' );

			a.insertion = ' ';
			a( '^foo',						'&nbsp;^foo',													'space into empty' );
			a( 'a^b',					'a&nbsp;^b',											'space into text' );
			a( '<p>a^b</p>',			'<p>a&nbsp;^b</p>',										'space into paragraph' );
			a( '<p>a ^b</p>',			'<p>a &nbsp;^b</p>',									'space into paragraph after space' );

			a.insertion = '  ';
			a( '^foo',						'&nbsp;&nbsp;^foo',										'space x2 into empty' );
			a( '<p>a^b</p>',			'<p>a&nbsp;&nbsp;^b</p>',								'space x2 into paragraph' );

			a.insertion = ' a';
			a( '^',						'&nbsp;a^',												'space + text into empty' );
			a( '<p>a ^b</p>',			'<p>a &nbsp;a^b</p>',									'space + text into paragraph' );

			a.insertion = 'a ';
			a( '^foo',						'a&nbsp;^foo',												'text + space into empty' );
			a( '<p>a^ b</p>',			'<p>aa&nbsp;^ b</p>',									'text + space into paragraph' );

			a.insertion = 'x  y';
			a( '^',						'x &nbsp;y^',											'text + spaces into empty' );
			a( '<p>a^b</p>',			'<p>ax &nbsp;y^b</p>',									'text + spaces into paragraph' );
		}
	} );

} )();
