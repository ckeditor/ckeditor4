window.createInlineStyleTestCase = function( fixtureId, options ) {
	options = options || {};

	return function() {
		if ( options.ignore ) {
			assert.ignore();
		}

		var playground = CKEDITOR.document.getById( options.playground || 'playground' );

		bender.tools.testInputOut( fixtureId, function( inputHtml, expectedHtml ) {
			playground.setHtml( CKEDITOR.tools.trim( inputHtml ) );

			var rng = new CKEDITOR.dom.range( CKEDITOR.document );
			rng.selectNodeContents( playground );

			getStyle( { element: 'strong' } ).applyToRange( rng );

			assert.beautified.html( expectedHtml, playground.getHtml() );
		} );
	};

	function getStyle( definitionOrStyle, enterMode ) {
		if ( definitionOrStyle instanceof CKEDITOR.style )
			return definitionOrStyle;

		var style = new CKEDITOR.style( definitionOrStyle );

		// We need to do what stylescombo/format plugins do internally.
		style._.enterMode = enterMode || CKEDITOR.ENTER_P;

		return style;
	}
};
