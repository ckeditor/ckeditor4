/* bender-tags: editor */

( function() {
	'use strict';
	bender.editor = true;
	bender.test( {
		'test getDocumentScroll': function() {
			var element = document.getElementById( 'small' );
			var ckEl = new CKEDITOR.dom.element( element );
			var doc, docEl, result;

			// Reset position with native methods
			doc = ckEl.getDocument();
			docEl = doc.$.documentElement || doc.$.body;
			docEl.scrollTop = 0;
			docEl.scrollLeft = 0;
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;

			// document no-scroll, element no-scroll
			result = ckEl.getDocumentScroll();
			assert.areSame( 0, result.scrollTop );
			assert.areSame( 0, result.scrollLeft );

			// document no-scroll, element scroll
			ckEl.$.scrollTop = 123;
			ckEl.$.scrollLeft = 123;
			result = ckEl.getDocumentScroll();
			assert.areSame( 0, result.scrollTop );
			assert.areSame( 0, result.scrollLeft );

			// document scroll, element scroll
			docEl.scrollTop = 20;
			docEl.scrollLeft = 20;
			result = ckEl.getDocumentScroll();
			assert.areSame( 20, result.scrollTop );
			assert.areSame( 20, result.scrollLeft );

			// document scroll, element no-scroll
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;
			result = ckEl.getDocumentScroll();
			assert.areSame( 20, result.scrollTop );
			assert.areSame( 20, result.scrollLeft );
		},

		'test getScroll': function() {
			var element = document.getElementById( 'small' );
			var ckEl = new CKEDITOR.dom.element( element );
			var doc, docEl, result;

			// Reset position with native methods
			doc = ckEl.getDocument();
			docEl = doc.$.documentElement || doc.$.body;
			docEl.scrollTop = 0;
			docEl.scrollLeft = 0;
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;

			// document no-scroll, element no-scroll
			result = ckEl.getScroll();
			assert.areSame( 0, result.scrollTop );
			assert.areSame( 0, result.scrollLeft );

			// document no-scroll, element scroll
			ckEl.$.scrollTop = 321;
			ckEl.$.scrollLeft = 321;
			result = ckEl.getScroll();
			assert.areSame( 321, result.scrollTop );
			assert.areSame( 321, result.scrollLeft );

			// document scroll, element scroll
			doc = ckEl.getDocument();
			docEl = doc.$.documentElement || doc.$.body;
			docEl.scrollTop = 20;
			docEl.scrollLeft = 20;
			result = ckEl.getScroll();
			assert.areSame( 321, result.scrollTop );
			assert.areSame( 321, result.scrollLeft );

			// document scroll, element no-scroll
			ckEl.$.scrollTop = 0;
			ckEl.$.scrollLeft = 0;
			result = ckEl.getScroll();
			assert.areSame( 0, result.scrollTop );
			assert.areSame( 0, result.scrollLeft );
		},

		'test setDocumentScroll': function() {
			var element = document.getElementById( 'small' );
			var ckEl = new CKEDITOR.dom.element( element );

			ckEl.setDocumentScroll( 0, 0 );
			assert.areSame( 0, ckEl.getDocumentScroll().scrollTop );
			assert.areSame( 0, ckEl.getDocumentScroll().scrollLeft );

			ckEl.setDocumentScroll( 100 );
			assert.areSame( 100, ckEl.getDocumentScroll().scrollTop );
			assert.areSame( 0, ckEl.getDocumentScroll().scrollLeft );

			ckEl.setDocumentScroll( 123, 23 );
			assert.areSame( 123, ckEl.getDocumentScroll().scrollTop );
			assert.areSame( 23, ckEl.getDocumentScroll().scrollLeft );

			ckEl.setDocumentScroll( 0 );
			assert.areSame( 0, ckEl.getDocumentScroll().scrollTop );
			assert.areSame( 23, ckEl.getDocumentScroll().scrollLeft );

			ckEl.setDocumentScroll( 0, 0 );
			assert.areSame( 0, ckEl.getDocumentScroll().scrollTop );
			assert.areSame( 0, ckEl.getDocumentScroll().scrollLeft );
		},

		'test setScroll': function() {
			var element = document.getElementById( 'small' );
			var ckEl = new CKEDITOR.dom.element( element );

			ckEl.setScroll( 0, 0 );
			assert.areSame( 0, ckEl.getScroll().scrollTop );
			assert.areSame( 0, ckEl.getScroll().scrollLeft );

			ckEl.setScroll( 100 );
			assert.areSame( 100, ckEl.getScroll().scrollTop );
			assert.areSame( 0, ckEl.getScroll().scrollLeft );

			ckEl.setScroll( 123, 23 );
			assert.areSame( 123, ckEl.getScroll().scrollTop );
			assert.areSame( 23, ckEl.getScroll().scrollLeft );

			ckEl.setScroll( 0 );
			assert.areSame( 0, ckEl.getScroll().scrollTop );
			assert.areSame( 23, ckEl.getScroll().scrollLeft );

			ckEl.setScroll( 0, 0 );
			assert.areSame( 0, ckEl.getScroll().scrollTop );
			assert.areSame( 0, ckEl.getScroll().scrollLeft );
		}

	} );
} )();
