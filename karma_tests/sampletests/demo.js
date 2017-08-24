'use strict';

// const emojis = require( '../src/emojis' );

describe( 'Sample test suite', () => {

	console.log('asd');
	it( 'TC', () => {
		expect( true ).to.be.true;
		expect( 1 ).to.be.a( 'number' );
	} );

	it( 'Creates editor', () => {
		CKEDITOR.document.getBody().appendHtml( '<textarea id="ta">foo</textarea>' );
		CKEDITOR.replace( 'ta' );
	} );
} );