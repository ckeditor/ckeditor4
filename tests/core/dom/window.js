/* bender-tags: editor,unit,dom */

var loadCalled,
	testWindow = new CKEDITOR.dom.window( window ),
	t;

testWindow.on( 'load', function() {
		t = document.createElement( 'textarea' );
		t.id = 'fred';

		document.body.appendChild( t );

		loadCalled = true;
	} );

testWindow.on( 'beforeunload', function() {
		t.value = new Date();
	} );

bender.test( appendDomObjectTests(
	function( id ) {
		if ( id === 'domObjectTest1' )
			return new CKEDITOR.dom.window( window );

		// return different (fake) document for other ids
		return new CKEDITOR.dom.window( {} );
	},
	{
		test_loadEvent: function() {
			assert.isTrue( loadCalled );
		}
	}
) );