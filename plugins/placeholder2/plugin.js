
/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "placeholder2" plugin.
 *
 */

(function() {

	/**
	 * @todo: change name data-ckeplaceholder to data-cke-placeholder
	 *
	 */

	'use strict';

	CKEDITOR.plugins.add( 'placeholder2', {
		requires: 'widget,dialog',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'placeholder2', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			// register dialog
			CKEDITOR.dialog.add( 'placeholder2', this.path + 'dialogs/placeholder2.js' );

			// put ur init code here
			editor.widgets.add( 'placeholder2', {
				allowedContent: 'span[class]',
				requiredContent: 'span',
				// Widget code.
				button: editor.lang.placeholder2.button,
				dialog: 'placeholder2',
				// we need to have wrapping element, otherwise there are issues in
				// add dialog
				template: '<span>[[]]</span>',

				defaults: {
					name: editor.lang.placeholder2.defaultName
				},

				downcast: function( widgetElement ) {
					return new CKEDITOR.htmlParser.text( '[[' + this.data.name + ']]' );
				},

				init: function() {
					// note that placeholder markup characters are stripped for the name
					var curText = this.element.getText();
					this.setData( 'name', curText.slice(2, -2) );
				},

				data: function( data ) {
					// change text node only when placeholder name was changed
					if ( this.data.name != this.element.getText() )
						this.element.setText( '[[' + this.data.name + ']]' );
				}

			} );
		},

		afterInit: function( editor ) {

			var widgetRepo = editor.widgets,
				placeholderReplaceRegex = /\[\[([^\[\]])+\]\]/g;

			editor.dataProcessor.dataFilter.addRules({
				text: function( text ) {
					return text.replace( placeholderReplaceRegex, function( match ) {

						// creating widget code
						var widgetWrapper = null,
							innerElement = new CKEDITOR.htmlParser.element( 'span' );
						// inner element gets decorated with extra attrs in wrapElement() method

						// adds placeholder identifier as innertext
						innerElement.add( new CKEDITOR.htmlParser.text( match ) );
						widgetWrapper = widgetRepo.wrapElement( innerElement, 'placeholder2' );

						// return outerhtml of widget wrapper so it will be placed
						// as replacement
						return widgetWrapper.getOuterHtml();
					});
				}
			});

		}
	} );

})();
