/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'widgetcaption', {
	requires: 'widget',
	icons: 'widgetcaption',

	onLoad: function() {
		CKEDITOR.addCss( '\
			figure.caption figcaption {\
				text-align: center;\
			}\
			figure.caption {\
				border: solid 1px #ccc;\
				border-radius: 2px;\
				background: rgba(0,0,0,0.05);\
				padding: 20px 20px 10px;\
				display: table;\
				width: 1px;\
			}\
		' );
	},

	init: function( editor ) {
		editor.widgets.add( 'caption', {
			allowedContent: 'figure(caption){float}; img[alt,src]; figcaption',
			widgetTags: 'figure img figcaption',

			button: {
				label: 'Captioned Image'
			},

			template: new CKEDITOR.template(
				'<figure class="caption" data-widget="caption" style="float: {align}">' +
					'<img alt="" src="{src}" data-widget-property="image" />' +
					'<figcaption data-widget-property="caption">{caption}</figcaption>' +
				'</figure>' ),

			defaults: {
				align: 'left',
				caption: 'Caption',
				src: this.path + 'images/empty.png'
			},

			updateData: function() {
				this.data = {
					align: this.wrapper.getStyle( 'float' ),
					caption: this.parts.caption.getHtml(),
					src: this.parts.image.getAttribute( 'src' )
				};
			},

			init: function() {
				var align = this.element.getStyle( 'float' );

				// Move float style from figure to wrapper.
				this.wrapper.setStyle( 'float', align );
				this.element.setStyle( 'float', '' );

				this.parts.image.$.draggable = false;
			},

			// Returns object with nested elements that are editable part of this widget.
			// This data-widget-property is replaced with returned object during widget initialization.
			editables: function() {
				return {
					caption: this.element.getElementsByTag( 'figcaption' ).getItem( 0 )
				};
			},

			dialog: {
				title: 'Edit Captioned Image',
				elements: [
					{
						type: 'text',
						id: 'url',
						label: 'Image URL',
						'default': 'http://',
						setup: function( widget ) {
							this.setValue( widget.data.src );
						},
						commit: function( widget ) {
							widget.parts.image.setAttribute( 'src', this.getValue() );
						}
					},
					{
						id: 'align',
						type: 'radio',
						items : [ [ 'Left', 'left' ], [ 'None', 'none' ], [ 'Right', 'right' ] ],
						label: 'Alignment',
						'default': 'none',
						setup: function( widget ) {
							this.setValue( widget.data.align );
						},
						commit: function( widget ) {
							widget.wrapper.setStyle( 'float', this.getValue() );
						}
					}
				]
			}
		});
	}
});