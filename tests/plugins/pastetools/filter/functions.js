/* bender-tags: clipboard,pastetools */
/* bender-ckeditor-plugins: pastetools */
/* bender-include: ../_helpers/ptTools.js */
/* global ptTools */

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
		filterMock = new CKEDITOR.htmlParser.filter(),

		tests = {
			'test create style stack': function() {
				var element = new CKEDITOR.htmlParser.element( 'p' );

				element.attributes.style = 'font-family: "Calibri"; font-size: 36pt; color: yellow; background: lime';
				element.add( new CKEDITOR.htmlParser.text( 'test' ) );
				element.parent = parentMock;

				this.commonFilter.styles.createStyleStack( element, filterMock );
				assert.areSame(
					'<p><span style="font-size:36pt"><span style="background:lime"><span style="font-family:&quot;Calibri&quot;"><span style="color:yellow">test</span></span></span></span></p>',
					element.getOuterHtml()
				);
			},

			'test create style stack multiple children': function() {
				var edgeCase = '<span style="font-family:Courier;font-size:14px" ><span style="font-weight:bold">Some </span>Text</span>',
					fragment = CKEDITOR.htmlParser.fragment.fromHtml( edgeCase ),
					element = fragment.children[ 0 ];

				// The filter script was loaded in the previous test.
				this.commonFilter.styles.createStyleStack( element, filterMock );

				assert.areSame( '<span style="font-size:14px"><span style="font-family:Courier"><span style="font-weight:bold">Some </span>Text</span></span>', element.getOuterHtml() );
			},

			// Margin-bottom is a block style, so it should not be stacked.
			'test create style stack omit block styles': function() {
				var edgeCase = '<p style="font-size: 16pt;font-family: Arial;margin-bottom:10pt;">Test</p>',
					fragment = CKEDITOR.htmlParser.fragment.fromHtml( edgeCase ),
					element = fragment.children[ 0 ];

				this.commonFilter.styles.createStyleStack( element, filterMock );

				assert.areSame( '<p style="margin-bottom:13px"><span style="font-size:16pt"><span style="font-family:Arial">Test</span></span></p>', element.getOuterHtml() );
			},

			'test push styles lower': function() {
				var ol = new CKEDITOR.htmlParser.element( 'ol' ),
					li = new CKEDITOR.htmlParser.element( 'li' );

				ol.attributes.style = 'list-style-type: lower-alpha;font-family: "Calibri"; font-size: 36pt; color: yellow';
				ol.add( li );

				this.commonFilter.styles.pushStylesLower( ol );
				assert.areSame( '<ol style="list-style-type:lower-alpha"><li style="font-family:&quot;Calibri&quot;; font-size:36pt; color:yellow"></li></ol>', ol.getOuterHtml() );
			},

			// This test may break depending on the browser due to different sorting algorithms used.
			'test sort styles': function() {
				var html = '<p style="font-size:48pt; background:yellow; font-family:Courier">Test</p>',
					fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
					element = fragment.children[ 0 ];

				this.commonFilter.styles.sortStyles( element );

				assert.areSame( '<p style="font-size:48pt; background:yellow; font-family:Courier">Test</p>', element.getOuterHtml() );
			},

			'test stack attributes': function() {
				var html = '<font face="Arial" color="#faebd7" size="4">There is <em>content</em> here</font>',
					fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
					element = fragment.children[ 0 ];

				this.commonFilter.createAttributeStack( element, filterMock );

				assert.areSame( '<font face="Arial"><font color="#faebd7"><font size="4">There is <em>content</em> here</font></font></font>', element.getOuterHtml() );
			}
		};

	ptTools.ignoreTestsOnMobiles( tests );

	ptTools.testWithFilters( tests, [
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js' ),
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastefromword' ) + 'filter/default.js' )
	], function( testCase ) {
		testCase.commonFilter = CKEDITOR.plugins.pastetools.filters.common;
	} );
} )();
