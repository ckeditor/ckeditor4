/* bender-tags: editor,dom */
( function() {
	var body = CKEDITOR.document.getBody(),
		wrapper = new CKEDITOR.dom.element( 'div' );

	body.append( wrapper );

	bender.test( {
		setUp: function() {
			wrapper.setHtml( '' );
		},

		'test isDetached when element isn\'t in DOM': function() {
			var element = new CKEDITOR.dom.element( 'div' );

			assert.isTrue( element.isDetached() );
			assert.isFalse( wrapper.isDetached() );

			element.remove();
		},

		'test isDetached when element is in DOM': function() {
			var element = new CKEDITOR.dom.element( 'div' );

			wrapper.append( element );

			assert.isFalse( element.isDetached() );
			assert.isFalse( wrapper.isDetached() );

			element.remove();
		},

		'test isDetached when elements parent isn\'t in DOM': function() {
			var outerElement = new CKEDITOR.dom.element( 'div' ),
				element = new CKEDITOR.dom.element( 'div' );

			outerElement.append( element );

			assert.isTrue( outerElement.isDetached() );
			assert.isTrue( element.isDetached() );
			assert.isFalse( wrapper.isDetached() );

			outerElement.remove();
		},

		'test isDetached when elements parent is in DOM': function() {
			var outerElement = new CKEDITOR.dom.element( 'div' ),
				element = new CKEDITOR.dom.element( 'div' );

			outerElement.append( element );
			wrapper.append( outerElement );

			assert.isFalse( outerElement.isDetached() );
			assert.isFalse( element.isDetached() );
			assert.isFalse( wrapper.isDetached() );

			outerElement.remove();
		},

		'test isDetached when elements ancestor isn\'t in DOM': function() {
			var outerElement = CKEDITOR.dom.element.createFromHtml( '<div id="outer"><div><div><div id="inner"></div></div></div></div>' );

			assert.isTrue( outerElement.isDetached() );
			assert.isTrue( outerElement.findOne( '#inner' ).isDetached() );
			assert.isFalse( wrapper.isDetached() );

			outerElement.remove();
		},

		'test isDetached when elements ancestor is in DOM': function() {
			var outerElement = CKEDITOR.dom.element.createFromHtml( '<div id="outer"><div><div><div id="inner"></div></div></div></div>' );

			wrapper.append( outerElement );

			assert.isFalse( outerElement.isDetached() );
			assert.isFalse( outerElement.findOne( '#inner' ).isDetached() );
			assert.isFalse( wrapper.isDetached() );

			outerElement.remove();
		},

		'test is not detached for active document': function() {
			var doc = new CKEDITOR.dom.document( document ),
				docElement = doc.getDocumentElement();

			assert.isFalse( docElement.isDetached() );
		},

		'test isDetached for a new document': function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}

			var detachedDocument = new CKEDITOR.dom.document( document.implementation.createHTMLDocument( 'detached document' ) ),
				documentElement = detachedDocument.getDocumentElement();

			assert.isTrue( documentElement.isDetached() );
		},

		'test isDetached for a child in a new detached document': function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}

			var detachedDocument = new CKEDITOR.dom.document( document.implementation.createHTMLDocument( 'detached document' ) ),
				bodyElement = detachedDocument.getBody(),
				el = CKEDITOR.dom.element.createFromHtml( '<p>Test</p>' );

			bodyElement.append( el );

			assert.isTrue( el.getDocument().equals( detachedDocument ) );
			assert.isTrue( el.isDetached() );
		}
	} );
} )();
