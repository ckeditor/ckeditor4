/* bender-tags: editor,unit,insertion */
/* global insertionDT */

( function() {
	'use strict';

	insertionDT.run( {
		autoParagraph: true,
		allowedContent: true // Disable filter.
	}, {
		'basic cases': function() {
			var a = this.createAssertInsertionFunction( 'body,div', 'bam' );
			a( '<p>^</p>', '<p>bam^</p>',											'into empty paragraph' );
			a( '<p title="1">a^b</p>', '<p title="1">abam^b</p>',					'into p' );
			a( '<hr />^<hr />', '<hr /><p>bam^</p><hr />',							'between hrs' );

			a.insertion = 'foo<p>bar</p>';
			a( '<p>^</p>', '<p>foo</p><p>bar^</p>',									'pseudo block 1' );
			a.insertion = '<p>foo</p>bar';
			a( '<p>^</p>', '<p>foo</p><p>bar^</p>',									'pseudo block 2' );
			a( '<p>a[b</p><p>c]d</p>', '<p>a</p><p>foo</p><p>bar^d</p>',			'pseudo block 2 (merge at end)' );

			// No auto paragraphing
			a = this.createAssertInsertionFunction( 'h1', 'bam' );
			a( '^', 'bam^',															'into empty editable' );
		},

		'#119 - paste paragraphs into empty paragraph': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<p>aaa</p><p>bbb</p>' ),
				b = CKEDITOR.env.needsNbspFiller ? '&nbsp;' : '<br>';

			a( '<p>xxx</p><p>^' + b + '</p>', '<p>xxx</p><p>aaa</p><p>bbb^</p>',	'at the end' );
			a( '<p>xxx</p><p>^' + b + '</p><p>yyy</p>',
				'<p>xxx</p><p>aaa</p><p>bbb^</p><p>yyy</p>',						'in the middle' );
			a( '<p>^' + b + '</p><p>yyy</p>', '<p>aaa</p><p>bbb^</p><p>yyy</p>',	'at the beginning' );
		}
	} );
} )();