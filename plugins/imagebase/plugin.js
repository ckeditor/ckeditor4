/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function isWidgetFocused( widget ) {
		return widget.editor.widgets.focused === widget;
	}

	function wrapInLink( img, linkData ) {
		var link = img.getDocument().createElement( 'a', {
			attributes: {
				href: linkData.url.url
			}
		} );

		link.replace( img );
		img.move( link );

		return link;
	}

	var featuresDefinitions = {
		link: {
			allowedContent: {
				a: {
					attributes: '!href'
				}
			},
			parts: {
				link: 'a'
			},

			init: function() {
				var widget = this;

				widget.editor.on( 'dialogShow', function( evt ) {
					var dialog = evt.data,
						displayTextField;

					if ( !isWidgetFocused( widget ) || dialog._.name !== 'link' ) {
						return;
					}

					displayTextField = dialog.getContentElement( 'info', 'linkDisplayText' ).getElement().getParent().getParent();

					dialog.setupContent( widget.data.link || {} );
					displayTextField.hide();

					dialog.once( 'ok', function( evt ) {
						if ( !isWidgetFocused( widget ) ) {
							return;
						}

						evt.stop();

						var data = {};

						dialog.commitContent( data );
						widget.setData( 'link', data );
					}, null, null, 9 );

					dialog.once( 'hide', function() {
						displayTextField.show();
					} );
				} );
			},

			data: function( evt ) {
				var link = evt.data.link,
					img = this.element.findOne( 'img' );

				if ( !link || !link.url.url ) {
					return;
				}

				wrapInLink( img, link );
			}
		}
	};

	function createWidgetDefinition( editor, definition ) {
		var defaultTemplate = new CKEDITOR.template(
			'<figure>' +
				'<img alt="" src="" />' +
				'<figcaption>{captionPlaceholder}</figcaption>' +
			'</figure>' ),
			baseDefinition;

		/**
		 * This is an abstract class that describes a definition of a basic image widget
		 * created by {@link CKEDITOR.plugins.imagebase#addImageWidget} method.
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
				figure: true,
				figcaption: true
			},

			requiredContent: 'figure; img[!src]',

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

			upcasts: {
				figure: function( element ) {
					if ( element.find( 'img' ).length === 1 ) {
						return element;
					}
				}
			}
		};

		definition = CKEDITOR.tools.object.merge( baseDefinition, definition );

		/**
		 * Image widget definition overrides {@link CKEDITOR.plugins.widget.definition#upcast} property.
		 * It's automatically set to enumerate keys of {@link #upcasts}.
		 * Avoid changes, unless you know what you're doing.
		 *
		 * @member CKEDITOR.plugins.imagebase.imageWidgetDefinition
		 * @property {String}
		 */
		definition.upcast = CKEDITOR.tools.objectKeys( definition.upcasts ).join( ',' );

		return definition;
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
		},

		addFeature: function( name, definition ) {
			var featureDefinition = featuresDefinitions[ name ];

			function mergeMethods( oldOne, newOne ) {
				if ( !oldOne && !newOne ) {
					return;
				}

				return function() {
					oldOne && oldOne.apply( this, arguments );
					newOne && newOne.apply( this, arguments );
				};
			}

			featureDefinition.init = mergeMethods( definition.init, featureDefinition.init );
			featureDefinition.data = mergeMethods( definition.data, featureDefinition.data );

			return CKEDITOR.tools.object.merge( definition, featureDefinition );
		}
	};
}() );
