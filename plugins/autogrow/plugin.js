/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The Auto Grow plugin.
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'autogrow', {
		init: function( editor ) {
			// This feature is available only for themed ui instance.
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				return;

			editor.on( 'instanceReady', function() {
				// Simply set auto height with div wysiwyg.
				if ( editor.editable().isInline() )
					editor.ui.space( 'contents' ).setStyle( 'height', 'auto' );
				// For classic (`iframe`-based) wysiwyg we need to resize the editor.
				else
					initIframeAutogrow( editor );
			} );
		}
	} );

	function initIframeAutogrow( editor ) {
		var lastHeight,
			doc,
			markerContainer,
			scrollable,
			marker,
			configBottomSpace = editor.config.autoGrow_bottomSpace || 0,
			configMinHeight = editor.config.autoGrow_minHeight !== undefined ? editor.config.autoGrow_minHeight : 200,
			configMaxHeight = editor.config.autoGrow_maxHeight || Infinity,
			maxHeightIsUnlimited = !editor.config.autoGrow_maxHeight;

		editor.addCommand( 'autogrow', {
			exec: resizeEditor,
			modes: { wysiwyg: 1 },
			readOnly: 1,
			canUndo: false,
			editorFocus: false
		} );

		var eventsList = { contentDom: 1, key: 1, selectionChange: 1, insertElement: 1, mode: 1 };
		for ( var eventName in eventsList ) {
			editor.on( eventName, function( evt ) {
				// Some time is required for insertHtml, and it gives other events better performance as well.
				if ( evt.editor.mode == 'wysiwyg' ) {
					setTimeout( function() {
						if ( isNotResizable() ) {
							lastHeight = null;
							return;
						}

						resizeEditor();

						// Second pass to make correction upon the first resize, e.g. scrollbar.
						// If height is unlimited vertical scrollbar was removed in the first
						// resizeEditor() call, so we don't need the second pass.
						if ( !maxHeightIsUnlimited )
							resizeEditor();
					}, 100 );
				}
			} );
		}

		// Coordinate with the "maximize" plugin. (https://dev.ckeditor.com/ticket/9311)
		editor.on( 'afterCommandExec', function( evt ) {
			if ( evt.data.name == 'maximize' && evt.editor.mode == 'wysiwyg' ) {
				if ( evt.data.command.state == CKEDITOR.TRISTATE_ON )
					scrollable.removeStyle( 'overflow-y' );
				else
					resizeEditor();
			}
		} );

		editor.on( 'contentDom', refreshCache );

		refreshCache();

		if ( editor.config.autoGrow_onStartup && editor.editable().isVisible() ) {
			editor.execCommand( 'autogrow' );
		}

		function refreshCache() {
			doc = editor.document;
			markerContainer = doc[ CKEDITOR.env.ie ? 'getBody' : 'getDocumentElement' ]();

			// Quirks mode overflows body, standards overflows document element.
			scrollable = CKEDITOR.env.quirks ? doc.getBody() : doc.getDocumentElement();

			// Reset scrollable body height and min-height css values.
			// While set by outside code it may break resizing. (https://dev.ckeditor.com/ticket/14620)
			var body = CKEDITOR.env.quirks ? scrollable : scrollable.findOne( 'body' );
			if ( body ) {
				body.setStyle( 'height', 'auto' );
				body.setStyle( 'min-height', CKEDITOR.env.safari ? '0%' : 'auto' ); // Safari does not support 'min-height: auto'.
			}

			marker = CKEDITOR.dom.element.createFromHtml(
				'<span style="margin:0;padding:0;border:0;clear:both;width:1px;height:1px;display:block;">' +
					( CKEDITOR.env.webkit ? '&nbsp;' : '' ) +
				'</span>',
				doc );
		}

		function isNotResizable() {
			var maximizeCommand = editor.getCommand( 'maximize' );

			return (
				!editor.window ||
				// Disable autogrow when the editor is maximized. (https://dev.ckeditor.com/ticket/6339)
				maximizeCommand && maximizeCommand.state == CKEDITOR.TRISTATE_ON
			);
		}

		// Actual content height, figured out by appending check the last element's document position.
		function contentHeight() {
			// Append a temporary marker element.
			markerContainer.append( marker );
			var height = marker.getDocumentPosition( doc ).y + marker.$.offsetHeight;
			marker.remove();

			return height;
		}

		function resizeEditor() {
			// Hide scroll because we won't need it at all.
			// Thanks to that we'll need only one resizeEditor() call per change.
			if ( maxHeightIsUnlimited )
				scrollable.setStyle( 'overflow-y', 'hidden' );

			var currentHeight = editor.window.getViewPaneSize().height,
				newHeight = contentHeight();

			// Additional space specified by user.
			newHeight += configBottomSpace;
			newHeight = Math.max( newHeight, configMinHeight );
			newHeight = Math.min( newHeight, configMaxHeight );

			// https://dev.ckeditor.com/ticket/10196 Do not resize editor if new height is equal
			// to the one set by previous resizeEditor() call.
			if ( newHeight != currentHeight && lastHeight != newHeight ) {
				newHeight = editor.fire( 'autoGrow', { currentHeight: currentHeight, newHeight: newHeight } ).newHeight;
				editor.resize( editor.container.getStyle( 'width' ), newHeight, true );
				lastHeight = newHeight;
			}

			if ( !maxHeightIsUnlimited ) {
				if ( newHeight < configMaxHeight && scrollable.$.scrollHeight > scrollable.$.clientHeight )
					scrollable.setStyle( 'overflow-y', 'hidden' );
				else
					scrollable.removeStyle( 'overflow-y' );
			}
		}
	}
} )();

