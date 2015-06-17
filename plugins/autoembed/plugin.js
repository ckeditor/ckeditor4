/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'autoembed', {
		requires: 'autolink,undo',

		init: function( editor ) {
			var currentId = 1;

			editor.on( 'paste', function( evt ) {
				if ( evt.data.dataTransfer.getTransferType( editor ) == CKEDITOR.DATA_TRANSFER_INTERNAL ) {
					return;
				}

				var data = evt.data.dataValue,
					parsedData,
					link;

				// Expecting exactly one <a> tag spanning the whole pasted content.
				if ( data.match( /^<a [^<]+<\/a>$/i ) ) {
					parsedData = CKEDITOR.htmlParser.fragment.fromHtml( data );

					// Embed only links with a single text node with a href attr which equals its text.
					if ( parsedData.children.length != 1 )
						return;

					link = parsedData.children[ 0 ];

					if ( link.type == CKEDITOR.NODE_ELEMENT && link.getHtml() == link.attributes.href ) {
						evt.data.dataValue = '<a data-cke-autoembed="' + ( ++currentId ) + '"' + data.substr( 2 );
					}
				}

			}, null, null, 20 ); // Execute after autolink.

			editor.on( 'afterPaste', function() {
				autoEmbedLink( editor, currentId );
			} );
		}
	} );

	function autoEmbedLink( editor, id ) {
		var anchor = editor.editable().findOne( 'a[data-cke-autoembed="' + id + '"]' );

		if ( !anchor || !anchor.data( 'cke-saved-href' ) ) {
			return;
		}

		var href = anchor.data( 'cke-saved-href' ),
			widgetDef = CKEDITOR.plugins.autoEmbed.getWidgetDefinition( editor, href );

		if ( !widgetDef ) {
			window.console && window.console.log(
				'[CKEDITOR.plugins.autoEmbed] Incorrect config.autoEmbed_widget value. ' +
				'No widget definition found.'
			);
			return;
		}

			// TODO Move this to a method in the widget plugin. #13408
		var defaults = typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults,
			element = CKEDITOR.dom.element.createFromHtml( widgetDef.template.output( defaults ) ),
			instance,
			wrapper = editor.widgets.wrapElement( element, widgetDef.name ),
			temp = new CKEDITOR.dom.documentFragment( wrapper.getDocument() );

		temp.append( wrapper );
		instance = editor.widgets.initOn( element, widgetDef );

		if ( !instance ) {
			finalizeCreation();
			return;
		}

		instance.loadContent( href, {
			callback: function() {
					// DOM might be invalidated in the meantime, so find the anchor again.
				var anchor = editor.editable().findOne( 'a[data-cke-autoembed="' + id + '"]' ),
					range = editor.createRange();

				// Anchor might be removed in the meantime.
				if ( anchor ) {
					range.setStartAt( anchor, CKEDITOR.POSITION_BEFORE_START );
					range.setEndAt( anchor, CKEDITOR.POSITION_AFTER_END );

					editor.editable().insertElementIntoRange( wrapper, range );
				}

				finalizeCreation();
			},

			error: finalizeCreation
		} );

		function finalizeCreation() {
			editor.widgets.finalizeCreation( temp );
		}
	}

	CKEDITOR.plugins.autoEmbed = {
		/**
		 * Gets definition of a widget that should be used to automatically embed the specified link.
		 *
		 * This method uses value of the {@link CKEDITOR.config#autoEmbed_widget} option.
		 *
		 * @since 4.5.0
		 * @param {CKEDITOR.editor} editor
		 * @param {String} url URL to be embedded.
		 * @returns {CKEDITOR.plugins.widget.definition/null} Definition of the widget to be used to embed the link.
		 */
		getWidgetDefinition: function( editor, url ) {
			var opt = editor.config.autoEmbed_widget || 'embed,embedSemantic',
				name,
				widgets = editor.widgets.registered;

			if ( typeof opt == 'string' ) {
				opt = opt.split( ',' );

				while ( ( name = opt.shift() ) ) {
					if ( widgets[ name ] ) {
						return widgets[ name ];
					}
				}
			} else if ( typeof opt == 'function' ) {
				return widgets[ opt( url ) ];
			}

			return null;
		}
	};

	/**
	 * Specifies which widget to use to automatically embed a link. The default value
	 * of this option defines that either the [Embed](ckeditor.com/addon/embed) or
	 * [Semantic Embed](ckeditor.com/addon/embedsemantic) widgets will be used, depending on which is enabled.
	 *
	 * The general behavior:
	 *
	 * * If string (widget names separated by commas) is provided, then first of the listed widgets which is registered
	 * will be used. For example, if `'foo,bar,bom'` is set and widgets `'bar'` and `'bom'` are registered, then `'bar'`
	 * will be used.
	 * * If a callback is specified, then it will be executed with the URL to be embedded and it should return a
	 * name of the widget to be used. It allows to use different embed widgets for different URLs.
	 *
	 * Example:
	 *
	 *		// Defines that embedSemantic should be used (regardless of whether embed is defined).
	 *		config.autoEmbed_widget = 'embedSemantic';
	 *
	 * Using with custom embed widgets:
	 *
	 *		config.autoEmbed_widget = 'customEmbed';
	 *
	 * **Note:** Plugin names are always lower case, while widget names are not, so widget names do not have to equal plugin names.
	 * For example, there is the `embedsemantic` plugin and `embedSemantic` widget.
	 *
	 * @since 4.5.0
	 * @cfg {String/Function} [autoEmbed_widget='embed,embedSemantic']
	 * @member CKEDITOR.config
	 */
} )();