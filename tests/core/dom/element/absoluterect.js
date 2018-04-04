/* bender-tags: editor,dom */

( function() {

	bender.editor = true;

	bender.test( {
		// (#1724)
		'test element has correct absolute rect (rect1)': function() {
			var el = CKEDITOR.document.getById( 'rect1' ),
				absoluteRect = el.getClientRect( true );

			assert.isNumberInRange( absoluteRect.top, 5, 7, 'top' );
			assert.isNumberInRange( absoluteRect.bottom, 15, 17, 'bottom' );
			assert.isNumberInRange( absoluteRect.left, 4, 6, 'left' );
			assert.isNumberInRange( absoluteRect.right, 15, 17, 'right' );
			assert.isNumberInRange( absoluteRect.height, 9, 11, 'height' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.x, 4, 6, 'x' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.y, 4, 6, 'y' );
		},

		// (#1724)
		'test element has correct absolute rect (rect2)': function() {
			var el = CKEDITOR.document.getById( 'rect2' ),
				absoluteRect = el.getClientRect( true );

			assert.isNumberInRange( absoluteRect.top, 10, 12, 'top' );
			assert.isNumberInRange( absoluteRect.bottom, 30, 32, 'bottom' );
			assert.isNumberInRange( absoluteRect.left, 4, 6, 'left' );
			assert.isNumberInRange( absoluteRect.right, 19, 21, 'right' );
			assert.isNumberInRange( absoluteRect.height, 19, 21, 'height' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.x, 4, 6, 'x' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.y, 9, 11, 'y' );
		},

		// (#1724)
		'test nested iframe (1lvl) element has correct absolute rect': function() {
			var el = CKEDITOR.document.getById( 'nested' ).getFrameDocument().getById( 'rect' ),
				absoluteRect = el.getClientRect( true );

			assert.isNumberInRange( absoluteRect.top, 14, 16, 'top' );
			assert.isNumberInRange( absoluteRect.bottom, 24, 26, 'bottom' );
			assert.isNumberInRange( absoluteRect.left, 14, 16, 'left' );
			assert.isNumberInRange( absoluteRect.right, 24, 26, 'right' );
			assert.isNumberInRange( absoluteRect.height, 9, 11, 'height' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.x, 14, 17, 'x' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.y, 14, 17, 'y' );
		},

		// (#1724)
		'test nested iframe (2lvls) element has correct absolute rect': function() {
			var el = CKEDITOR.document.getById( 'deepnested' )
				.getFrameDocument().getById( 'frame' )
				.getFrameDocument().getById( 'rect' ),
				absoluteRect = el.getClientRect( true );

			assert.isNumberInRange( absoluteRect.top, 24, 26, 'top' );
			assert.isNumberInRange( absoluteRect.bottom, 34, 36, 'bottom' );
			assert.isNumberInRange( absoluteRect.left, 24, 26, 'left' );
			assert.isNumberInRange( absoluteRect.right, 34, 36, 'right' );
			assert.isNumberInRange( absoluteRect.height, 9, 11, 'height' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.x, 24, 26, 'x' );
			!CKEDITOR.env.ie && assert.isNumberInRange( absoluteRect.y, 24, 26, 'y' );
		}
	} );

} )();
