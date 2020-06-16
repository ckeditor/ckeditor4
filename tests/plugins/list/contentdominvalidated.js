/* bender-tags: editor */
/* bender-ckeditor-plugins: list */

( function() {
	'use strict';

	var invalidatedEventCounter = 0;

	bender.editor = {
		config: {
			allowedContent: true,
			on: {
				contentDomInvalidated: function() {
					invalidatedEventCounter++;
				}
			}
		}
	};

	bender.test( {
		setUp: function() {
			invalidatedEventCounter = 0;
		},

		'test indent list': function() {
			var editor = this.editor,
				editable = editor.editable();

			editor.focus();

			this.editorBot.setData(
				'<ul>' +
					'<li>A</li>' +
					'<li>B</li>' +
					'<li>C</li>' +
					'<li>D</li>' +
				'</ul>',
				function() {
					// Selection:
					// <ul>
					//  	<li>A</li>
					//  	[<li>B</li>
					//  	<li>C</li>
					//  	<li>D</li>
					// </ul>]
					var range = editor.getSelection().getRanges()[ 0 ];
					range.setStartAt( editable.findOne( 'ul' ).getChild( 1 ), CKEDITOR.POSITION_AFTER_START );
					range.setEndAfter( editable.findOne( 'ul' ) );
					editor.getSelection().selectRanges( [ range ] );

					editor.execCommand( 'indent' );

					assert.areSame( 1, invalidatedEventCounter, 'contentDomInvalidated event should occurred once.' );
				}
			);
		},

		'test change list type': function() {
			var editor = this.editor,
				editable = editor.editable();

			editor.focus();

			this.editorBot.setData(
				'<ol>' +
					'<li>A</li>' +
					'<li>B</li>' +
				'</ol>',
				function() {
					editor.getSelection().selectElement( editable.findOne( 'ol' ) );

					editor.execCommand( 'bulletedlist' );

					assert.areSame( 0, editable.find( 'ol' ).count() );
					assert.areSame( 1, editable.find( 'ul' ).count() );

					assert.areSame( 1, invalidatedEventCounter, 'contentDomInvalidated event should occurred once.' );
				}
			);
		}
	} );

} )();
