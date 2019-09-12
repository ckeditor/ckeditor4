/* bender-tags: editor,dom */
( function() {
	var body = CKEDITOR.document.getBody(),
		wrapper = new CKEDITOR.dom.element( 'div' );

	body.append( wrapper );

	bender.test( {
		setUp: function() {
			wrapper.setHtml( '' );
		},

		// (#3124)
		'test isDetached when element isn\'t in DOM': function() {
			var element = new CKEDITOR.dom.element( 'div' );

			assert.isTrue( element.isDetached() );
			assert.isFalse( wrapper.isDetached() );

			element.remove();
		},

		// (#3124)
		'test isDetached when element is in DOM': function() {
			var element = new CKEDITOR.dom.element( 'div' );

			wrapper.append( element );

			assert.isFalse( element.isDetached() );
			assert.isFalse( wrapper.isDetached() );

			element.remove();
		},

		// (#3124)
		'test isDetached when elements parent isn\'t in DOM': function() {
			var outerElement = new CKEDITOR.dom.element( 'div' ),
				element = new CKEDITOR.dom.element( 'div' );

			outerElement.append( element );

			assert.isTrue( outerElement.isDetached() );
			assert.isTrue( element.isDetached() );
			assert.isFalse( wrapper.isDetached() );

			outerElement.remove();
		},

		// (#3124)
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

		// (#3124)
		'test isDetached when elements ancestor isn\'t in DOM': function() {
			var outerElement = CKEDITOR.dom.element.createFromHtml( '<div id="outer"><div><div><div id="inner"></div></div></div></div>' );

			assert.isTrue( outerElement.isDetached() );
			assert.isTrue( outerElement.findOne( '#inner' ).isDetached() );
			assert.isFalse( wrapper.isDetached() );

			outerElement.remove();
		},

		// (#3124)
		'test isDetached when elements ancestor is in DOM': function() {
			var outerElement = CKEDITOR.dom.element.createFromHtml( '<div id="outer"><div><div><div id="inner"></div></div></div></div>' );

			wrapper.append( outerElement );

			assert.isFalse( outerElement.isDetached() );
			assert.isFalse( outerElement.findOne( '#inner' ).isDetached() );
			assert.isFalse( wrapper.isDetached() );

			outerElement.remove();
		}
	} );
} )();
