/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: toolbar,clipboard */

'use strict';

bender.test( {

	'test if cache is initialized on dataTransfer creation': function() {
		var cache = new CKEDITOR.plugins.clipboard.dataTransfer()._cache;

		assert.isObject( cache, 'cache should be initialized' );
		assert.isFunction( cache.get, 'cache should provide get method' );
		assert.isFunction( cache.set, 'cache should provide set method' );
		assert.isFunction( cache.types, 'cache should provide types method' );
	},

	'test if different dataTransfer objects has different caches': function() {
		var dt1 = new CKEDITOR.plugins.clipboard.dataTransfer(),
			dt2 = new CKEDITOR.plugins.clipboard.dataTransfer();

		assert.isTrue( dt1._cache !== dt2._cache, 'caches should not be equal' );
	},

	'test get method': function() {
		var cache = new CKEDITOR.plugins.clipboard.dataTransfer()._cache;

		cache._storage = {
			'text/plain': 'text1',
			'Text': 'text2',
			'cke/id': 12345
		};

		assert.areEqual( 'text1', cache.get( 'text/plain' ), 'text/plain returns proper value' );
		assert.areEqual( 'text2', cache.get( 'Text' ), 'Text returns proper value' );
		assert.areEqual( 12345, cache.get( 'cke/id' ), 'cke/id returns proper value' );
		assert.areEqual( null, cache.get( 'non-existing-type' ), 'non existing type returns null' );

	},

	'test set method': function() {
		var cache = new CKEDITOR.plugins.clipboard.dataTransfer()._cache;

		cache.set( 'text/plain', 'foo' );
		cache.set( 'text/plain', 'foo2' );
		cache.set( 'Text', 'bar' );
		cache.set( 'cke/id', 67890 );

		objectAssert.areEqual( {
			'text/plain': 'foo2',
			'Text': 'bar',
			'cke/id': 67890
		}, cache._storage, 'all types were set properly' );
	},

	'test types method': function() {
		var cache = new CKEDITOR.plugins.clipboard.dataTransfer()._cache;

		assert.areEqual( 0, cache.types().length, 'no types in empty cache' );

		cache.set( 'text/plain', 'foo' );
		cache.set( 'text/plain', 'foo2' );
		cache.set( 'Text', 'bar' );
		cache.set( 'cke/id', 67890 );

		assertArraySameItems( [ 'text/plain', 'Text', 'cke/id' ], cache.types(), 'types method returns all types' );
	},

	'test markCustomType method': function() {
		var cache = new CKEDITOR.plugins.clipboard.dataTransfer()._cache;

		assert.areEqual( 0, cache._customTypes.length, 'no custom types in empty cache' );

		cache.markCustomType( 'text/plain' );
		cache.markCustomType( 'text/plain' );
		cache.markCustomType( 'cke/id' );

		assert.areEqual( 2, cache._customTypes.length, '2 custom types' );
		assertArraySameItems( [ 'text/plain', 'cke/id' ], cache._customTypes, 'proper custom types values are stored' );
	},

	'test getCustomTypesData method': function() {
		var cache = new CKEDITOR.plugins.clipboard.dataTransfer()._cache;

		cache.set( 'text/plain', 'plain' );
		cache.set( 'text/html', 'html' );
		cache.set( 'regular/type', 'foobar' );

		cache.markCustomType( 'text/plain' );
		cache.markCustomType( 'text/plain' );
		cache.markCustomType( 'text/html' );
		cache.markCustomType( 'cke/id' );

		assert.areEqual( 2, CKEDITOR.tools.objectKeys( cache.getCustomTypesData() ).length, 'valid custom data types returned' );
		objectAssert.areEqual( {
			'text/plain': 'plain',
			'text/html': 'html'
		}, cache.getCustomTypesData(), 'valid custom data types with values returned' );
	}
} );

function assertArraySameItems( arr1, arr2, msg ) {
	arrayAssert.itemsAreEqual( arr1.sort(), arr2.sort(), msg );
}
