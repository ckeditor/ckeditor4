/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'underlinesplit', {
	requires: 'splitbutton,basicstyles',
	init: function( editor ) {
		var styleKeys = [ 'dotted', 'dashed', 'wavy', 'double', 'solid' ],
			styles = {},
			items,
			lastStyle;

		CKEDITOR.tools.array.forEach( styleKeys, function( item ) {
			styles[ item ] = createStyle( item );
		} );

		lastStyle = styles.solid;

		editor.addCommand( 'underlinestyle', {
			exec: function( editor, data ) {
				var style = styles[ data.style ] || lastStyle;

				if ( style.checkApplicable( editor.elementPath(), editor ) ) {
					if ( style.checkActive( editor.elementPath(), editor ) ) {
						editor.removeStyle( style );
					} else {
						editor.applyStyle( style );
						lastStyle = style;
					}
				}
			}
		} );

		items = CKEDITOR.tools.array.map( styleKeys, function( item ) {
			return {
				label: item.charAt( 0 ).toUpperCase() + item.substr( 1 ),
				command: 'underlinestyle',
				commandData: { style: item },
				icon: 'underline'
			};
		} );

		editor.on( 'selectionChange', function( event ) {
			var active = false;

			for ( var key in styles ) {
				if ( styles[ key ].checkActive( event.data.path, this ) ) {
					active = true;
					break;
				}
			}
			editor.getCommand( 'underlinestyle' ).setState( active ?
				CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF
			);
		} );

		editor.ui.add( 'UnderlineSplit', CKEDITOR.UI_SPLITBUTTON, {
			face: {
				label: 'Underline',
				command: 'underlinestyle',
				icon: 'underline'
			},
			onMenu: function( start, selection ) {
				var activeItems = {},
					editor = selection.root.editor,
					style;
				for ( var key in this.items ) {
					var commandDisabled = editor.getCommand( this.items[ key ].command ).state === CKEDITOR.TRISTATE_DISABLED;
					style = styles[ this.items[ key ].commandData.style ];
					if ( editor.elementPath() && !commandDisabled ) {
						activeItems[ key ] = style.checkActive( editor.elementPath(), editor ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
					} else {
						activeItems[ key ] = commandDisabled ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF;
					}
				}
				return activeItems;
			},
			items: items
		} );

		function createStyle( style ) {
			return new CKEDITOR.style( {
				element: 'u',
				attributes: {
					style: ( CKEDITOR.env.safari ? '-webkit-' : '' ) + 'text-decoration-style: ' + style
				}
			} );
		}
	}
} );
