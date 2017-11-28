/* bender-tags: editor */

( function() {
	'use strict';
	bender.editor = true;
	bender.test( {
		_assertBothScrolls: function( expected, actual ) {
			assert.areSame( expected.x, actual.scrollLeft );
			assert.areSame( expected.y, actual.scrollTop );
		},

		'test getDocumentScroll': function() {
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
			assert.areSame( 0, ckEl.getDocumentScroll( true ) );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScroll() );

			// document no-scroll, element scroll
			ckEl.$.scrollTop = 123;
			ckEl.$.scrollLeft = 123;
			assert.areSame( 0, ckEl.getDocumentScroll( true ) );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScroll() );

			// document scroll, element scroll
			docEl.scrollTop = 20;
			docEl.scrollLeft = 20;
			assert.areSame( 20, ckEl.getDocumentScroll( true ) );
			this._assertBothScrolls( { x: 20, y: 20 }, ckEl.getDocumentScroll() );

			// document scroll, element no-scroll
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;
			assert.areSame( 20, ckEl.getDocumentScroll( true ) );
			this._assertBothScrolls( { x: 20, y: 20 }, ckEl.getDocumentScroll() );
		},

		'test getScroll': function() {
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
			assert.areSame( 0, ckEl.getScroll( true ) );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScroll() );

			// document no-scroll, element scroll
			ckEl.$.scrollTop = 321;
			ckEl.$.scrollLeft = 321;
			assert.areSame( 321, ckEl.getScroll( true ) );
			this._assertBothScrolls( { x: 321, y: 321 }, ckEl.getScroll() );

			// document scroll, element scroll
			docEl.scrollTop = 20;
			docEl.scrollLeft = 20;
			assert.areSame( 321, ckEl.getScroll( true ) );
			this._assertBothScrolls( { x: 321, y: 321 }, ckEl.getScroll() );

			// document scroll, element no-scroll
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;
			assert.areSame( 0, ckEl.getScroll( true ) );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScroll() );
		},

		'test setDocumentScroll': function() {
			var element = document.getElementById( 'small' ),
				ckEl = new CKEDITOR.dom.element( element );

			ckEl.setDocumentScroll( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScroll() );

			ckEl.setDocumentScroll( 100 );
			this._assertBothScrolls( { x: 0, y: 100 }, ckEl.getDocumentScroll() );

			ckEl.setDocumentScroll( 123, 23 );
			this._assertBothScrolls( { x: 23, y: 123 }, ckEl.getDocumentScroll() );

			ckEl.setDocumentScroll( 0 );
			this._assertBothScrolls( { x: 23, y: 0 }, ckEl.getDocumentScroll() );

			ckEl.setDocumentScroll( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getDocumentScroll() );
		},

		'test setScroll': function() {
			var element = document.getElementById( 'small' ),
				ckEl = new CKEDITOR.dom.element( element );

			ckEl.setScroll( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScroll() );

			ckEl.setScroll( 100 );
			this._assertBothScrolls( { x: 0, y: 100 }, ckEl.getScroll() );

			ckEl.setScroll( 123, 23 );
			this._assertBothScrolls( { x: 23, y: 123 }, ckEl.getScroll() );

			ckEl.setScroll( 0 );
			this._assertBothScrolls( { x: 23, y: 0 }, ckEl.getScroll() );

			ckEl.setScroll( 0, 0 );
			this._assertBothScrolls( { x: 0, y: 0 }, ckEl.getScroll() );
		}

	} );
} )();
