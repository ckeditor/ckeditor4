
/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "placeholder2" plugin.
 *
 */

'use strict';

(function() {
	CKEDITOR.plugins.add( 'placeholder2', {
		requires: 'widget,dialog',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'placeholder2', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			// Register dialog.
			CKEDITOR.dialog.add( 'placeholder2', this.path + 'dialogs/placeholder2.js' );

			// Put ur init code here.
			editor.widgets.add( 'placeholder2', {
				// Widget code.
				button: editor.lang.placeholder2.button,
				dialog: 'placeholder2',
				// We need to have wrapping element, otherwise there are issues in
				// add dialog.
				template: '<span>[[]]</span>',

				defaults: {
					name: editor.lang.placeholder2.defaultName
				},

				downcast: function( widgetElement ) {
					return new CKEDITOR.htmlParser.text( '[[' + this.data.name + ']]' );
				},

				init: function() {
					// Note that placeholder markup characters are stripped for the name.
					this.setData( 'name', this.element.getText().slice( 2, -2 ) );
				},

				data: function( data ) {
					this.element.setText( '[[' + this.data.name + ']]' );
				}

			} );

			// Registers styles for placeholder widget frame.
			CKEDITOR.addCss( '.cke_widget_wrapper *[data-widget="placeholder2"]{background-color: #ffff00;}' );
		},

		afterInit: function( editor ) {
			var widgetRepo = editor.widgets,
				placeholderReplaceRegex = /\[\[([^\[\]])+\]\]/g;

			editor.dataProcessor.dataFilter.addRules( {
				text: function( text ) {
					return text.replace( placeholderReplaceRegex, function( match ) {
						// Creating widget code.
						var widgetWrapper = null,
							innerElement = new CKEDITOR.htmlParser.element( 'span' );
						// Inner element gets decorated with extra attrs in wrapElement() method.

						// Adds placeholder identifier as innertext.
						innerElement.add( new CKEDITOR.htmlParser.text( match ) );
						widgetWrapper = widgetRepo.wrapElement( innerElement, 'placeholder2' );

						// Return outerhtml of widget wrapper so it will be placed
						// as replacement.
						return widgetWrapper.getOuterHtml();
					} );
				}
			} );
		}
	} );

})();
