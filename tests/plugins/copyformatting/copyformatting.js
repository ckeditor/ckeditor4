/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js*/
/* global testCopyFormattingFlow, assertScreenReaderNotification, fixHtml */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true
			}
		},

		inline: {
			creator: 'inline',
			config: {
				allowedContent: true
			}
		}
	};

	var stylesToRemove = [
		new CKEDITOR.style( {
			element: 'b',
			attributes: {},
			styles: {},
			type: CKEDITOR.STYLE_INLINE
		} )
	],
	tests = {
		'test applying style on collapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 1,
				endOffset: 1,
				collapsed: true
			} );
		},

		'test applying style by on uncollapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 0,
				endOffset: 6
			} );
		},

		'test applying style from ambiguous initial selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy {t</s><span class="font-weight: bold">h}at</span> format</s> to <b>this element</b></p>',
			[ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 0,
				endOffset: 6
			} );
		},

		'test applying style using keystrokes': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 1,
				endOffset: 1,
				collapsed: true
			}, {
				from: 'keystrokeHandler'
			} );
		},

		'test applying text style to table': function( editor ) {
			var inputContent = '<table border="1">' +
						'<tr>' +
							'<td style="background: green;">aaa<br></td>' +
						'</tr>' +
					'</table>' +
					'<p><s>fo[]oo</s><br></p>',
				expectedContent = '<table border="1">' +
						'<tbody>' +
							'<tr>' +
								'<td style="background: green;"><s>a[]aa</s><br></td>' +
							'</tr>' +
						'</tbody>' +
					'</table>' +
					'<p><s>fooo</s><br></p>';

			bender.tools.selection.setWithHtml( editor, inputContent );

			editor.execCommand( 'copyFormatting' );

			// Move the selection to <td>a[]aa</td>.
			var rng = editor.createRange(),
				cellTextNode = editor.editable().findOne( 'td' ).getFirst();
			rng.setStart( cellTextNode, 1 );
			rng.setEnd( cellTextNode, 1 );
			editor.getSelection().selectRanges( [ rng ] );

			editor.execCommand( 'applyFormatting' );

			assert.areSame( fixHtml( expectedContent ), fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		// #16675
		'test applying styles from one cell to another': function( editor ) {
			var inputContent = CKEDITOR.document.findOne( '#t-16675 .input' ).getHtml(),
				rng,
				cell,
				cellTextNode;

			bender.tools.selection.setWithHtml( editor, inputContent );

			editor.execCommand( 'copyFormatting' );

			// Move the selection to Q in the second cell.
			rng = editor.createRange();
			cellTextNode = editor.editable().find( 'td' ).getItem( 1 ).findOne( 'span span' ).getFirst();

			rng.setStart( cellTextNode, 1 );
			rng.setEnd( cellTextNode, 1 );
			editor.getSelection().selectRanges( [ rng ] );

			editor.execCommand( 'applyFormatting' );

			// According to the differences in browsers, we just check if the last cell doesn't have
			// background color applied.
			cell = editor.editable().find( 'td' ).getItem( 2 );

			assert.areSame( '', cell.getStyle( 'background-color' ) );
		},

		'test changing list type': function( editor ) {
			var inputContent = CKEDITOR.document.findOne( '#list_type .input' ).getHtml(),
				expectedContent = CKEDITOR.document.findOne( '#list_type .expected' ).getHtml();

			bender.tools.selection.setWithHtml( editor, inputContent );

			editor.execCommand( 'copyFormatting' );

			// Move the selection to <b> inside 1. list.
			var rng = editor.createRange(),
				listTextNode = editor.editable().findOne( 'b' ).getFirst();

			rng.setStart( listTextNode, 1 );
			rng.setEnd( listTextNode, 1 );
			editor.getSelection().selectRanges( [ rng ] );

			editor.execCommand( 'applyFormatting' );

			assert.areSame( fixHtml( expectedContent ),
				fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		'test aplying styles to mixed list context': function( editor ) {
			var inputContent = CKEDITOR.document.findOne( '#list_remove_source .input' ).getHtml(),
				expectedContent = CKEDITOR.document.findOne( '#list_remove_source .expected' ).getHtml();

			bender.tools.selection.setWithHtml( editor, inputContent );

			editor.execCommand( 'copyFormatting' );

			// Move the selection to the end of <p> and inside <li>.
			var rng = editor.createRange(),
				parTextNode = editor.editable().findOne( 'p' ).getFirst(),
				listTextNode = editor.editable().findOne( 'li span' ).getFirst();

			rng.setStart( parTextNode, 59 );
			rng.setEnd( listTextNode, 2 );
			editor.getSelection().selectRanges( [ rng ] );

			editor.execCommand( 'applyFormatting' );

			assert.areSame( fixHtml( expectedContent ),
				fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},


		'test preserving inline styles of nested lists': function( editor ) {
			var inputContent = CKEDITOR.document.findOne( '#nested_lists_styles .input' ).getHtml(),
				expectedContent = CKEDITOR.document.findOne( '#nested_lists_styles .expected' ).getHtml();

			bender.tools.selection.setWithHtml( editor, inputContent );

			editor.execCommand( 'copyFormatting' );

			// Move the selection to <span> inside 1. list.
			var rng = editor.createRange(),
				listTextNode = editor.editable().findOne( 'span' ).getFirst();

			rng.setStart( listTextNode, 1 );
			rng.setEnd( listTextNode, 1 );
			editor.getSelection().selectRanges( [ rng ] );

			editor.execCommand( 'applyFormatting' );

			assert.areSame( fixHtml( expectedContent ),
				fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		'test removing inline styles while changing list type': function( editor ) {
			var inputContent = CKEDITOR.document.findOne( '#list_type_styles .input' ).getHtml(),
				expectedContent = CKEDITOR.document.findOne( '#list_type_styles .expected' ).getHtml();

			bender.tools.selection.setWithHtml( editor, inputContent );

			editor.execCommand( 'copyFormatting' );

			// Move the selection to <li> inside <ul>.
			var rng = editor.createRange(),
				listTextNode = editor.editable().findOne( 'ul li' ).getFirst();

			rng.setStart( listTextNode, 1 );
			rng.setEnd( listTextNode, 1 );
			editor.getSelection().selectRanges( [ rng ] );

			editor.execCommand( 'applyFormatting' );

			assert.areSame( fixHtml( expectedContent ),
				fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		'test changing list type (nested lists)': function( editor ) {
			var inputContent = CKEDITOR.document.findOne( '#list_type_nested .input' ).getHtml(),
				expectedContent = CKEDITOR.document.findOne( '#list_type_nested .expected' ).getHtml();

			bender.tools.selection.setWithHtml( editor, inputContent );

			editor.execCommand( 'copyFormatting' );

			// Move the selection to the whole list.
			var rng = editor.createRange(),
				listTextNode = editor.editable().findOne( 'li' ).getFirst(),
				nestedListTextNode = editor.editable().findOne( '[start="7"] li' ).getFirst();

			rng.setStart( listTextNode, 1 );
			rng.setEnd( nestedListTextNode, 1 );
			editor.getSelection().selectRanges( [ rng ] );

			editor.execCommand( 'applyFormatting' );

			// Old IEs are using element's selection, not text selection.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
				expectedContent = expectedContent.replace( '{', '[' ).replace( '}', ']' );
			}

			assert.areSame( fixHtml( expectedContent ),
				fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		'test removing formatting on collapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p>Copy t{}hat format to <b>this element</b></p>', [], stylesToRemove, {
				elementName: 'b',
				startOffset: 2,
				endOffset: 2,
				collapsed: true
			} );
		},

		'test removing formatting on uncollapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p>Copy t{}hat format to <b>this element</b></p>', [], stylesToRemove, {
				elementName: 'b',
				element: true
			} );
		},

		'test cancelling Copy Formatting command': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );
			bender.tools.selection.setWithHtml( editor, '<p><s>Co{}py that format</s>.</p>' );

			// Simulating two clicks on button.
			editor.execCommand( 'copyFormatting' );
			assertScreenReaderNotification( editor, 'copied' );
			editor.execCommand( 'copyFormatting' );
			assertScreenReaderNotification( editor, 'canceled' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( editor.copyFormatting.styles );
		},

		'test cancelling Copy Formatting command (Escape)': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );
			bender.tools.selection.setWithHtml( editor, '<p><s>Co{}py that format</s>.</p>' );

			editor.execCommand( 'copyFormatting' );

			editor.fire( 'key', {
				domEvent: {
						getKey: function() {
							return 27;
						},

						getKeystroke: function() {
							return 27;
						}
					}
			} );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( editor.copyFormatting.styles );
			assertScreenReaderNotification( editor, 'canceled' );
		},

		'test cancelling Copy Formatting command from keystroke (Escape)': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );
			bender.tools.selection.setWithHtml( editor, '<p><s>Co{}py that format</s>.</p>' );

			editor.execCommand( 'copyFormatting', { from: 'keystrokeHandler' } );

			editor.fire( 'key', {
				domEvent: {
						getKey: function() {
							return 27;
						},

						getKeystroke: function() {
							return 27;
						}
					}
			} );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( editor.copyFormatting.styles );
			assertScreenReaderNotification( editor, 'canceled' );
		},

		'test cancelling Copy Formatting command by cancelling applyFormatting event': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' ),
				copyFormatting = editor.copyFormatting,
				applyFormattingCount = 0;
			bender.tools.selection.setWithHtml( editor, '<p><s>Co{}py that format</s>.</p>' );

			copyFormatting.once( 'applyFormatting', function( evt ) {
				evt.cancel();
			} );
			copyFormatting.once( 'applyFormatting', function() {
				++applyFormattingCount;
			}, null, null, 998 );

			editor.execCommand( 'copyFormatting' );

			assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state );
			assert.isArray( copyFormatting.styles );
			assertScreenReaderNotification( editor, 'copied' );

			editor.execCommand( 'applyFormatting' );

			assert.areSame( 0, applyFormattingCount );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( copyFormatting.styles );
			assertScreenReaderNotification( editor, 'canceled' );
		},

		'test sticky Copy Formatting': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 1,
				endOffset: 1,
				collapsed: true
			}, {
				sticky: true
			} );
		},

		'test preserving styles at Copy Formatting destination': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' ),
				copyFormatting = editor.copyFormatting,
				range;

			bender.tools.selection.setWithHtml( editor, '<p><s>Co{py tha}t format</s>.</p>' );

			copyFormatting.once( 'applyFormatting', function( evt ) {
				evt.data.preventFormatStripping = true;
			}, null, null, 8 );

			editor.execCommand( 'copyFormatting' );

			assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state );
			assert.isArray( copyFormatting.styles );
			assertScreenReaderNotification( editor, 'copied' );

			editor.execCommand( 'applyFormatting' );

			range = editor.getSelection().getRanges()[ 0 ];

			assert.isTrue( CKEDITOR.plugins.copyformatting._extractStylesFromRange( editor, range ).length >= 2,
				'Styles are preserved' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( copyFormatting.styles );
			assertScreenReaderNotification( editor, 'applied' );
		},

		'test that _getCursorContainer returns correct element': function( editor ) {
			var correctContainer = editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ? editor.editable() :
				editor.editable().getParent();

			assert.areSame( correctContainer, CKEDITOR.plugins.copyformatting._getCursorContainer( editor ) );
		},

		'test disabling "disabled" cursor': function( editor ) {
			editor.config.copyFormatting_outerCursor = false;
			editor.execCommand( 'copyFormatting' );

			assert.isFalse( CKEDITOR.document.getDocumentElement().hasClass( 'cke_copyformatting_disabled' ) );

			editor.config.copyFormatting_outerCursor = true;
			editor.execCommand( 'copyFormatting' );
		},

		'test failed message for keystroke': function( editor ) {
			editor.execCommand( 'applyFormatting', { from: 'keystrokeHandler' } );

			assertScreenReaderNotification( editor, 'failed' );
		},

		'test premature paste formatting keystroke': function( editor ) {
			var prevent = sinon.spy(),
				keystroke = CKEDITOR.CTRL + CKEDITOR.SHIFT + 77;

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: keystroke,
				preventDefault: prevent
			} ) );

			assert.isFalse( prevent.called );
		},

		'test notifications': function( editor ) {
			var copyformatting = CKEDITOR.plugins.copyformatting;

			copyformatting._putScreenReaderMessage( editor, 'copied' );
			assertScreenReaderNotification( editor, 'copied' );

			copyformatting._putScreenReaderMessage( editor, 'applied' );
			assertScreenReaderNotification( editor, 'applied' );

			copyformatting._putScreenReaderMessage( editor, 'canceled' );
			assertScreenReaderNotification( editor, 'canceled' );

			copyformatting._putScreenReaderMessage( editor, 'failed' );
			assertScreenReaderNotification( editor, 'failed' );
		},

		'test _getScreenReaderContainer': function() {
			var ret = CKEDITOR.plugins.copyformatting._getScreenReaderContainer();

			assert.isInstanceOf( CKEDITOR.dom.element, ret, 'Proper type returned' );
			assert.isTrue( ret.hasAttribute( 'aria-live' ), 'Is an ARIA live region' );
		},

		'test _addScreenReaderContainer': function() {
			var copyformatting = CKEDITOR.plugins.copyformatting,
				wrapper = copyformatting._getScreenReaderContainer(),
				wrapperSelection = '.cke_copyformatting_notification div[aria-live]',
				doc = CKEDITOR.document,
				ret,
				secondRet,
				matched;

			if ( wrapper ) {
				// Ensure that there's no wrapper.
				wrapper.remove();
			}

			ret = copyformatting._addScreenReaderContainer();

			// Ensure that it really is in the DOM.
			matched = doc.findOne( wrapperSelection );

			assert.isNotNull( matched, 'Wrapper was placed in the document' );
			assert.areSame( matched, ret, 'Wrapper was returned by the function' );

			secondRet = copyformatting._addScreenReaderContainer();
			copyformatting._addScreenReaderContainer();
			copyformatting._addScreenReaderContainer();

			assert.areSame( ret, secondRet, 'Returned the same value for the second call' );
			assert.areSame( 1, doc.find( wrapperSelection ).count(), 'Multiple calls doesnt put multiple containers' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
}() );
