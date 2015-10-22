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
			element.attributes.style = 'font-family: "Calibri"; font-size: 36pt; color: yellow';
			element.add( new CKEDITOR.htmlParser.text( 'test' ) );
			element.parent = parentMock;


			// Pasting used only to load the filter script.
			assertPasteEvent( this.editor, { dataValue: '<w:WordDocument></w:WordDocument>' }, function() {
				CKEDITOR.cleanWord.createStyleStack( element, filterMock );
				assert.areSame( '<span style="font-size:36pt"><span style="color:yellow">test</span></span>', element.getHtml() );
			}, null, true );
		},
		'test push styles lower': function() {
			var ol = new CKEDITOR.htmlParser.element( 'ol' ),
				li = new CKEDITOR.htmlParser.element( 'li' );

			ol.attributes.style = 'list-style-type: lower-alpha;f ont-family: "Calibri"; font-size: 36pt; color: yellow';
			ol.add( li );

			// The filter script was loaded in the previous test.
			CKEDITOR.cleanWord.pushStylesLower( ol );
			assert.areSame( '<ol style="list-style-type:lower-alpha"><li style="ont-family:&quot;Calibri&quot;; font-size:36pt; color:yellow"></li></ol>', ol.getOuterHtml() );
		},
		'test set symbol ul 1': function() {
			var elements = [
				new CKEDITOR.htmlParser.element( 'ul' ),
				new CKEDITOR.htmlParser.element( 'ul' )
			];

			for ( var i = 0; i < elements.length; i++ ) {
				elements[ i ].attributes[ 'cke-list-level' ] = i + 1;
				CKEDITOR.cleanWord.setSymbol( elements[ i ], '·' );
			}

			assert.areSame( '<ul cke-list-level="1" style=""></ul>', elements[0].getOuterHtml() );
			assert.areSame( '<ul cke-list-level="2" style="list-style-type:disc"></ul>', elements[1].getOuterHtml() );
		},
		'test set symbol ul 2': function() {
			var elements = [
				new CKEDITOR.htmlParser.element( 'ul' ),
				new CKEDITOR.htmlParser.element( 'ul' )
			];

			elements[ 0 ].attributes[ 'cke-list-level' ] = 1;
			elements[ 1 ].attributes[ 'cke-list-level' ] = 2;

			// Explicit style declarations have priority over setSymbol().
			elements[ 0 ].attributes.style = 'list-style-type: disc';
			elements[ 1 ].attributes.style = 'list-style-type: disc';

			CKEDITOR.cleanWord.setSymbol( elements[ 0 ], 'o' );
			CKEDITOR.cleanWord.setSymbol( elements[ 1 ], 'o' );


			assert.areSame( '<ul cke-list-level="1" style=""></ul>', elements[0].getOuterHtml() );
			assert.areSame( '<ul cke-list-level="2" style="list-style-type:disc"></ul>', elements[1].getOuterHtml() );
		}
	} );
} )();
