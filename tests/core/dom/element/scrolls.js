/* bender-tags: editor */

( function() {
	'use strict';
	bender.editor = true;
	bender.test( {
		_assertBothScrolls: function( expected, actual ) {
			assert.areSame( expected.x, actual.scrollLeft );
			assert.areSame( expected.y, actual.scrollTop );
		},

		'test getDocumentScrollPosition': function() {
			var element = document.getElementById( 'small' ),
				ckEl = new CKEDITOR.dom.element( element ),
				doc,
				docEl;
			// Reset position with native methods
			doc = ckEl.getDocument();
			docEl = doc.$.scrollingElement || doc.$.documentElement || doc.$.body;
			docEl.scrollTop = 0;
			docEl.scrollLeft = 0;
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;

			// document no-scroll, element no-scroll
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScrollPosition() );

			// document no-scroll, element scroll
			ckEl.$.scrollTop = 123;
			ckEl.$.scrollLeft = 123;
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScrollPosition() );

			// document scroll, element scroll
			docEl.scrollTop = 20;
			docEl.scrollLeft = 20;
			this._assertBothScrolls( { x: 20, y: 20 }, ckEl.getDocumentScrollPosition() );

			// document scroll, element no-scroll
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;
			this._assertBothScrolls( { x: 20, y: 20 }, ckEl.getDocumentScrollPosition() );
		},

		'test getScrollPosition': function() {
			var element = document.getElementById( 'small' ),
				ckEl = new CKEDITOR.dom.element( element ),
				doc,
				docEl;

			// Reset position with native methods
			doc = ckEl.getDocument();
			docEl = doc.$.scrollingElement || doc.$.documentElement || doc.$.body;
			docEl.scrollTop = 0;
			docEl.scrollLeft = 0;
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;

			// document no-scroll, element no-scroll
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScrollPosition() );

			// document no-scroll, element scroll
			ckEl.$.scrollTop = 321;
			ckEl.$.scrollLeft = 321;
			this._assertBothScrolls( { x: 321, y: 321 }, ckEl.getScrollPosition() );

			// document scroll, element scroll
			docEl.scrollTop = 20;
			docEl.scrollLeft = 20;
			this._assertBothScrolls( { x: 321, y: 321 }, ckEl.getScrollPosition() );

			// document scroll, element no-scroll
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScrollPosition() );
		},

		'test setDocumentScrollPosition': function() {
			var element = document.getElementById( 'small' ),
				ckEl = new CKEDITOR.dom.element( element );

			ckEl.setDocumentScrollPosition( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScrollPosition() );

			ckEl.setDocumentScrollPosition( 100 );
			this._assertBothScrolls( { x: 0, y: 100 }, ckEl.getDocumentScrollPosition() );

			ckEl.setDocumentScrollPosition( 123, 23 );
			this._assertBothScrolls( { x: 23, y: 123 }, ckEl.getDocumentScrollPosition() );

			ckEl.setDocumentScrollPosition( 0 );
			this._assertBothScrolls( { x: 23, y: 0 }, ckEl.getDocumentScrollPosition() );

			ckEl.setDocumentScrollPosition( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScrollPosition() );
		},

		'test setScrollPosition': function() {
			var element = document.getElementById( 'small' ),
				ckEl = new CKEDITOR.dom.element( element );

			ckEl.setScrollPosition( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScrollPosition() );

			ckEl.setScrollPosition( 100 );
			this._assertBothScrolls( { x: 0, y: 100 }, ckEl.getScrollPosition() );

			ckEl.setScrollPosition( 123, 23 );
			this._assertBothScrolls( { x: 23, y: 123 }, ckEl.getScrollPosition() );

			ckEl.setScrollPosition( 0 );
			this._assertBothScrolls( { x: 23, y: 0 }, ckEl.getScrollPosition() );

			ckEl.setScrollPosition( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScrollPosition() );
		}

	} );
} )();
