( function() {
	var destroyBtn = CKEDITOR.document.getById( 'destroy' ),
		createBtn = CKEDITOR.document.getById( 'create' ),
		editor1 = null;

	function destroyEditor() {
		editor1.destroy();
		editor1 = null;

		createBtn.on( 'click', createEditor );
		destroyBtn.removeListener( 'click', destroyEditor );
	}

	function createEditor() {
		editor1 = CKEDITOR.replace( 'editor1', {
			resize_dir: 'both'
		} );

		editor1.on( 'instanceReady', function() {
			try {
				var dim = JSON.parse( localStorage.getItem( 'dimensions' ) );
			} catch ( e ) {
				return;
			}

			if ( dim ) {
				editor1.resize( dim.outerWidth, dim.outerHeight );
			}

			editor1.on( 'resize', function( e ) {
				localStorage.setItem( 'dimensions', JSON.stringify( e.data ) );
			} );

			destroyBtn.on( 'click', destroyEditor );
			createBtn.removeListener( 'click', createEditor );
		} );
	}

	createEditor();
}() );