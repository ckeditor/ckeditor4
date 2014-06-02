/* bender-tags: editor,unit,jquery */
/* bender-ckeditor-adapters: jquery */
/* bender-ckeditor-plugins: wysiwygarea */

bender.test( {
	assertEditor: function( nameOrObject, name ) {
		if ( typeof nameOrObject == 'string' ) {
			name = nameOrObject;
			nameOrObject = CKEDITOR.instances[ nameOrObject ];
		}

		assert.isObject( nameOrObject, name + ' should exist.' );
		assert.areSame( name, nameOrObject.name, name + ' name should match.' );
		assert.areSame( $( '#' + name ).get( 0 ), nameOrObject.element.$, 'Instance element should match.' );
	},

	assertEditorMode: function( editorName, mode ) {
		assert.areSame( mode, CKEDITOR.instances[ editorName ].elementMode, editorName + ' should be created by replace.' );
	},

	assertEditorInstances: function( expected ) {
		arrayAssert.itemsAreEqual( expected, CKEDITOR.tools.objectKeys( CKEDITOR.instances ), 'Editors instances list should match with expected.' );
	},

	destroyAll: function() {
		var instances = CKEDITOR.instances;

		for ( var i in instances )
			instances[ i ].destroy();
	},

	'test creator: replace': function() {
		$( '#editor1' ).ckeditor( function() {
			resume( function() {
				this.assertEditor( 'editor1' );
				this.assertEditorMode( 'editor1', CKEDITOR.ELEMENT_MODE_REPLACE );
				this.assertEditorInstances( [ 'editor1' ] );
			} );
		} );

		wait();
	},

	'test creator: replace all': function() {
		this.destroyAll();

		$( '.myclass' ).ckeditor();

		this.assertEditorMode( 'editor2', CKEDITOR.ELEMENT_MODE_REPLACE );
		this.assertEditor( 'editor2' );

		this.assertEditorMode( 'editor3', CKEDITOR.ELEMENT_MODE_REPLACE );
		this.assertEditor( 'editor3' );

		this.assertEditorInstances( [ 'editor2', 'editor3' ] );
	},

	'test creator: inline': function() {
		$( '#inline' ).ckeditor();

		this.assertEditorMode( 'inline', CKEDITOR.ELEMENT_MODE_INLINE );
		this.assertEditor( 'inline' );
	},

	'test empty collection returns this': function() {
		assert.areSame( 0, $( 'doesntExist' ).ckeditor().length, 'Adapter should return \'this\' when element does not exist.' );
	},

	'test wrong type of element': function() {
		var failed;

		try {
			$( 'a#link1' ).ckeditor();
		} catch ( e ) {
			failed = true;
		}

		assert.isTrue( failed, 'Error object must be thrown because this element is invalid.' );
	},

	'test respect env.isCompatible': function() {
		var failed;

		CKEDITOR.env.isCompatible = false;

		try {
			$( '#editor4' ).ckeditor().get( 0 );
		} catch ( e ) {
			failed = true;
		}

		assert.isTrue( failed, 'Error should be thrown.' );
		assert.isUndefined( CKEDITOR.instances.editor4, 'editor4 is undefined.' );

		CKEDITOR.env.isCompatible = true;
	},

	'test ckeditorGet (deprec API)': function() {
		$( '#editor6' ).ckeditor();
		this.assertEditor( $( '#editor6' ).ckeditorGet(), 'editor6' );
	},

	'test callback function': function() {
		var that = this;

		assert.isUndefined( CKEDITOR.instances.editor5, 'editor5 should be undefined.' );

		$( '#editor5' ).ckeditor( function() {
			resume( function() {
				that.assertEditor( 'editor5' );
			} );
		} );

		wait();
	},

	'test config': function() {
		$( '#editor7' ).ckeditor( { uiColor: '#9AB8F3' } );

		$( '#editor7' ).ckeditor().editor.on( 'instanceReady', function() {
			resume( function() {
				assert.areSame( '#9AB8F3', $( '#editor7' ).ckeditor().editor.config.uiColor, 'Configuration should be set.' );
			} );
		} );

		wait();
	},

	'test config + callback': function() {
		$( '#editor8' ).ckeditor( { uiColor: '#9AB8F3' }, function() {
			resume( function() {
				assert.areSame( '#9AB8F3', $( '#editor8' ).ckeditor().editor.config.uiColor, 'Configuration should be set.' );
			} );
		} );

		wait();
	},

	'test callback + config': function() {
		$( '#editor9' ).ckeditor( function() {
			resume( function() {
				assert.areSame( '#9AB8F3', $( '#editor9' ).ckeditor().editor.config.uiColor, 'Configuration should be set.' );
			} );
		}, { uiColor: '#9AB8F3' } );

		wait();
	},

	'test chaining#1': function() {
		var callbackCalled;

		$( '#editor10' ).ckeditor( function() {
			callbackCalled = true;
		} ).ckeditor( function() {
			resume( function() {
				assert.isTrue( callbackCalled, 'First callback should be called.' );
			} );
		} );

		wait();
	},

	'test chaining#2': function() {
		$( 'body' ).find( '#editor11' ).ckeditor().end().find( 'a#link2' ).addClass( 'mylink' ).end();

		this.assertEditor( 'editor11' );
		assert.isTrue( $( 'a#link2' ).hasClass( 'mylink' ) );
	},

	'test ckeditor().editor': function() {
		$( '#editor12' ).ckeditor();

		assert.isUndefined( $( '#editor12' ).editor, '$( selector ).editor should be undefined' );
		this.assertEditor( $( '#editor12' ).ckeditor().editor, 'editor12' );
	},

	'test ckeditor().editor (collection)': function() {
		$( '.editors13' ).ckeditor();

		assert.isUndefined( $( '.editors13' ).editor, '$( selector ).editor should be undefined' );
		this.assertEditor( $( '.editors13' ).ckeditor().editor, 'editor13a' );
	},

	'test promise': function() {
		var ready = [];

		$( '#editor14' ).ckeditor( function() {
			ready.push( this.name );
		} ).promise.done( function() {
			resume( function() {
				arrayAssert.itemsAreSame( [ 'editor14' ], ready, 'Editor14 should be ready.' );
			} );
		} );

		wait();
	},

	'test promise (collection)': function() {
		var ready = [];

		$( '.editors15' ).ckeditor( function() {
			ready.push( this.name );
		} ).promise.done( function() {
			resume( function() {
				arrayAssert.itemsAreSame( [ 'editor15a', 'editor15b' ], ready.sort(), 'Editor15a and Editor15b should be ready.' );
			} );
		} );

		wait();
	}
} );