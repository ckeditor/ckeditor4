/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function createWidgetDefinition( editor, options ) {
		var defaultTemplate = new CKEDITOR.template(
			'<figure class="{basicClass}">' +
				'<img alt="" src="" />' +
				'<figcaption>{captionPlaceholder}</figcaption>' +
			'</figure>' );

		function joinClasses( basicClass, additionalClasses ) {
			var toApply = additionalClasses.slice();

			toApply.unshift( basicClass );

			return toApply.join( ',' );
		}

		/**
		 * This is an abstract class that describes a definition of an image widget.
		 * It is a return type of {@link CKEDITOR.plugins.imagebase#createWidget} method.
		 *
		 * Note that because the image widget is a type of a widget, this definition extends
		 * {@link CKEDITOR.plugins.widget.definition}.
		 * It adds several parts of image and implements the {@link CKEDITOR.plugins.widget.definition#upcast} callback.
		 * This callback should not be overwritten.
		 *
		 * @abstract
		 * @class CKEDITOR.plugins.imagebase.imageWidgetDefinition
		 * @mixins CKEDITOR.plugins.widget.definition
		 */
		return {
			/**
			 * @inheritdoc
			 */
			pathName: editor.lang.imagebase.pathName,

			/**
			 * @inheritdoc
			 */
			template: defaultTemplate,

			/**
			 * @inheritdoc
			 */
			allowedContent: {
				img: {
					attributes: '!src,alt,width,height'
				},
				figure: {
					classes: '!' + joinClasses( options.basicClass, options.additionalClasses )
				},
				figcaption: true
			},

			/**
			 * @inheritdoc
			 */
			requiredContent: 'figure(!' + options.basicClass + ')',

			/**
			 * @inheritdoc
			 */
			editables: {
				caption: {
					selector: 'figcaption',
					pathName: editor.lang.imagebase.pathNameCaption,
					allowedContent: options.captionAllowedContent
				}
			},

			/**
			 * @inheritdoc
			 */
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

				if ( element.name === 'figure' && element.hasClass( options.basicClass ) ) {
					return element;
				}
			},

			/**
			 * Invokes user defined widget initialization method.
			 *
			 * @property {Function}
			 */
			init: function() {
				if ( options.init ) {
					options.init.call( this );
				}
			}
		};
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
		 * Registers a new widget definition based on passed options.
		 *
		 * @since 4.8.0
		 * @param {CKEDITOR.editor} editor Editor that will get the definition registered.
		 * @param {String} name Widget name.
		 * @param {Object} options Widget's options.
		 * @param {String} options.basicClass Primary class for widget's element, that allows to properly
		 * identify the widget.
		 * @param {String[]} options.additionalClasses Additional classes that could be applied to widget's
		 * element.
		 * @param {CKEDITOR.filter.allowedContentRules} options.captionAllowedContent Allowed content inside
		 * image's caption.
		 * @param {Function} options.init Widget's initialization method.
		 */
		createWidget: function( editor, name, options ) {
			var widget = editor.widgets.add( name, createWidgetDefinition( editor, options ) );

			editor.addFeature( widget );
		}
	};
}() );
