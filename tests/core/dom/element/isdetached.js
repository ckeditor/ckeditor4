/* bender-tags: editor,dom */
( function() {
	var ancestor = new CKEDITOR.dom.element( 'div' ),
		parent = new CKEDITOR.dom.element( 'div' ),
		element = new CKEDITOR.dom.element( 'div' ),
		body = CKEDITOR.document.getBody();

	bender.test( {
		// (#3124)
		'test isDetached when element isn\'t in DOM': function() {
			assert.isTrue( element.isDetached() );
		},
		// (#3124)
		'test isDetached when element is in DOM': function() {
			body.append( element );
			assert.isFalse( element.isDetached() );
		},
		// (#3124)
		'test isDetached when elements parent isn\'t in DOM': function() {
			parent.append( element );
			assert.isTrue( parent.isDetached() );
			assert.isTrue( element.isDetached() );
		},
		// (#3124)
		'test isDetached when elements parent is in DOM': function() {
			body.append( parent );
			assert.isFalse( parent.isDetached() );
			assert.isFalse( element.isDetached() );
		},
		// (#3124)
		'test isDetached when elements ancestor isn\'t in DOM': function() {
			ancestor.append( element );
			assert.isTrue( ancestor.isDetached() );
			assert.isTrue( element.isDetached() );
		},
		// (#3124)
		'test isDetached when elements ancestor is in DOM': function() {
			body.append( ancestor );
			assert.isFalse( ancestor.isDetached() );
			assert.isFalse( element.isDetached() );
		}
	} );
} )();
