/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea */

// Clean up all instances been created on the page.
function removeAllInstances() {
	var allInstances = CKEDITOR.instances;
	for ( var i in allInstances ) {
		CKEDITOR.remove(  allInstances[ i ] );
	}
}

bender.test(
{
	setUp : function() {
		removeAllInstances();
	},

	test_replaceId : function() {
		CKEDITOR.replace( 'editor1' );
		assert.isObject( CKEDITOR.instances.editor1, 'editor instance not found' );
		assert.areSame( 'editor1', CKEDITOR.instances.editor1.name, 'instance name doesn\'t match' );
		assert.areSame( document.getElementById( 'editor1' ), CKEDITOR.instances.editor1.element.$, 'instance element doesn\'t match' );
	},

	test_replaceName : function() {
		CKEDITOR.replace( 'editor2' );
		assert.isObject( CKEDITOR.instances.editor2, 'editor instance not found' );
		assert.areSame( 'editor2', CKEDITOR.instances.editor2.name, 'instance name doesn\'t match' );
		assert.areSame( document.getElementsByName( 'editor2' )[ 0 ], CKEDITOR.instances.editor2.element.$, 'instance element doesn\'t match' );
	},

	test_replaceElement : function() {
		CKEDITOR.replace( document.getElementById( 'editor5' ) );
		assert.isObject( CKEDITOR.instances.editor5, 'editor instance not found' );
		assert.areSame( 'editor5', CKEDITOR.instances.editor5.name, 'instance name doesn\'t match' );
		assert.areSame( document.getElementById( 'editor5' ), CKEDITOR.instances.editor5.element.$, 'instance element doesn\'t match' );
	},


	test_replaceError : function() {
		assert.throwsError( Error, function() { CKEDITOR.replace( 'error' ); } );
	},

	test_replaceAll_Class : function() {
		CKEDITOR.replaceAll( 'myclass' );

		assert.isObject( CKEDITOR.instances.editor3, 'editor3 instance not found' );
		assert.areSame( 'editor3', CKEDITOR.instances.editor3.name, 'editor3 instance name doesn\'t match' );
		assert.areSame( document.getElementById( 'editor3' ), CKEDITOR.instances.editor3.element.$, 'editor3 instance element doesn\'t match' );

		assert.isObject( CKEDITOR.instances.editor4, 'editor4 instance not found' );
		assert.areSame( 'editor4', CKEDITOR.instances.editor4.name, 'editor4 instance name doesn\'t match' );
		assert.areSame( document.getElementsByName( 'editor4' )[ 0 ], CKEDITOR.instances.editor4.element.$, 'editor4 instance element doesn\'t match' );

		assert.isUndefined( CKEDITOR.instances.editor6, 'editor6 should be undefined' );
		assert.isUndefined( CKEDITOR.instances.editor7, 'editor7 should be undefined' );
		assert.isUndefined( CKEDITOR.instances.editor8, 'editor8 should be undefined' );
		assert.isUndefined( CKEDITOR.instances.editor8, 'editor9 should be undefined' );
	},

	test_replaceAll_Function : function() {
		CKEDITOR.replaceAll( function( textarea ) {
				return ( textarea.id != 'editor6' && textarea.id != 'editor8' );
			} );

		assert.isObject( CKEDITOR.instances.editor7, 'editor7 instance not found' );
		assert.areSame( 'editor7', CKEDITOR.instances.editor7.name, 'editor7 instance name doesn\'t match' );
		assert.areSame( document.getElementById( 'editor7' ), CKEDITOR.instances.editor7.element.$, 'editor7 instance element doesn\'t match' );

		assert.isObject( CKEDITOR.instances.editor9, 'editor9 instance not found' );
		assert.areSame( 'editor9', CKEDITOR.instances.editor9.name, 'editor9 instance name doesn\'t match' );
		assert.areSame( document.getElementById( 'editor9' ), CKEDITOR.instances.editor9.element.$, 'editor9 instance element doesn\'t match' );

		assert.isUndefined( CKEDITOR.instances.editor6, 'editor6 should be undefined' );
		assert.isUndefined( CKEDITOR.instances.editor8, 'editor8 should be undefined' );
	},

	test_replaceAll: function() {
		CKEDITOR.replaceAll();

		assert.isObject( CKEDITOR.instances.editor6, 'editor6 instance not found' );
		assert.areSame( 'editor6', CKEDITOR.instances.editor6.name, 'editor6 instance name doesn\'t match' );
		assert.areSame( document.getElementById( 'editor6' ), CKEDITOR.instances.editor6.element.$, 'editor6 instance element doesn\'t match' );

		assert.isObject( CKEDITOR.instances.editor8, 'editor8 editor instance not found' );
		assert.areSame( 'editor8', CKEDITOR.instances.editor8.name, 'editor8 instance name doesn\'t match' );
		assert.areSame( document.getElementById( 'editor8' ), CKEDITOR.instances.editor8.element.$, 'editor8 instance element doesn\'t match' );
	}
} );