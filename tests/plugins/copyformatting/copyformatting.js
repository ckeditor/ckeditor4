/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js*/
/* global testCopyFormattingFlow */

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

	var tests = {
		'test applying style on collapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], {
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
			} ], {
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
			} ], {
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
			} ], {
				elementName: 'b',
				startOffset: 1,
				endOffset: 1,
				collapsed: true
			}, {
				from: 'keystrokeHandler'
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
}() );
