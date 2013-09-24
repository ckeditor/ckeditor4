
/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "placeholder" plugin.
 *
 */

'use strict';

(function() {
	CKEDITOR.plugins.add( 'placeholder', {
		requires: 'widget,dialog',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'placeholder', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			// Register dialog.
			CKEDITOR.dialog.add( 'placeholder', this.path + 'dialogs/placeholder.js' );

			// Put ur init code here.
			editor.widgets.add( 'placeholder', {
				// Widget code.
				button: editor.lang.placeholder.button,
				dialog: 'placeholder',
				// We need to have wrapping element, otherwise there are issues in
				// add dialog.
				template: '<span>[[]]</span>',

				defaults: {
					name: editor.lang.placeholder.defaultName
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

			// Register styles for placeholder widget frame.
			CKEDITOR.addCss( '.cke_widget_wrapper *[data-widget="placeholder"]{background-color: #ffff00;}' );
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

						// Adds placeholder identifier as innertext.
						innerElement.add( new CKEDITOR.htmlParser.text( match ) );
						widgetWrapper = widgetRepo.wrapElement( innerElement, 'placeholder' );

						// Return outerhtml of widget wrapper so it will be placed
						// as replacement.
						return widgetWrapper.getOuterHtml();
					} );
				}
			} );
		}
	} );

})();
