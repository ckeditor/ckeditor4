/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "toolbar" plugin. Renders the default toolbar interface in
 * the editor.
 */

(function() {
	var toolbox = function() {
			this.toolbars = [];
		};

	toolbox.prototype.focus = function() {
		for ( var t = 0, toolbar; toolbar = this.toolbars[ t++ ]; ) {
			for ( var i = 0, item; item = toolbar.items[ i++ ]; ) {
				if ( item.focus ) {
					item.focus();
					return;
				}
			}
		}
	};

	var commands = {
		toolbarFocus: {
			exec: function( editor ) {
				if ( editor.toolbox )
					editor.toolbox.focus();
			}
		}
	};

	CKEDITOR.plugins.add( 'toolbar', {
		init: function( editor, pluginPath ) {
			var itemKeystroke = function( item, keystroke ) {
					switch ( keystroke ) {
						case 39: // RIGHT-ARROW
						case 9: // TAB
							// Look for the next item in the toolbar.
							while ( ( item = item.next || ( item.toolbar.next && item.toolbar.next.items[ 0 ] ) ) && !item.focus ) {
	/*jsl:pass*/
							}

							// If available, just focus it, otherwise focus the
							// first one.
							if ( item )
								item.focus();
							else
								editor.toolbox.focus();

							return false;

						case 37: // LEFT-ARROW
						case CKEDITOR.SHIFT + 9: // SHIFT + TAB
							// Look for the previous item in the toolbar.
							while ( ( item = item.previous || ( item.toolbar.previous && item.toolbar.previous.items[ item.toolbar.previous.items.length - 1 ] ) ) && !item.focus ) {
	/*jsl:pass*/
							}

							// If available, just focus it, otherwise focus the
							// last one.
							if ( item )
								item.focus();
							else {
								var lastToolbarItems = editor.toolbox.toolbars[ editor.toolbox.toolbars.length - 1 ].items;
								lastToolbarItems[ lastToolbarItems.length - 1 ].focus();
							}

							return false;

						case 27: // ESC
							editor.focus();
							return false;

						case 13: // ENTER
						case 32: // SPACE
							item.execute();
							return false;
					}
					return true;
				};

			editor.on( 'themeSpace', function( event ) {
				if ( event.data.space == editor.config.toolbarLocation ) {
					editor.toolbox = new toolbox();

					var output = [ '<div class="cke_toolbox">' ];

					var toolbars = editor.toolbox.toolbars,
						toolbar = editor.config.toolbar;

					for ( var r = 0; r < toolbar.length; r++ ) {
						var row = toolbar[ r ],
							toolbarId = 'cke_' + CKEDITOR.tools.getNextNumber(),
							toolbarObj = { id: toolbarId, items: [] };

						output.push( '<div id="', toolbarId, '" class="cke_toolbar">' );

						// Add the toolbar to the "editor.toolbox.toolbars"
						// array.
						var index = toolbars.push( toolbarObj ) - 1;

						// Create the next/previous reference.
						if ( index > 0 ) {
							toolbarObj.previous = toolbars[ index - 1 ];
							toolbarObj.previous.next = toolbarObj;
						}

						// Create all items defined for this toolbar.
						for ( var i = 0; i < row.length; i++ ) {
							var item,
								itemName = row[ i ];

							if ( itemName == '-' )
								item = CKEDITOR.ui.separator;
							else
								item = editor.ui.get( itemName );

							if ( item ) {
								var itemObj = item.render( editor, output );
								index = toolbarObj.items.push( itemObj ) - 1;

								if ( index > 0 ) {
									itemObj.previous = toolbarObj.items[ index - 1 ];
									itemObj.previous.next = itemObj;
								}

								itemObj.toolbar = toolbarObj;
								itemObj.onkey = itemKeystroke;
							}
						}

						output.push( '</div>' );
					}

					output.push( '</div>' );

					event.data.html += output.join( '' );
				}
			});

			editor.addCommand( 'toolbarFocus', commands.toolbarFocus );
		}
	});
})();

/**
 * The UI element that renders a toolbar separator.
 * @type Object
 * @example
 */
CKEDITOR.ui.separator = {
	render: function( editor, output ) {
		output.push( '<span class="cke_separator"></span>' );
		return {};
	}
};

/**
 * The "theme space" to which rendering the toolbar. For the default theme,
 * the recommended options are "top" and "bottom".
 * @type String
 * @default 'top'
 * @see CKEDITOR.config.theme
 * @example
 * config.toolbarLocation = 'bottom';
 */
CKEDITOR.config.toolbarLocation = 'top';

/**
 * The toolbox (alias toolbar) definition. It is an array of toolbars (strips),
 * each one being also an array, containing a list of UI items.
 * @type Array
 * @example
 * // Defines a toolbar with only one strip containing the "Source" button, a
 * // separator and the "Bold" and "Italic" buttons.
 * <b>CKEDITOR.config.toolbar =
 * [
 *     [ 'Source', '-', 'Bold', 'Italic' ]
 * ]</b>;
 */
CKEDITOR.config.toolbar = [
	[
	'Source', '-',
	'NewPage', 'Preview', 'Print', '-',
	'PasteFromWord', '-',
	'Bold', 'Italic', 'Underline', 'Strike', '-',
	'NumberedList', 'BulletedList', '-',
	'Outdent', 'Indent', 'Blockquote', '-',
	'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',
	'Subscript', 'Superscript', '-',
	'SelectAll', 'RemoveFormat', '-',
	'Link', 'Unlink', 'Anchor', '-',
	'Image', '-',
	'Table', 'Smiley', 'HorizontalRule', 'SpecialChar', 'PageBreak'
	]
	];
