function assertPasteEvent( editor, eventData, expected, message, async ) {
	var priority = 999,
		executed = false,
		onPaste;

	message = message ? message + ' - ' : '';

	// Listener's priority can be specified.
	if ( 'priority' in expected ) {
		priority = expected.priority;
		delete expected.priority;
	}

	// Type doesn't have to be specified.
	if ( !eventData.type )
		eventData.type = 'auto';

	editor.once( 'paste', onPaste, null, null, priority );
	editor.fire( 'paste', eventData );

	if ( async )
		wait();
	else
		assert.isTrue( executed, message + 'paste listener was executed' );

	function assertPaste( data ) {
		if ( typeof expected == 'function' )
			expected( data, message );
		else {
			// Compare all expected values.
			for ( var name in expected )
				assert.areSame( expected[ name ], data[ name ], message + 'data.' + name );
		}
	}

	function onPaste( evt ) {
		var data = evt.data;
		evt.removeListener();
		evt.cancel(); // Cancel for performance reason - we don't need insertion happen.

		executed = true;

		if ( async )
			resume( function() {
				 assertPaste( data );
			} );
		else
			assertPaste( data );
	}
}

function createNativeDataTransferMock() {
	return {
		types: [],
		_data: [],
		// Emulate browsers native behavior for getDeta/setData.
		setData: function( type, data ) {
			if ( CKEDITOR.env.ie && type != 'Text' && type != 'URL' )
				throw "Unexpected call to method or property access.";

			if ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 && type == 'URL' )
				return;

			this._data[ type ] = data;
			this.types.push( type );
		},
		getData: function( type ) {
			if ( CKEDITOR.env.ie && type != 'Text' && type != 'URL' )
				throw "Invalid argument.";

			if ( !this._data[ type ] )
				return '';

			return this._data[ type ];
		}
	}
}

function createDropEventMock() {
	var dataTransfer = createNativeDataTransferMock();
	return {
		$: {
			dataTransfer: dataTransfer
		},
		preventDefault: function() {
			// noop
		},
		getTarget: function() {
			return new CKEDITOR.dom.node( 'targetMock' );
		}
	}
}

function createPasteEventMock() {
	var dataTransfer = createNativeDataTransferMock();
	return {
		$: {
			clipboardData: CKEDITOR.env.ie ? undefined : dataTransfer
		},
		preventDefault: function() {
			// noop
		},
		getTarget: function() {
			return new CKEDITOR.dom.node( 'targetMock' );
		}
	}
}