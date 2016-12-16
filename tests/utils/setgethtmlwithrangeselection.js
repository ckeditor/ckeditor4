/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	var doc = new CKEDITOR.dom.document( document );

	function source( name ) {
		return bender.tools.getValueAsHtml( name );
	}

	bender.test( {
		// Test single selection.
		'setHtmlWithRange: single range': function() {
			var ranges = bender.tools.setHtmlWithRange( doc.getById( 'playground' ), source( 'textarea_1' ) ),
				range = ranges[ 0 ];

			assert.areSame( doc.getById( 'ol_1' ).$, range.startContainer.$ );
			assert.areSame( 0, range.startOffset );
			assert.areSame( doc.getById( 'ol_1' ).$, range.endContainer.$ );
			assert.areSame( 1, range.endOffset );
		},

		// Test select multiple ranges.
		'setHtmlWithRange: multiple ranges': function() {
			var ranges = bender.tools.setHtmlWithRange( doc.getById( 'playground' ), source( 'textarea_2' ) ),
				range1 = ranges[ 0 ];

			// Ranges are merged in old IEs.
			if ( ranges.length == 1 ) {
				assert.areSame( doc.getById( 'li_1' ).$, range1.startContainer.$ );
				assert.areSame( 0, range1.startOffset );
				assert.areSame( doc.getById( 'li_2' ).$, range1.endContainer.$ );
				assert.areSame( 1, range1.endOffset );
			} else {
				assert.areSame( doc.getById( 'li_1' ).$, range1.startContainer.$ );
				assert.areSame( 0, range1.startOffset );
				assert.areSame( doc.getById( 'li_1' ).$, range1.endContainer.$ );
				assert.areSame( 1, range1.endOffset );

				var range2 = ranges[ 1 ];

				assert.areSame( doc.getById( 'li_2' ).$, range2.startContainer.$ );
				assert.areSame( 0, range1.startOffset );
				assert.areSame( doc.getById( 'li_2' ).$, range2.endContainer.$ );
				assert.areSame( 1, range2.endOffset );
			}
		},

		// Test select inline element.
		'setHtmlWithRange: inline text range': function() {
			var ranges = bender.tools.setHtmlWithRange( doc.getById( 'playground' ), source( 'textarea_3' ) ),
				range1 = ranges[ 0 ];

			assert.areSame( doc.getById( 'p_1' ).$, range1.startContainer.$ );
			assert.areSame( 1, range1.startOffset );
			assert.areSame( doc.getById( 'p_1' ).$, range1.endContainer.$ );
			assert.areSame( 2, range1.endOffset );
		},

		// Test make collapsed selection.
		'setHtmlWithRange: collapsed range': function() {
			var ranges = bender.tools.setHtmlWithRange( doc.getById( 'playground' ), source( 'textarea_4' ) ),
				range1 = ranges[ 0 ];

			assert.areSame( doc.getById( 'p_2' ).$, range1.startContainer.$ );
			assert.areSame( 1, range1.startOffset );
			assert.areSame( range1.isCollapsed );
		},

		'setHtmlWithRange/setHtmlWithSelection: result range/selection scope': function() {
			var creatRange = bender.tools.setHtmlWithRange,
				createSel = bender.tools.setHtmlWithSelection;

			var playground = doc.getById( 'playground' );

			var range = creatRange( playground, '^', playground )[ 0 ];
			assert.areSame( range.root, playground );

			range = creatRange( playground, '^' )[ 0 ];
			assert.areSame( range.root, doc.getBody() );

			var tc = this;
			var editor = new CKEDITOR.editor();

			editor.on( 'loaded', function() {
				editor.editable(  playground  );
				editor.mode = 'wysiwyg';

				var sel = createSel( editor, '^' );

				tc.resume( function() {
					assert.areSame( sel.root, playground );
				} );
			} );
			tc.wait();
		},

		'getHtmlWithSelection: get markup from selection': function() {
			var createSel = bender.tools.setHtmlWithSelection,
				getSel = bender.tools.getHtmlWithSelection;

			var playground = doc.getById( 'playground' );

			var source = '<p><strong>[foo]</strong>bar</p>',
			plain = '<p><strong>foo</strong>bar</p>';
			createSel( playground, source, playground );
			assert.areSame( source, getSel( playground ) );
			assert.areSame( plain, bender.tools.compatHtml( playground.getHtml() ) );

			source = '<p>foo^bar</p>', plain = '<p>foobar</p>';
			createSel( playground, source, playground );
			assert.areSame( source, getSel( playground ) );
			assert.areSame( plain, bender.tools.compatHtml( playground.getHtml() ) );

			if ( CKEDITOR.env.gecko ) {
				source = '<ul><li>[foo]</li><li>^bar</li></ul>', plain = '<ul><li>foo</li><li>bar</li></ul>';
				createSel( playground, source, playground );
				assert.areSame( source, getSel( playground ) );
				assert.areSame( plain, bender.tools.compatHtml( playground.getHtml() ) );
			}
		},

		'test multiple table cells selection (Firefox only)': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			var ranges = bender.tools.setHtmlWithRange( doc.getById( 'playground' ), source( 'textarea_5' ) ),
				range = ranges[ 0 ];

			assert.areSame( doc.getById( 'tr_1' ).$, range.startContainer.$ );
			assert.areSame( 0, range.startOffset );
			assert.areSame( doc.getById( 'tr_1' ).$, range.endContainer.$ );
			assert.areSame( 1, range.endOffset );

			range = ranges[ 1 ];
			assert.areSame( doc.getById( 'tr_2' ).$, range.startContainer.$ );
			assert.areSame( 1, range.startOffset );
			assert.areSame( doc.getById( 'tr_2' ).$, range.endContainer.$ );
			assert.areSame( 2, range.endOffset );
		},

		'test list item selection': function() {
			var ranges = bender.tools.setHtmlWithRange( doc.getById( 'playground' ), source( 'textarea_6' ) ),
				range = ranges[ 0 ];

			assert.areSame( doc.getById( 'ol_2' ).$, range.startContainer.$ );
			assert.areSame( 0, range.startOffset );
			assert.areSame( doc.getById( 'ul_1' ).$, range.endContainer.$ );
			assert.areSame( 1, range.endOffset );
		},

		'test cursor collapsed in front of inner list': function() {
			var ranges = bender.tools.setHtmlWithRange( doc.getById( 'playground' ), source( 'textarea_7' ) ),
				range = ranges[ 0 ];

			assert.areSame( doc.getById( 'li_5' ).$, range.startContainer.$ );
			assert.areSame( 1, range.startOffset );
			assert.isTrue( range.collapsed );
		}
	} );
} )();