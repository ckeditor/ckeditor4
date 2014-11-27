/* exported appendDomObjectTests */

var appendDomObjectTests = function( objectFactory, tests ) {
	return CKEDITOR.tools.extend( tests, {
		// tests for objectFactory
		test_objectFactory: function() {
			var a = objectFactory( 'domObjectTest1' ),
				b = objectFactory( 'domObjectTest2' ),
				c = objectFactory( 'domObjectTest1' );

			// we really try to compare objects, not their $ properties
			assert.isTrue( a !== b );
			assert.areNotEqual( a.$, b.$ );

			// objectFactory for dom.element should return different
			// objects for the same native nodes
			if ( a instanceof CKEDITOR.dom.element ) {
				// again - we want to compare objects, not $ properties
				assert.isTrue( a !== c );
			}

			assert.areEqual( a.$, c.$ );
		},

		test_domObject_equals: function() {
			var a = objectFactory( 'domObjectTest1' ),
				b = objectFactory( 'domObjectTest1' );
			assert.isTrue( a.equals( b ) );
		},

		test_domObject_equals2: function() {
			var a = objectFactory( 'domObjectTest1' ),
				b = objectFactory( 'domObjectTest2' ),
				c = objectFactory( 'domObjectNonExistingElement' ),
				d = document.createElement( 'div' );

			d.id = 'domObjectTest1';

			assert.isFalse( a.equals( b ) );
			assert.isFalse( a.equals( c ) );
			assert.isFalse( a.equals( d ) );
			assert.isFalse( a.equals( { $: true } ) );
		},

		test_domObject_private1: function() {
			var a = objectFactory( 'domObjectTest1' );
			var b = objectFactory( 'domObjectTest1' );

			assert.areSame( a.getPrivate(), b.getPrivate() );
		},

		test_domObject_private2: function() {
			var a = objectFactory( 'domObjectTest1' );
			var b = objectFactory( 'domObjectTest2' );

			assert.areNotSame( a.getPrivate(), b.getPrivate() );
		},

		test_domObject_custom_data_1: function() {
			var obj = {},
				str = 'aaa"><&gt;&lt;',
				a = objectFactory( 'domObjectTest1' ),
				b = objectFactory( 'domObjectTest1' ),
				c = objectFactory( 'domObjectTest2' );

			a.setCustomData( 'x', 1 );
			a.setCustomData( 'y', str );
			a.setCustomData( 'z', obj );

			assert.areSame( 1, a.getCustomData( 'x' ) );
			assert.areSame( str, a.getCustomData( 'y' ) );
			assert.areSame( obj, a.getCustomData( 'z' ) );

			assert.areSame( 1, b.getCustomData( 'x' ) );
			assert.areSame( str, b.getCustomData( 'y' ) );
			assert.areSame( obj, b.getCustomData( 'z' ) );

			assert.isNull( c.getCustomData( 'x' ) );
		},

		test_domObject_removeCustomData: function() {
			var a = objectFactory( 'domObjectTest1' ),
				b = objectFactory( 'domObjectTest1' ),
				c = objectFactory( 'domObjectTest2' );

			a.setCustomData( 'x', 1 );
			c.setCustomData( 'x', 1 );

			assert.areSame( 1, a.removeCustomData( 'x' ) );
			assert.isNull( a.getCustomData( 'x' ) );
			assert.isNull( b.getCustomData( 'x' ) );

			assert.areSame( 1, c.getCustomData( 'x' ) );

			// already removed
			assert.isNull( a.removeCustomData( 'x' ) );

			// the "true undefined" :D
			a.setCustomData( 'y', undefined );

			// check if undefined properties are also removed
			assert.isUndefined( a.removeCustomData( 'y' ) );
			assert.isNull( a.removeCustomData( 'y' ) );

			a.setCustomData( 'z', false );
			assert.isFalse( a.getCustomData( 'z' ) );
			assert.isFalse( a.removeCustomData( 'z' ) );
			assert.isNull( a.removeCustomData( 'z' ) );
		},

		test_domObject_clearCustomData: function() {
			var a = objectFactory( 'domObjectTest1' ),
				b = objectFactory( 'domObjectTest1' ),
				c = objectFactory( 'domObjectTest2' );

			a.setCustomData( 'x', 1 );
			c.setCustomData( 'x', 1 );

			a.clearCustomData();
			assert.isNull( a.getCustomData( 'x' ) );
			assert.isNull( b.getCustomData( 'x' ) );
			assert.areSame( 1, c.getCustomData( 'x' ) );
		},

		'test custom data after cloning': function() {
			var a = objectFactory( 'domObjectTest1' );

			if ( typeof a.clone != 'function' )
				assert.ignore();

			a.setCustomData( 'x', 1 );

			var b = a.clone();
			assert.isNull( b.getCustomData( 'x' ) );
			b.setCustomData( 'x', 2 );
			assert.areEqual( 1, a.getCustomData( 'x' ) );
			assert.areEqual( 2, b.removeCustomData( 'x' ) );
			assert.areEqual( 1, a.getCustomData( 'x' ) );

			var c = a.clone( false, true );

			assert.isNull( c.getCustomData( 'x' ) );
			c.clearCustomData();
			assert.areEqual( 1, a.getCustomData( 'x' ) );
		},

		test_domObject_getUniquieId: function() {
			var a = objectFactory( 'domObjectTest1' ),
				b = objectFactory( 'domObjectTest1' ),
				c = objectFactory( 'domObjectTest2' );

			assert.areSame( a.getUniqueId(), b.getUniqueId() );
			assert.areNotEqual( a.getUniqueId(), c.getUniqueId() );
		},

		test_domObject_removeAllListeners: function() {
			var evtCouter = 0,
				a = objectFactory( 'domObjectTest1' );

			a.on( 'evt', function() {
				evtCouter++;
			} );

			a.fire( 'evt' );
			assert.areSame( 1, evtCouter, 'After fist event.' );

			a.removeAllListeners();

			a.fire( 'evt' );
			assert.areSame( 1, evtCouter, 'After removeAllListeners.' );
		}
	} );
};
