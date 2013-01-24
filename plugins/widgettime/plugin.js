/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'widgettime', {
	requires: 'widget',
	icons: 'widgettime',

	onLoad: function() {
		CKEDITOR.addCss( '\
			span.time {\
				padding: 2px 5px;\
				color: #fff;\
				font-weight: bold;\
				background: #00B2F0;' +
				CKEDITOR.tools.cssVendorPrefix( 'border-radius', '3px', true ) +
			'}\
		' );
	},

	init: function( editor ) {
		var timeTemplate = new CKEDITOR.template( '{h}:{m}{s}{utc}' );
		function trailing( digit ) {
			return ( '0' + digit ).slice( -2 );
		}

		function getTime( date, utc, seconds ) {
			var prefix = utc ? 'UTC' : '';

			return timeTemplate.output( {
				h: trailing( date[ 'get' + prefix + 'Hours' ]() ),
				m: trailing( date[ 'get' + prefix + 'Minutes' ]() ),
				s: seconds ? ':' + trailing( date[ 'get' + prefix + 'Seconds' ]() ) : '',
				utc: utc ? ' UTC' : ''
			});
		}

		editor.widgets.add( 'time', {
			allowedContent: 'span(time)[timestamp,utc,seconds]',
			widgetTags: 'span',

			button: {
				label: 'Time'
			},

			template: new CKEDITOR.template( '<span class="time" data-widget="time" timestamp={timestamp} utc={utc} seconds={showSeconds}>{time}</span>' ),

			defaults: {
				time: '',
				utc: '',
				timestamp: '',
				seconds: ''
			},

			inline: true,

			init: function() {
				// Try reading existing timestamp.
				var timestamp = +this.element.getAttribute( 'timestamp' );

				// If no timestamp, create new date.
				if ( !timestamp ) {
					this.date = new Date();
					this.element.setAttribute( 'timestamp', +this.date );
				}
				else
					this.date = new Date( timestamp );
			},

			updateData: function() {
				this.data = {};
				this.data.timestamp = +this.date;
				this.data.utc = this.element.getAttribute( 'utc' ) === 'true';
				this.data.showSeconds = this.element.getAttribute( 'seconds' ) === 'true';

				this.element.setText( ( this.data.time = getTime( this.date, this.data.utc, this.data.showSeconds ) ) );
			},

			dialog: {
				title: 'Edit Time',
				minHeight: 40,
				elements: [
					{
						id: 'utc',
						type: 'checkbox',
						label: 'UTC',
						'default': '',
						value: "checked",
						setup: function( widget ) {
							this.setValue( widget.data.utc );
						},
						commit: function( widget ) {
							widget.element.setAttribute( 'utc', this.getValue() );
						}
					},
					{
						id: 'seconds',
						type: 'checkbox',
						label: 'Show seconds',
						'default': '',
						value: "checked",
						setup: function( widget ) {
							this.setValue( widget.data.showSeconds );
						},
						commit: function( widget ) {
							widget.element.setAttribute( 'seconds', this.getValue() );
						}
					}
				]
			}
		});
	}
});