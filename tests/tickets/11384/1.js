/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: toolbar,clipboard */

( function() {
	'use strict';

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				inline: {
					name: 'inline',
					creator: 'inline'
				}
			}, function( editors, bots ) {
				that.editors = editors;
				that.editorBots = bots;

				that.callback();
			} );
		},

		'test paste into a non-empty range': function() {
			var editor = this.editors.inline;

			this.editorBots.inline.setData( '<p>1234567890</p>', function() {
				var sel = editor.getSelection(),
					paragraph = editor.editable().getFirst(),
					textNode = paragraph.getFirst(),
					itThrew = false;

				// Set seleciton 12[345678]90.
				var rng = editor.createRange();
				rng.setStart( textNode, 2 );
				rng.setEnd( textNode, 8 );
				sel.selectRanges( [ rng ] );

				var origSelectRanges = CKEDITOR.dom.selection.prototype.selectRanges,
					revert = bender.tools.replaceMethod( CKEDITOR.dom.selection.prototype, 'selectRanges', function( ranges ) {
						try {
							origSelectRanges.call( this, ranges );
						} catch ( e ) {
							itThrew = true;
							throw e;
						}
					} );

				editor.on( 'afterPaste', function() {
					resume( function() {
						revert();
						assert.isFalse( itThrew, 'selectRanges has not thrown an error' );
					} );
				} );

				// Ensure async.
				wait( function() {
					bender.tools.emulatePaste( editor, '<p>abc</p>' );
				} );
			} );
		}
	} );
} )();