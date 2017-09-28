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

		return {
			pathName: editor.lang.imagebase.pathName,
			template: defaultTemplate,
			allowedContent: {
				img: {
					attributes: '!src,alt,width,height'
				},
				figure: {
					classes: '!' + joinClasses( options.basicClass, options.additionalClasses )
				},
				figcaption: true
			},
			requiredContent: 'figure(!' + options.basicClass + ')',

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

			upcast: function( element ) {
				// http://dev.ckeditor.com/ticket/11110 Don't initialize on pasted fake objects.
				if ( element.attributes[ 'data-cke-realelement' ] ) {
					return;
				}

				if ( element.name === 'figure' && element.hasClass( options.basicClass ) ) {
					return element;
				}
			},

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

	CKEDITOR.plugins.imagebase = {
		createWidget: function( editor, name, options ) {
			var widget = editor.widgets.add( name, createWidgetDefinition( editor, options ) );

			editor.addFeature( widget );
		}
	};
}() );

