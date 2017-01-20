/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,clipboard,toolbar */

( function() {
	'use strict';

	bender.editors = {
		classic: {}
	};

	function _addPasteListener( editor, callback ) {
		// Since currently tabletools cancel afterPaste event, we need to do some setTimeout trickery.
		editor.once( 'paste', function() {
			setTimeout( function() {
				resume( function() {
					if ( callback ) {
						callback();
					}
				} );
			}, 100 );
		}, null, null, 1 );
	}

	var doc = CKEDITOR.document,
		tests = {
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

			'test merge row after': function( editor, bot ) {
				bender.tools.testInputOut( 'merge-row-after', function( source, expected ) {
					bot.setHtmlWithSelection( source );

					_addPasteListener( editor, function() {
						bender.assert.beautified.html( expected, bot.editor.getData() );
					} );

					bender.tools.emulatePaste( editor, doc.getById( '2cells1row' ).getOuterHtml() );

					wait();
				} );
			},

			'test merge row before': function( editor, bot ) {
				bender.tools.testInputOut( 'merge-row-before', function( source, expected ) {
					bot.setHtmlWithSelection( source );

					_addPasteListener( editor, function() {
						bender.assert.beautified.html( expected, bot.editor.getData() );
					} );

					bender.tools.emulatePaste( editor, doc.getById( '2cells1row' ).getOuterHtml() );

					wait();
				} );
			},

			'test merge multi rows after': function( editor, bot ) {
				bender.tools.testInputOut( 'merge-rows-after', function( source, expected ) {
					bot.setHtmlWithSelection( source );

					_addPasteListener( editor, function() {
						bender.assert.beautified.html( expected, bot.editor.getData() );
					} );

					bender.tools.emulatePaste( editor, doc.getById( '2cells2rows' ).getOuterHtml() );

					wait();
				} );
			},

			'test merge multi rows before': function( editor, bot ) {
				bender.tools.testInputOut( 'merge-rows-before', function( source, expected ) {
					bot.setHtmlWithSelection( source );

					_addPasteListener( editor, function() {
						bender.assert.beautified.html( expected, bot.editor.getData() );
					} );

					bender.tools.emulatePaste( editor, doc.getById( '2cells2rows' ).getOuterHtml() );

					wait();
				} );
			},

			'test merge multi rows after empty cell': function( editor, bot ) {
				bender.tools.testInputOut( 'merge-rows-after-empty', function( source, expected ) {
					bot.setHtmlWithSelection( source );

					_addPasteListener( editor, function() {
						bender.assert.beautified.html( expected, bot.editor.getData() );
					} );

					bender.tools.emulatePaste( editor, doc.getById( '2cells2rows' ).getOuterHtml() );

					wait();
				} );
			},

			'test merge multi rows before empty cell': function( editor, bot ) {
				bender.tools.testInputOut( 'merge-rows-before-empty', function( source, expected ) {
					bot.setHtmlWithSelection( source );

					_addPasteListener( editor, function() {
						bender.assert.beautified.html( expected, bot.editor.getData() );
					} );

					bender.tools.emulatePaste( editor, doc.getById( '2cells2rows' ).getOuterHtml() );

					wait();
				} );
			}
		};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
} )();
