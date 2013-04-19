/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'widgetvideo', {
	requires: 'widget',
	icons: 'widgetvideo',

	onLoad: function() {
		CKEDITOR.addCss( '\
			figure.video {\
				margin: 0 20px;\
			}\
		' );
	},

	init: function( editor ) {
		editor.widgets.add( 'video', {
			allowedContent: 'iframe[src,frameborder,width,height]; figure(video){float}',
			widgetTags: 'figure iframe',

			button: {
				label: 'Video'
			},

			template: new CKEDITOR.template(
				'<figure class="video" data-widget="video" style="float: {align}">' +
					'<iframe data-widget-property="iframe" src="{src}" frameborder="0" width="420" height="315"></iframe>' +
				'</figure>' ),

			defaults: {
				align: 'left',
				src: 'http://www.youtube-nocookie.com/embed/null?rel=0'
			},

			updateData: function() {
				this.data = {
					align: this.wrapper.getStyle( 'float' ),
					src: this.parts.iframe.getAttribute( 'src' )
				};
			},

			needsMask: true,

			init: function() {
				var element = this.element,
					that = this;

				var align = element.getStyle( 'float' );

				// Move float style from figure to wrapper.
				this.wrapper.setStyle( 'float', align );
				this.element.setStyle( 'float', '' );
			},

			dialog: {
				title: 'Edit Video',
				elements: [
					{
						type: 'text',
						id: 'src',
						label: 'YouTube Video URL',
						'default': 'http://',
						setup: function( widget ) {
							this.setValue( widget.data.src );
						},
						commit: function( widget ) {
							// http://www.youtube.com/watch?v=pCp2jTtay0w?rel=0
							// http://www.youtube.com/embed/pCp2jTtay0w?rel=0
							// http://www.youtube-nocookie.com/embed/pCp2jTtay0w?rel=0"
							// http://www.youtube.com/watch?v=JHFAVpX6TjA&feature=BFa&list=LL2AI-o2GTD8F-mfe44tg346
							// Regexp credits:
							// http://stackoverflow.com/questions/5830387/php-regex-find-all-youtube-video-ids-in-string/5831191#5831191

							var value = this.getValue();
							value = value.match( /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w]*(?:['"][^<>]*>|<\/a>))[?=&+%\w]*/i );
							value = value && value[ 1 ];
							value = 'http://www.youtube-nocookie.com/embed/' + value + '?rel=0';

							if ( widget.data.src != value )
								widget.parts.iframe.setAttribute( 'src', value );
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