/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax */
/* bender-include: ../../plugins/clipboard/_helpers/pasting.js */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null,
			pasteFromWordRemoveFontStyles: false,
			pasteFromWordRemoveStyles: false,
			allowedContent: true
		}
	};

	var parentMock = {
			children: []
		},
		filterMock = new CKEDITOR.htmlParser.filter();

	bender.test( {
		'test create style stack': function() {
			var element = new CKEDITOR.htmlParser.element( 'p' );
			element.attributes.style = 'font-family: "Calibri"; font-size: 36pt; color: yellow; background: lime';
			element.add( new CKEDITOR.htmlParser.text( 'test' ) );
			element.parent = parentMock;

			// Pasting used only to load the filter script.
			assertPasteEvent( this.editor, { dataValue: '<w:WordDocument></w:WordDocument>' }, function() {
				CKEDITOR.cleanWord.createStyleStack( element, filterMock );
				assert.areSame(
					'<p style="color:yellow"><span style="font-family:&quot;Calibri&quot;"><span style="font-size:36pt"><span style="background:lime">test</span></span></span></p>',
					element.getOuterHtml()
				);
			}, null, true );
		},
		'test create style stack multiple children': function() {
			var edgeCase = '<span style="font-family:Courier;font-size:14px" ><span style="font-weight:bold">Some </span>Text</span>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( edgeCase ),
				element = fragment.children[ 0 ];

			// The filter script was loaded in the previous test.
			CKEDITOR.cleanWord.createStyleStack( element, filterMock );
			assert.areSame( '<span style="font-family:Courier"><span style="font-size:14px"><span style="font-weight:bold">Some </span>Text</span></span>', element.getOuterHtml() );
		},
		// Margin-bottom is a block style, so it should not be stacked.
		'test create style stack omit block styles': function() {
			var edgeCase = '<p style="font-size: 16pt;font-family: Arial;margin-bottom:0pt;">Test</p>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( edgeCase ),
				element = fragment.children[ 0 ];

			CKEDITOR.cleanWord.createStyleStack( element, filterMock );
			assert.areSame( '<p style="font-family:Arial; margin-bottom:0pt"><span style="font-size:16pt">Test</span></p>', element.getOuterHtml() );
		},
		'test push styles lower': function() {
			var ol = new CKEDITOR.htmlParser.element( 'ol' ),
				li = new CKEDITOR.htmlParser.element( 'li' );

			ol.attributes.style = 'list-style-type: lower-alpha;font-family: "Calibri"; font-size: 36pt; color: yellow';
			ol.add( li );

			CKEDITOR.cleanWord.pushStylesLower( ol );
			assert.areSame( '<ol style="list-style-type:lower-alpha"><li style="font-family:&quot;Calibri&quot;; font-size:36pt; color:yellow"></li></ol>', ol.getOuterHtml() );
		},
		'test set symbol ul 1': function() {
			var elements = [
				new CKEDITOR.htmlParser.element( 'ul' ),
				new CKEDITOR.htmlParser.element( 'ul' )
			];

			for ( var i = 0; i < elements.length; i++ ) {
				CKEDITOR.cleanWord.setSymbol( elements[ i ], '·', i + 1 );
			}

			assert.areSame( '<ul></ul>', elements[0].getOuterHtml() );
			assert.areSame( '<ul style="list-style-type:disc"></ul>', elements[1].getOuterHtml() );
		},
		'test set symbol ul 2': function() {
			var elements = [
				new CKEDITOR.htmlParser.element( 'ul' ),
				new CKEDITOR.htmlParser.element( 'ul' )
			];

			// Explicit style declarations have priority over setSymbol().
			elements[ 0 ].attributes.style = 'list-style-type: disc';
			elements[ 1 ].attributes.style = 'list-style-type: disc';

			CKEDITOR.cleanWord.setSymbol( elements[ 0 ], 'o', 1 );
			CKEDITOR.cleanWord.setSymbol( elements[ 1 ], 'o', 2 );

			assert.areSame( '<ul></ul>', elements[0].getOuterHtml() );
			assert.areSame( '<ul style="list-style-type:disc"></ul>', elements[1].getOuterHtml() );
		},
		'test remove list symbol 1': function() {
			var html = '<cke:li cke-list-level="1" cke-symbol="1.">1.       This</cke:li>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			CKEDITOR.cleanWord.removeListSymbol( element );

			assert.areSame( '<cke:li cke-list-level="1" cke-symbol="1."> This</cke:li>', element.getOuterHtml() );
		},
		'test remove list symbol 2': function() {
			var html = '<cke:li cke-list-level="1" cke-symbol="1."><span style="font-family:Calibri">1.       This</span></cke:li>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			CKEDITOR.cleanWord.removeListSymbol( element );

			assert.areSame( '<cke:li cke-list-level="1" cke-symbol="1."><span style="font-family:Calibri"> This</span></cke:li>', element.getOuterHtml() );
		},
		// This test may break depending on the browser due to different sorting algorithms used.
		'test sort styles': function() {
			var html = '<p style="font-size:48pt; background:yellow; font-family:Courier">Test</p>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			CKEDITOR.cleanWord.sortStyles( element );

			assert.areSame( '<p style="font-size:48pt; background:yellow; font-family:Courier">Test</p>', element.getOuterHtml() );
		},
		'test stack attributes': function() {
			var html = '<font face="Arial" color="#faebd7" size="4">There is <em>content</em> here</font>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			CKEDITOR.cleanWord.createAttributeStack( element, filterMock );

			assert.areSame( '<font face="Arial"><font color="#faebd7"><font size="4">There is <em>content</em> here</font></font></font>', element.getOuterHtml() );
		}
	} );
} )();
