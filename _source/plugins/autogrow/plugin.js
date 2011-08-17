/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file AutoGrow plugin
 */ ( function() {
	var resizeEditor = function( editor ) {
			if ( !editor.window )
				return;
			var doc = editor.document,
				currentHeight = editor.window.getViewPaneSize().height,
				newHeight;

			// We can not use documentElement to calculate the height for IE (#6061).
			// It is not good for IE Quirks, yet using offsetHeight would also not work as expected (#6408).
			// We do the same for FF because of the html height workaround (#6341).
			if ( CKEDITOR.env.ie || CKEDITOR.env.gecko )
				newHeight = doc.getBody().$.scrollHeight + ( CKEDITOR.env.ie && CKEDITOR.env.quirks ? 0 : 24 );
			else
				newHeight = doc.getDocumentElement().$.offsetHeight;

			var min = editor.config.autoGrow_minHeight,
				max = editor.config.autoGrow_maxHeight;
			( min == undefined ) && ( editor.config.autoGrow_minHeight = min = 200 );
			if ( min )
				newHeight = Math.max( newHeight, min );
			if ( max )
				newHeight = Math.min( newHeight, max );

			if ( newHeight != currentHeight ) {
				newHeight = editor.fire( 'autoGrow', { currentHeight: currentHeight, newHeight: newHeight } ).newHeight;
				editor.resize( editor.container.getStyle( 'width' ), newHeight, true );
			}
		};
	CKEDITOR.plugins.add( 'autogrow', {
		init: function( editor ) {
			editor.addCommand( 'autogrow', { exec:resizeEditor,modes:{wysiwyg:1 },
				readOnly: 1, canUndo: false, editorFocus: false } );

			var eventsList = { contentDom:1,key:1,selectionChange:1,insertElement:1 };
			editor.config.autoGrow_onStartup && ( eventsList[ 'instanceReady' ] = 1 );
			for ( var eventName in eventsList ) {
				editor.on( eventName, function( evt ) {
					var maximize = editor.getCommand( 'maximize' );
					// Some time is required for insertHtml, and it gives other events better performance as well.
					if ( evt.editor.mode == 'wysiwyg' &&
						// Disable autogrow when the editor is maximized .(#6339)
						( !maximize || maximize.state != CKEDITOR.TRISTATE_ON ) ) {
						setTimeout( function() {
							resizeEditor( evt.editor );
						}, 100 );
					}
				});
			}
		}
	});
})();
/**
 * The minimum height that the editor can reach using the AutoGrow feature.
 * @name CKEDITOR.config.autoGrow_minHeight
 * @type Number
 * @default <code>200</code>
 * @since 3.4
 * @example
 * config.autoGrow_minHeight = 300;
 */

/**
 * The maximum height that the editor can reach using the AutoGrow feature. Zero means unlimited.
 * @name CKEDITOR.config.autoGrow_maxHeight
 * @type Number
 * @default <code>0</code>
 * @since 3.4
 * @example
 * config.autoGrow_maxHeight = 400;
 */

/**
 * Whether to have the auto grow happen on editor creation.
 * @name CKEDITOR.config.autoGrow_onStartup
 * @type Boolean
 * @default false
 * @since 3.6.2
 * @example
 * config.autoGrow_onStartup = true;
 */

/**
 * Fired when the AutoGrow plugin is about to change the size of the editor.
 * @name CKEDITOR.editor#autogrow
 * @event
 * @param {Number} data.currentHeight The current height of the editor (before resizing).
 * @param {Number} data.newHeight The new height of the editor (after resizing). It can be changed
 *				to determine a different height value to be used instead.
 */