/**
 * The minimum height that the editor can assume when adjusting to content by using the Auto Grow
 * feature. This option accepts a value in pixels, without the unit (for example: `300`).
 *
 * Read more in the {@glink guide/dev_autogrow documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/autogrow.html).
 *
 *		config.autoGrow_minHeight = 300;
 *
 * @since 3.4
 * @cfg {Number} [autoGrow_minHeight=200]
 * @member CKEDITOR.config
 */

/**
 * The maximum height that the editor can assume when adjusting to content by using the Auto Grow
 * feature. This option accepts a value in pixels, without the unit (for example: `600`).
 * Zero (`0`) means that the maximum height is not limited and the editor will expand infinitely.
 *
 * Read more in the {@glink guide/dev_autogrow documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/autogrow.html).
 *
 *		config.autoGrow_maxHeight = 400;
 *
 * @since 3.4
 * @cfg {Number} [autoGrow_maxHeight=0]
 * @member CKEDITOR.config
 */

/**
 * Whether automatic editor height adjustment brought by the Auto Grow feature should happen on
 * editor creation.
 *
 * Read more in the {@glink guide/dev_autogrow documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/autogrow.html).
 *
 *		config.autoGrow_onStartup = true;
 *
 * @since 3.6.2
 * @cfg {Boolean} [autoGrow_onStartup=false]
 * @member CKEDITOR.config
 */

/**
 * Extra vertical space to be added between the content and the editor bottom bar when adjusting
 * editor height to content by using the Auto Grow feature. This option accepts a value in pixels,
 * without the unit (for example: `50`).
 *
 * Read more in the {@glink guide/dev_autogrow documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/autogrow.html).
 *
 *		config.autoGrow_bottomSpace = 50;
 *
 * @since 3.6.2
 * @cfg {Number} [autoGrow_bottomSpace=0]
 * @member CKEDITOR.config
 */

/**
 * Fired when the Auto Grow plugin is about to change the size of the editor.
 *
 * @event autogrow
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {Number} data.currentHeight The current editor height (before resizing).
 * @param {Number} data.newHeight The new editor height (after resizing). It can be changed
 * to achieve a different height value to be used instead.
 */
