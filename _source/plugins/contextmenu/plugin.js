/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'contextmenu', {
	requires: [ 'menu' ],

	beforeInit: function( editor ) {
		editor.contextMenu = new CKEDITOR.plugins.contextMenu( editor );
	}
});

CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
	$: function( editor ) {
		this.id = 'cke_' + CKEDITOR.tools.getNextNumber();
		this.editor = editor;
		this._.listeners = [];
		this._.functionId = CKEDITOR.tools.addFunction( function( commandName ) {
			this._.panel.hide();
			editor.focus();
			editor.execCommand( commandName );
		}, this );
	},

	_: {
		onMenu: function( domEvent ) {
			// Cancel the browser context menu.
			domEvent.preventDefault();

			var menu = this._.menu,
				editor = this.editor;

			if ( menu ) {
				menu.hide();
				menu.removeAll();
			} else {
				menu = this._.menu = new CKEDITOR.menu( editor );
				menu.onClick = function( item ) {
					menu.hide();
					editor.focus();

					if ( item.onClick )
						item.onClick();
					else if ( item.command )
						editor.execCommand( item.command );
				};
			}

			var listeners = this._.listeners,
				includedItems = [];

			var selection = this.editor.getSelection(),
				element = selection && selection.getStartElement();

			// Call all listeners, filling the list of items to be displayed.
			for ( var i = 0; i < listeners.length; i++ ) {
				var listenerItems = listeners[ i ]( element, selection );

				if ( listenerItems ) {
					for ( var itemName in listenerItems ) {
						var item = this.editor.getMenuItem( itemName );

						if ( item ) {
							item.state = listenerItems[ itemName ];
							menu.add( item );
						}
					}
				}
			}

			menu.show( domEvent.getTarget().getDocument().getDocumentElement(), 1, domEvent.$.clientX, domEvent.$.clientY );
		}
	},

	proto: {
		addTarget: function( element ) {
			element.on( 'contextmenu', function( event ) {
				return this._.onMenu( event.data );
			}, this );
		},

		addListener: function( listenerFn ) {
			this._.listeners.push( listenerFn );
		}
	}
});

// Fix the "contextmenu" event for DOM elements.
// We may do this if we identify browsers that don't support the context meny
// event on element directly. Leaving here for reference.
//if ( <specific browsers> )
//{
//	CKEDITOR.dom.element.prototype.on = CKEDITOR.tools.override( CKEDITOR.dom.element.prototype.on, function( originalOn )
//		{
//			return function( eventName )
//				{
//					if ( eventName != 'contextmenu' )
//						return originalOn.apply( this, arguments );
//
//					// TODO : Implement the fix.
//				};
//		});
//}
