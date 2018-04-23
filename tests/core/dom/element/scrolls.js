/* bender-tags: editor */

( function() {
	'use strict';

	var helpers = {
		resetScrolls: function( obj ) {
			this.setNativeScroll( obj, 0, 0 );
		},
		setNativeScroll: function( obj, top, left ) {
			obj.scrollLeft = left;
			obj.scrollTop = top;
		},
		assertBothScrolls: function( expected, actual, message ) {
			assert.areSame( expected.left, actual.scrollLeft, message + ' (Scroll Left)' );
			assert.areSame( expected.top, actual.scrollTop, message + ' (Scroll Top)' );
		},
		/**
		 * @param element {CKEDTOR.dom.element}
		 * @param doc {CKEDTOR.dom.document}
		 * @param expected {Array} meaning of 4 values in array -> [ elementTop, elementLeft, documentTop, documentLeft ]
		 */
		assertAllScrolls: function( element, doc, expected ) {
			this.assertBothScrolls( { left: expected[ 1 ], top: expected[ 0 ] }, element.getScrollPosition(), '`element.getScrollPosition` should return equal values' );
			this.assertBothScrolls( { left: expected[ 3 ], top: expected[ 2 ] }, doc.getScrollPosition(), '`document.getScrollPosition` should return equal values' );
			this.assertBothScrolls( { left: expected[ 3 ], top: expected[ 2 ] }, element.getDocumentScrollPosition(), '`element.getDocumentScrollPosition` should return equal values' );
		}
	};

	bender.editor = true;
	bender.test( {
		'test getScroll and getDocumentScroll for element and document': function() {
			var element = new CKEDITOR.dom.element( document.getElementById( 'small' ) ),
				doc = element.getDocument(),
				docScrollElement = doc.$.scrollingElement || doc.$.documentElement || doc.$.body;

			helpers.resetScrolls( element.$ );
			helpers.resetScrolls( docScrollElement );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );

			// document no-scroll, element scroll
			helpers.setNativeScroll( element.$, 100, 100 );
			helpers.assertAllScrolls( element, doc, [ 100, 100, 0, 0 ] );

			// document scroll, element scroll
			helpers.setNativeScroll( docScrollElement, 50, 50 );
			helpers.assertAllScrolls( element, doc, [ 100, 100, 50, 50 ] );

			// document scroll, element no-scroll
			helpers.setNativeScroll( element.$, 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 50, 50 ] );

			// document scroll, element no-scroll
			helpers.setNativeScroll( docScrollElement, 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );

		},

		'test setScrollPosition for element': function() {
			var element = new CKEDITOR.dom.element( document.getElementById( 'small' ) ),
				doc = element.getDocument();

			helpers.resetScrolls( doc.$.scrollingElement || doc.$.documentElement || doc.$.body );

			element.setScrollPosition( 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );

			element.setScrollPosition( 111, 222 );
			helpers.assertAllScrolls( element, doc, [ 111, 222, 0, 0 ] );

			element.setScrollPosition( 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 222, 0, 0 ] );

			element.setScrollPosition( 123 );
			helpers.assertAllScrolls( element, doc, [ 123, 222, 0, 0 ] );

			element.setScrollPosition( 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );
		},

		'test setScrollPosition for document': function() {
			var element = new CKEDITOR.dom.element( document.getElementById( 'small' ) ),
				doc = element.getDocument();

			helpers.resetScrolls( element.$ );

			doc.setScrollPosition( 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );

			doc.setScrollPosition( 55, 77 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 55, 77 ] );

			doc.setScrollPosition( 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 77 ] );

			doc.setScrollPosition( 33 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 33, 77 ] );

			doc.setScrollPosition( 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );

		},

		'test setDocumentScrollPosition for element': function() {
			var element = new CKEDITOR.dom.element( document.getElementById( 'small' ) ),
				doc = element.getDocument();

			helpers.resetScrolls( element.$ );

			element.setDocumentScrollPosition( 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );

			element.setDocumentScrollPosition( 87, 65 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 87, 65 ] );

			element.setDocumentScrollPosition( 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 65 ] );

			element.setDocumentScrollPosition( 43 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 43, 65 ] );

			element.setDocumentScrollPosition( 0, 0 );
			helpers.assertAllScrolls( element, doc, [ 0, 0, 0, 0 ] );
		}

	} );
} )();
