/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function createWidgetDefinition( editor, definition ) {
		var defaultTemplate = new CKEDITOR.template(
			'<figure class="{basicClass}">' +
				'<img alt="" src="" />' +
				'<figcaption>{captionPlaceholder}</figcaption>' +
			'</figure>' ),
			baseDefinition;

		/**
		 * This is an abstract class that describes a definition of a basic image widget
		 * creted by {@link CKEDITOR.plugins.imagebase#createWidget} method.
		 *
		 * Note that because the image widget is a type of a widget, this definition extends
		 * {@link CKEDITOR.plugins.widget.definition}.
		 * It adds several parts of image and implements the basic version of
		 * {@link CKEDITOR.plugins.widget.definition#upcast} callback.
		 *
		 * @abstract
		 * @since 4.8.0
		 * @class CKEDITOR.plugins.imagebase.imageWidgetDefinition
		 * @mixins CKEDITOR.plugins.widget.definition
		 */
		baseDefinition = {
			pathName: editor.lang.imagebase.pathName,

			template: defaultTemplate,

			allowedContent: {
				img: {
					attributes: '!src,alt,width,height'
				},
				figure: {
					classes: '!imagebase'
				},
				figcaption: true
			},

			requiredContent: 'figure(!imagebase)',

			editables: {
				caption: {
					selector: 'figcaption',
					pathName: editor.lang.imagebase.pathNameCaption,
					allowedContent: 'br em strong sub sup u s; a[!href,target]'
				}
			},

			parts: {
				image: 'img',
				caption: 'figcaption'
			},

			/**
			 * Image widget definition overwrites the {@link CKEDITOR.plugins.widget.definition#upcast} property.
			 * This should not be changed.
			 *
			 * @property {Function}
			 */
			upcast: function( element ) {
				// http://dev.ckeditor.com/ticket/11110 Don't initialize on pasted fake objects.
				if ( element.attributes[ 'data-cke-realelement' ] ) {
					return;
				}

				if ( element.name === 'figure' && element.hasClass( 'imagebase' ) ) {
					return element;
				}
			}
		};

		return CKEDITOR.tools.object.merge( baseDefinition, definition );
	}

	CKEDITOR.plugins.add( 'imagebase', {
		requires: 'widget',
		lang: 'en'
	} );

	/**
	 * Namespace providing a set of helper functions for working with image widgets.
	 *
	 * @since 4.8.0
	 * @singleton
	 * @class CKEDITOR.plugins.imagebase
	 */
	CKEDITOR.plugins.imagebase = {
		/**
		 * Registers a new widget based on passed definition.
		 *
		 * @param {CKEDITOR.editor} editor Editor that will get the widget registered.
		 * @param {String} name Widget name.
		 * @param {CKEDITOR.plugins.imagebase.imageWidgetDefinition} definition Widget's definition.
		 */
		addImageWidget: function( editor, name, definition ) {
			var widget = editor.widgets.add( name, createWidgetDefinition( editor, definition ) );

			editor.addFeature( widget );
		}
	};
}() );
