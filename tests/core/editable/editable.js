/* bender-tags: editor,unit */

var testEditable = CKEDITOR.tools.createClass( {
	base: CKEDITOR.editable,
	_: {},
	proto: {
		insertHtml: function( data ) {
			this._.html = data;
		},

		insertElement: function( element ) {
			this._.element = element;
		},

		insertText: function( text ) {
			this._.text = text;
		},

		setData: function( data, isSnapshot ) {
			this._[ isSnapshot ? 'snapshot' : 'data' ] = data;
		},

		getData: function( isSnapshot ) {
			return this._[ isSnapshot ? 'snapshot' : 'data' ] || '';
		},

		focus: function() {
			this._.focus = true;
		},
		detach: function() {
			var _ = this._;
			_.html = _.element = _.text = _.snapshot = _.data = _.focus = undefined;
			testEditable.baseProto.detach.call( this );
		}
	}
} );

var doc = CKEDITOR.document;

bender.test(
{
	// Initialize the editor instance.
	'async:init': function() {
		var tc = this;
		var editor = new CKEDITOR.editor();
		editor.on( 'loaded', function() {
			editor.editable( new testEditable( editor, doc.getBody() ) );
			tc.editor = editor;
			tc.callback();
		} );
	},

	// Test all editable APIs.
	testEditable: function() {
		var editable = this.editor.editable();
		assert.areSame( editable.$, doc.getBody().$ );
		assert.areSame( this.editor, editable.editor );

		this.editor.focus();
		assert.isTrue( editable._.focus );

		this.editor.setData( 'foo' );
		assert.areSame( 'foo', editable._.data, 'set data' );
		assert.areSame( 'foo', this.editor.getData(), 'retrieve data' );

		this.editor.insertElement( 'foo' );
		this.editor.insertText( 'foo' );
		this.editor.insertHtml( 'foo' );

		assert.areSame( 'foo', editable._.element, 'insert element' );
		assert.areSame( 'foo', editable._.text, 'insert text' );
		assert.areSame( 'foo', editable._.text, 'insert html' );
	},

	// Test editable destruction.
	testDetach: function() {
		var editable = this.editor.editable();
		this.editor.editable( null );

		this.editor.focus();
		this.editor.setData( 'foo' );
		this.editor.insertElement( 'foo' );
		this.editor.insertText( 'bar' );
		this.editor.insertHtml( 'bar' );

		// Check all delegations has ceased after destroy.
		assert.isUndefined( editable._.focus );
		assert.isUndefined( editable._.data );
		assert.isUndefined( editable._.element );
		assert.isUndefined( editable._.text );
	},

	'test listeners attaching/detaching': function() {
		var editor = this.editor,
			editable = new testEditable( editor, doc.getBody() ),
			obj = {},
			fired = '';

		editor.editable( editable );

		CKEDITOR.event.implementOn( obj );

		editable.attachListener( obj, 'testEvent', function() {
			fired += '1';
		} );
		editable.attachListener( obj, 'testEvent', function() {
			fired += '2';
		}, null, null, 1 );
		obj.on( 'testEvent', function() {
			fired += '3';
		} );

		obj.fire( 'testEvent' );
		assert.areEqual( '213', fired, 'All 3 fired, but in priorities order' );

		fired = '';
		editor.editable( null ); // Detach editable.

		obj.fire( 'testEvent' );
		assert.areEqual( '3', fired, 'Both listeners were removed, but directly attached remained' );
	},

	'test manual listener detaching': function() {
		var editor = this.editor,
			editable = new testEditable( editor, doc.getBody() ),
			obj = {},
			fired = 0;

		editor.editable( editable );

		CKEDITOR.event.implementOn( obj );

		var listener = editable.attachListener( obj, 'testEvent', function() {
			fired++;
		} );

		editable.attachListener( obj, 'testEvent2', function() {
			fired++;
		} );

		obj.fire( 'testEvent' );
		assert.areEqual( 1, fired, 'Caught testEvent' );

		listener.removeListener();

		obj.fire( 'testEvent' );
		assert.areEqual( 1, fired, 'Have not caught testEvent' );

		editor.editable( null ); // Detach editable.

		// Test whether all listeners were unbound correctly.
		obj.fire( 'testEvent2' );
		assert.areEqual( 1, fired, 'Have not caught testEvent2' );
	},

	'test dblclick is forwarded to editor#doubleclick': function() {
		var editor = this.editor,
			editable = new testEditable( editor, doc.getBody() ),
			fired,
			target;

		editor.editable( editable );

		editor.on( 'doubleclick', function( evt ) {
			fired = true;
			target = evt.data.element;

			// We need to cancel it because in this mocked editable there's no selection,
			// some some listening plugins may fail.
			evt.cancel();
		}, null, null, -999 );

		editor.editable().fire( 'dblclick', new CKEDITOR.dom.event( { target: editor.editable().$ } ) );

		assert.isTrue( fired, 'editor#doubleclick was fired' );
		assert.areSame( editor.editable(), target, 'data.element was set' );
	}
} );