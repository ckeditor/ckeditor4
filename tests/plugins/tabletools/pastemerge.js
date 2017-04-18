/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,clipboard,toolbar */

( function() {
	'use strict';

	bender.editors = {
		classic: {}
	};

	function createTestCase( fixtureId, pasteFixtureId ) {
		return function( editor, bot ) {
			bender.tools.testInputOut( fixtureId, function( source, expected ) {
				editor.once( 'paste', function() {
					resume( function() {
						shrinkSelections( editor );
						bender.assert.beautified.html( expected, bender.tools.getHtmlWithSelection( editor ) );
					} );
				}, null, null, 1 );

				bot.setHtmlWithSelection( source );

				bender.tools.emulatePaste( editor, CKEDITOR.document.getById( pasteFixtureId ).getOuterHtml() );

				wait();
			} );
		};
	}

	function shrinkSelections( editor ) {
		// Shrinks each range into it's inner element, so that range markers are not outside `td` elem.
		var ranges = editor.getSelection().getRanges(),
			i;

		for ( i = 0; i < ranges.length; i++ ) {
			ranges[ i ].shrink( CKEDITOR.SHRINK_TEXT, false );
		}
	}

	var tests = {
			'test doesnt break regular paste': function( editor ) {
				bender.tools.setHtmlWithSelection( editor, '<p>foo^bar</p>' );
				bender.tools.emulatePaste( editor, '<p>bam</p>' );

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areSame( '<p>foobambar</p>', editor.getData() );
					} );
				} );

				wait();
			},

			'test merge row after': createTestCase( 'merge-row-after', '2cells1row' ),

			'test merge row before': createTestCase( 'merge-row-before', '2cells1row' ),

			'test merge multi rows after': createTestCase( 'merge-rows-after', '2cells2rows' ),

			'test merge multi rows before': createTestCase( 'merge-rows-before', '2cells2rows' ),

			'test merge multi rows after empty cell': createTestCase( 'merge-rows-after-empty', '2cells2rows' ),

			'test merge multi rows before empty cell': createTestCase( 'merge-rows-before-empty', '2cells2rows' )
		};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
} )();
