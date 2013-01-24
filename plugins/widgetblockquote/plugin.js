/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'widgetblockquote', {
	requires: 'widget',
	icons: 'widgetblockquote',

	onLoad: function() {
		CKEDITOR.addCss( '\
			figure.blockquote {\
				font-style: italic;\
				font-family: Georgia, Times, "Times New Roman", serif;\
				padding: 2px 0;\
				border-style: solid;\
				border-color: #ccc;\
				border-width: 0;\
			}\
			.cke_contents_ltr figure.blockquote {\
				padding-left: 20px;\
				padding-right: 8px;\
				border-left-width: 5px;\
			}\
			.cke_contents_ltr figure.blockquote blockquote {\
				padding: 0;\
				margin: 0;\
				border-left-width: 0;\
				font-size: large;\
			}\
			.cke_contents_ltr figure.blockquote blockquote p {\
				margin: 10px 0;\
			}\
			.cke_contents_ltr figure.blockquote figcaption {\
				margin-bottom: 5px;\
			}\
		' );
	},

	init: function( editor ) {
		editor.widgets.add( 'blockquote', {
			allowedContent: 'figure(blockquote); blockquote; figcaption{display}',
			widgetTags: 'figure figcaption',

			button: {
				label: 'Quote'
			},

			template: new CKEDITOR.template(
				'<figure class="blockquote" data-widget="blockquote">' +
					'<blockquote>{quote}</blockquote>' +
					'<figcaption data-widget-property="caption" {captionStyle}>{caption}</figcaption>' +
				'</figure>' ),

			defaults: {
				quote: '<p>Quote</p>',
				caption: 'Caption',
				captionStyle: ''
			},

			updateData: function() {
				var captionHidden = this.editables.caption.getStyle( 'display' ) == 'none';

				this.data = {
					quote: this.editables.quote.getHtml(),
					caption: this.editables.caption.getHtml(),
					captionHidden: captionHidden,
					captionStyle: captionHidden ? 'style="display:none"' : ''
				};
			},

			// Returns object with nested elements that are editable part of this widget.
			// This data-widget-property is replaced with returned object during widget initialization.
			editables: function() {
				return {
					quote: this.element.getElementsByTag( 'blockquote' ).getItem( 0 ),
					caption: this.element.getElementsByTag( 'figcaption' ).getItem( 0 )
				};
			},

			dialog: {
				title: 'Edit Quote',
				minHeight: 40,
				elements: [
					{
						id: 'caption',
						type: 'checkbox',
						label: 'Hide caption',
						'default': '',
						value: "checked",
						setup: function( widget ) {
							this.setValue( widget.data.captionHidden );
						},
						commit: function( widget ) {
							widget.parts.caption.setStyle( 'display', this.getValue() ? 'none' : '' );
						}
					}
				]
			}
		});
	}
});