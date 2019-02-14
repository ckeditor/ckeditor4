/* exported elementspathTestsTools */

var elementspathTestsTools = ( function() {
	'use strict';

	// @param {String} tags Expected elements path (excludding body) as string
	// i.e. 'p,strong,span'.
	function assertPath( tags ) {
		var path = this.editor.ui.space( 'path' );
		path = path.getElementsByTag( 'a' );
		var list = [];
		for ( var i = 0, length = path.count(), el; i < length; i++ ) {
			el = path.getItem( i );
			list.push( el.getText() );
		}

		var expected = [];
		expected.push( this.editor.editable().getName() );
		expected = expected.concat( tags.split( ',' ) );

		assert.areEqual( expected, list.join( ',' ), 'Invalid elements path.' );
	}


	/*
	 * Fires element event handler attribute e.g.
	 * ```html
	 * <button onkeydown="return customFn( event )">x</button>
	 * ```
	 *
	 * @param {CKEDITOR.dom.element/HTMLElement} element Element with attached event handler attribute.
	 * @param {String} eventName Event handler attribute name.
	 * @param {Object} evt Event payload.
	 */
	function fireElementEventHandler( element, eventName, evt ) {
		if ( element.$ ) {
			element = element.$;
		}

		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			var nativeEvent = CKEDITOR.document.$.createEventObject();

			for ( var key in evt ) {
				nativeEvent[ key ] = evt[ key ];
			}

			element.fireEvent( eventName, nativeEvent );
		} else {
			element[ eventName ]( evt );
		}
	}

	return {
		assertPath: assertPath,
		fireElementEventHandler: fireElementEventHandler
	};
} )();
