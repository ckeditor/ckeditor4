/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax */
/* bender-include: ../../../plugins/clipboard/_helpers/pasting.js,  ../../../../plugins/pastefromword/filter/default.js */
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
		setUp: function(  ) {
			// Map PFW namespaces, so it's more convenient to use them.
			this.pastefromword = CKEDITOR.plugins.pastefromword;
			this.lists = this.pastefromword.lists;
		},

		'test create style stack': function() {
			var element = new CKEDITOR.htmlParser.element( 'p' ),
				that = this;
			element.attributes.style = 'font-family: "Calibri"; font-size: 36pt; color: yellow; background: lime';
			element.add( new CKEDITOR.htmlParser.text( 'test' ) );
			element.parent = parentMock;

			// Pasting used only to load the filter script.
			assertPasteEvent( this.editor, { dataValue: '<w:WordDocument></w:WordDocument>' }, function() {
				that.pastefromword.styles.createStyleStack( element, filterMock );
				assert.areSame(
					'<p><span style="font-size:36pt"><span style="background:lime"><span style="font-family:&quot;Calibri&quot;"><span style="color:yellow">test</span></span></span></span></p>',
					element.getOuterHtml()
				);
			}, null, true );
		},
		'test create style stack multiple children': function() {
			var edgeCase = '<span style="font-family:Courier;font-size:14px" ><span style="font-weight:bold">Some </span>Text</span>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( edgeCase ),
				element = fragment.children[ 0 ];

			// The filter script was loaded in the previous test.
			this.pastefromword.styles.createStyleStack( element, filterMock );
			assert.areSame( '<span style="font-size:14px"><span style="font-family:Courier"><span style="font-weight:bold">Some </span>Text</span></span>', element.getOuterHtml() );
		},
		// Margin-bottom is a block style, so it should not be stacked.
		'test create style stack omit block styles': function() {
			var edgeCase = '<p style="font-size: 16pt;font-family: Arial;margin-bottom:0pt;">Test</p>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( edgeCase ),
				element = fragment.children[ 0 ];

			this.pastefromword.styles.createStyleStack( element, filterMock );
			assert.areSame( '<p style="margin-bottom:0pt"><span style="font-size:16pt"><span style="font-family:Arial">Test</span></span></p>', element.getOuterHtml() );
		},
		'test push styles lower': function() {
			var ol = new CKEDITOR.htmlParser.element( 'ol' ),
				li = new CKEDITOR.htmlParser.element( 'li' );

			ol.attributes.style = 'list-style-type: lower-alpha;font-family: "Calibri"; font-size: 36pt; color: yellow';
			ol.add( li );

			this.pastefromword.styles.pushStylesLower( ol );
			assert.areSame( '<ol style="list-style-type:lower-alpha"><li style="font-family:&quot;Calibri&quot;; font-size:36pt; color:yellow"></li></ol>', ol.getOuterHtml() );
		},
		'test set symbol ul 1': function() {
			var elements = [
				new CKEDITOR.htmlParser.element( 'ul' ),
				new CKEDITOR.htmlParser.element( 'ul' )
			];

			for ( var i = 0; i < elements.length; i++ ) {
				this.lists.setListSymbol( elements[ i ], '·', i + 1 );
			}

			assert.areSame( '<ul></ul>', elements[0].getOuterHtml() );
			assert.areSame( '<ul style="list-style-type:disc"></ul>', elements[1].getOuterHtml() );
		},
		'test set symbol ul 2': function() {
			var elements = [
				new CKEDITOR.htmlParser.element( 'ul' ),
				new CKEDITOR.htmlParser.element( 'ul' )
			];

			// Explicit style declarations have priority over setListSymbol().
			elements[ 0 ].attributes.style = 'list-style-type: disc';
			elements[ 1 ].attributes.style = 'list-style-type: disc';

			this.lists.setListSymbol( elements[ 0 ], 'o', 1 );
			this.lists.setListSymbol( elements[ 1 ], 'o', 2 );

			assert.areSame( '<ul></ul>', elements[0].getOuterHtml() );
			assert.areSame( '<ul style="list-style-type:disc"></ul>', elements[1].getOuterHtml() );
		},
		'test remove list symbol 1': function() {
			var html = '<cke:li cke-list-level="1" cke-symbol="1.">1.       This</cke:li>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			this.lists.removeSymbolText( element );

			assert.areSame( '<cke:li cke-list-level="1" cke-symbol="1."> This</cke:li>', element.getOuterHtml() );
		},
		'test remove list symbol 2': function() {
			var html = '<cke:li cke-list-level="1" cke-symbol="1."><span style="font-family:Calibri">1.       This</span></cke:li>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			this.lists.removeSymbolText( element );

			assert.areSame( '<cke:li cke-list-level="1" cke-symbol="1."><span style="font-family:Calibri"> This</span></cke:li>', element.getOuterHtml() );
		},
		// This test may break depending on the browser due to different sorting algorithms used.
		'test sort styles': function() {
			var html = '<p style="font-size:48pt; background:yellow; font-family:Courier">Test</p>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			this.pastefromword.styles.sortStyles( element );

			assert.areSame( '<p style="font-size:48pt; background:yellow; font-family:Courier">Test</p>', element.getOuterHtml() );
		},
		'test stack attributes': function() {
			var html = '<font face="Arial" color="#faebd7" size="4">There is <em>content</em> here</font>',
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				element = fragment.children[ 0 ];

			CKEDITOR.plugins.pastefromword.createAttributeStack( element, filterMock );

			assert.areSame( '<font face="Arial"><font color="#faebd7"><font size="4">There is <em>content</em> here</font></font></font>', element.getOuterHtml() );
		},
		'test supportFields comment': function() {
			/*jshint nonbsp:false */
			var html = '<!--[if supportFields]><span lang=DE><span style=\'mso-element:' +
			'field-begin\'></span><span style=\'mso-spacerun:yes\'> </span>TOC \\o' +
			'&quot;1-3&quot; \\h \\z \\u <span style=\'mso-element:field-separator\'></span></span><![endif]-->',
				inComment = 0;
			/*jshint nonbsp:true */

			var fragment = CKEDITOR.htmlParser.fragment.fromHtml( html );

			var filter = new CKEDITOR.htmlParser.filter( {
				comment: function( element ) {
					if ( element == '[if supportFields]' ) {
						inComment++;
					}
					if ( element == '[endif]' ) {
						inComment = inComment > 0 ? inComment - 1 : 0;
					}
					return false;
				},
				text: function( content ) {
					if ( inComment ) {
						return '';
					}
					return content.replace( /&nbsp;/g, ' ' );
				}
			} );

			var writer = new CKEDITOR.htmlParser.basicWriter();

			filter.applyTo( fragment );
			fragment.writeHtml( writer );

			assert.areSame( CKEDITOR.cleanWord( html, this.editor ), writer.getHtml() );
		},
		'test dissolving lists': function() {
			var editorStub = {
					fire: sinon.stub(),
					config: {}
				};

			var html = '<p class="MsoNormal"><span style="color:red">The list below does not copy + paste correctly:<o:p></o:p></span></p>' +
						'<p class="MsoNormal" style="margin-left:.25in"><span lang="EN-GB" style="font-size: 8.0pt;mso-ansi-language:EN-GB"><o:p>&nbsp;</o:p></span></p>' +
						'<p class="MsoNormal" style="margin-left:.25in"><span lang="EN-GB" style="font-size: 8.0pt;mso-ansi-language:EN-GB"><o:p>&nbsp;</o:p></span></p>' +
						'<p class="MsoNormal" style="margin-left:.5in;text-indent:-.25in;mso-list:l1 level1 lfo1;' +
						'tab-stops:list .5in"><!--[if !supportLists]--><span lang="EN-GB" style="font-size:' +
						'8.0pt;font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;;' +
						'mso-ansi-language:EN-GB"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;' +
						'</span></span></span><!--[endif]--><span lang="EN-GB" style="font-size:8.0pt;' +
						'mso-ansi-language:EN-GB">This line is size 8, TNR<o:p></o:p></span></p>' +
						'<ul style="margin-top:0in" type="circle">' +
						' <li class="MsoNormal" style="mso-list:l1 level1 lfo1;tab-stops:list .5in"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Georgia&quot;,serif;mso-ansi-language:' +
						'     EN-GB">This one is size 10, <st1:country-region w:st="on"><st1:place w:st="on">Georgia</st1:place></st1:country-region><o:p></o:p></span></li>' +
						' <ul style="margin-top:0in" type="circle">' +
						'  <li class="MsoNormal" style="mso-list:l1 level2 lfo1;tab-stops:list 1.0in"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Courier New&quot;;mso-ansi-language:' +
						'      EN-GB">This one is size 10, Courier new<o:p></o:p></span></li>' +
						'  <li class="MsoNormal" style="mso-list:l1 level2 lfo1;tab-stops:list 1.0in"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Verdana&quot;,sans-serif;' +
						'      mso-ansi-language:EN-GB">This one is size 10<o:p></o:p></span></li>' +
						' </ul>' +
						'</ul>' +
						'<p class="MsoNormal"><span style="color:green"><o:p>&nbsp;</o:p></span></p>';

			assert.beautified.html( '<p><span style="color:red">The list below does not copy + paste correctly:</span></p>' +
				'<p style="margin-left:.25in"><span lang="EN-GB" style="font-size:8.0pt"></span></p>' +
				'<p style="margin-left:.25in"><span lang="EN-GB" style="font-size:8.0pt"></span></p>' +
				'<ul style="list-style-type:circle">' +
				'<li><span style="tab-stops:list .5in"><span lang="EN-GB" style="font-size:8.0pt"></span>' +
				'<span lang="EN-GB" style="font-size:8.0pt">This line is size 8, TNR</span></span></li>' +
				'<li ><span style="tab-stops:list .5in"><span lang="EN-GB" style="font-size:10.0pt">' +
				'<span style="font-family:&quot;Georgia&quot;,serif">This one is size 10, <st1:country-region w:st="on"><st1:place w:st="on">Georgia</st1:place></st1:country-region>' +
				'</span></span></span>' +
				'<ul style="list-style-type:circle"><li ><span style="tab-stops:list 1.0in"><span lang="EN-GB" style="font-size:10.0pt">' +
				'<span style="font-family:&quot;Courier New&quot;">This one is size 10, Courier new</span></span></span></li>' +
				'<li ><span style="tab-stops:list 1.0in"><span lang="EN-GB" style="font-size:10.0pt">' +
				'<span style="font-family:&quot;Verdana&quot;,sans-serif">This one is size 10</span></span></span></li></ul></li></ul>' +
				'<p><span style="color:green"></span></p>',
				CKEDITOR.cleanWord( html, editorStub ), { sortAttributes: true } );
		},

		'test isAListContinuation': function() {
			var lastListItem = this.getParserElementsFrom( 'isAListContinuation1' ).children[ 3 ];

			assert.isTrue( this.lists.isAListContinuation( lastListItem ) );

			// Now insert a paragraph in between.
			var paragraph = this.getParserElementsFrom( 'isAListContinuation2' ),
				// And prepare a list item that will get inserted later on.
				sameLevelButDifferentId = paragraph.next.children[ 0 ];

			paragraph.insertBefore( lastListItem );

			assert.isFalse( this.lists.isAListContinuation( lastListItem ) );

			paragraph.remove();

			// Now this list item has the same level, but a different list id - so it should interrupt it.
			sameLevelButDifferentId.insertBefore( lastListItem );

			assert.isFalse( this.lists.isAListContinuation( lastListItem ) );
		},

		'test cleanup': function() {
			var listItems = this.getParserElementsFrom( 'isAListContinuation1' ).children;

			this.lists.cleanup( listItems );

			assert.isUndefined( listItems[ 0 ].attributes[ 'cke-list-level' ], 'First list item cke-list-level' );
			assert.isUndefined( listItems[ 0 ].attributes[ 'cke-symbol' ], 'First list item cke-symbol' );
			assert.isUndefined( listItems[ 0 ].attributes[ 'cke-list-id' ], 'First list item cke-list-id' );
			assert.isUndefined( listItems[ 0 ].attributes[ 'cke-indentation' ], 'First list item cke-indentation' );

			assert.isNotUndefined( listItems[ 0 ].attributes.style, 'First list style attribute' );

			assert.isUndefined( listItems[ 0 ].attributes[ 'cke-dissolved' ], 'Second list item cke-dissolved' );

			// Check third list item.
			assert.isUndefined( listItems[ 2 ].attributes[ 'cke-list-level' ], 'Third list item cke-list-level' );
			assert.isUndefined( listItems[ 2 ].attributes[ 'cke-symbol' ], 'Third list item cke-symbol' );
			assert.isUndefined( listItems[ 2 ].attributes[ 'cke-list-id' ], 'Third list item cke-list-id' );
			assert.isUndefined( listItems[ 2 ].attributes[ 'cke-indentation' ], 'Third list item cke-indentation' );

			// Make sure we don't remove too much.
			assert.areSame( 'aa', listItems[ 2 ].attributes[ 'cke-foo-bar' ], 'cke-foo-bar remains' );
		},

		'test calculateValue': function() {
			var listWrapper = this.getParserElementsFrom( 'calculateValue' ),
				that = this,
				removedListItem;

			assertCalculatedValue( 1, listWrapper, 0, 'calculateValue' );
			assertCalculatedValue( 2, listWrapper, 1, 'calculateValue' );
			assertCalculatedValue( 24, listWrapper, 3, 'calculateValue' );
			assertCalculatedValue( 26, listWrapper, 5, 'calculateValue' );
			assertCalculatedValue( 3, listWrapper, 8, 'calculateValue' );

			listWrapper = this.getParserElementsFrom( 'calculateValue2' );

			assertCalculatedValue( 30, listWrapper, 0, 'calculateValue2' );
			assertCalculatedValue( 31, listWrapper, 1, 'calculateValue2' );
			assertCalculatedValue( 41, listWrapper, 2, 'calculateValue2' );
			assertCalculatedValue( 42, listWrapper, 3, 'calculateValue2' );
			assertCalculatedValue( 5, listWrapper, 4, 'calculateValue2' );
			assertCalculatedValue( 8, listWrapper, 7, 'calculateValue2' );

			listWrapper = this.getParserElementsFrom( 'calculateValue3' );

			assertCalculatedValue( 10, listWrapper, 0, 'calculateValue3' );
			assertCalculatedValue( 11, listWrapper, 1, 'calculateValue3' );

			// Check removed item.
			removedListItem = listWrapper.children[ 1 ];
			removedListItem.remove();

			assert.areSame( 1, this.lists.calculateValue( removedListItem ), 'Result for a removed list item' );

			function assertCalculatedValue( expectedValue, list, itemIndex, listName ) {
				assert.areSame( expectedValue, that.pastefromword.lists.calculateValue( list.children[ itemIndex ] ),
					'Result for item ' + itemIndex + ' in list ' + listName );
			}
		},

		'test numbering.toNumber': function() {
			var toNumber = this.pastefromword.lists.numbering.toNumber;

			assert.areSame( 14, toNumber( 'XIV', 'upper-roman' ), 'Upper Roman XIV' );
			assert.areSame( 4, toNumber( 'd', 'lower-alpha' ), 'Lower alpha d' );
			assert.areSame( 35, toNumber( '35', 'decimal' ), 'Decimal 35' );
			assert.areSame( 1, toNumber( '404', 'foo' ), 'Invalid value' );
		},

		'test numbering.getStyle': function() {
			var getStyle = this.pastefromword.lists.numbering.getStyle;

			assert.areSame( 'decimal', getStyle( '4' ), '4' );
			assert.areSame( 'lower-alpha', getStyle( 'b' ), 'b' );
			assert.areSame( 'upper-alpha', getStyle( 'P' ), 'P' );
			assert.areSame( 'lower-roman', getStyle( 'i' ), 'i' );
			assert.areSame( 'upper-roman', getStyle( 'X' ), 'X' );

			assert.areSame( 'lower-roman', getStyle( 'xiv.' ), 'xiv.' );
			assert.areSame( 'decimal', getStyle( '210)' ), '210)' );

			// Cases purposely converted to lower-alpha:
			assert.areSame( 'lower-alpha', getStyle( 'c' ), 'c' );
			assert.areSame( 'upper-alpha', getStyle( 'D' ), 'D' );
		},

		// Creates CKEDITOR.htmlParser.fragment based on given element, and returns it's first child.'
		//
		// @param {string} id
		// @returns {CKEDITOR.htmlParser.node/null}
		getParserElementsFrom: function( id ) {
			return CKEDITOR.htmlParser.fragment.fromHtml( CKEDITOR.document.getById( id ).getHtml() ).children[ 0 ];
		}
	} );
} )();
