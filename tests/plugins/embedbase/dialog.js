/* bender-ckeditor-plugins: embedbase,toolbar */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace',
		config: {
			dialog_noConfirmCancel: true
		}
	}
};

bender.test( {
	spies: [],

	tearDown: function() {
		var spy;

		while ( spy = this.spies.pop() ) {
			spy.restore();
		}
	},

	openDialog: function( editor, widget, callback ) {
		editor.openDialog( 'embedBase', function( dialog ) {
			dialog.widget = widget;

			dialog.once( 'show', function() {
				dialog.setupContent( widget );

				resume( function() {
					callback( dialog );
				} );
			} );
		} );

		wait();
	},

	'test widget data is loaded into the dialog': function() {
		var editor = this.editors.classic,
			widget = {
				data: {
					url: 'foo'
				}
			};

		this.openDialog( editor, widget, function( dialog ) {
			assert.areSame( 'foo', dialog.getValueOf( 'info', 'url' ) );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	'test URL validation': function() {
		var editor = this.editors.classic,
			spy = sinon.stub( window, 'alert' ),
			widget = {
				data: {
					url: 'foo'
				},

				isUrlValid: function( url ) {
					// This way we also check that foo was passed.
					return ( url != 'foo' );
				}
			};

		this.spies.push( spy );

		this.openDialog( editor, widget, function( dialog ) {
			dialog.getButton( 'ok' ).click();

			assert.isTrue( spy.calledOnce );
			assert.areSame( editor.lang.embedbase.invalidUrl, spy.args[ 0 ][ 0 ] );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	'test successful committing': function() {
		var editor = this.editors.classic,
			dialog,
			finalizeSpy = sinon.stub( CKEDITOR.plugins.widget.repository.prototype, 'finalizeCreation' ),
			widget = {
				wrapper: {
					getParent: function() {
						return 1;
					}
				},

				data: {
					url: 'foo'
				},

				isUrlValid: function() {
					return true;
				},

				loadContent: function( url, opts ) {
					assert.areSame( 'bar', url, 'url' );
					assert.isTrue( opts.noNotifications, 'no notifications' );
					assert.isFalse( dialog.getButton( 'ok' ).isEnabled(), 'ok button is disabled' );
					assert.isTrue( dialog.parts.dialog.isVisible(), 'dialog is open' );

					// loadContent() is always async.
					wait( function() {
						opts.callback();

						assert.isTrue( dialog.getButton( 'ok' ).isEnabled(), 'ok button is enabled' );
						assert.isFalse( dialog.parts.dialog.isVisible(), 'dialog is hidden' );

						assert.isTrue( finalizeSpy.calledOnce );
						assert.areSame( 1, finalizeSpy.args[ 0 ][ 0 ] );
					}, 50 );
				}
			};

		this.spies.push( finalizeSpy );

		this.openDialog( editor, widget, function( d ) {
			dialog = d;
			dialog.setValueOf( 'info', 'url', 'bar' );
			dialog.getButton( 'ok' ).click();
		} );
	},

	'test unsuccessful committing': function() {
		var editor = this.editors.classic,
			dialog,
			spy = sinon.stub( window, 'alert' ),
			widget = {
				data: {
					url: 'foo'
				},

				isUrlValid: function() {
					return true;
				},

				loadContent: function( url, opts ) {
					// loadContent() is always async.
					wait( function() {
						opts.errorCallback();

						assert.isTrue( dialog.getButton( 'ok' ).isEnabled(), 'ok button is enabled' );
						assert.isTrue( dialog.parts.dialog.isVisible(), 'dialog is open' );

						assert.isTrue( spy.calledOnce );
						assert.areSame( editor.lang.embedbase.fetchingGivenFailed, spy.args[ 0 ][ 0 ] );

						dialog.getButton( 'cancel' ).click();
					}, 50 );
				}
			};

		this.spies.push( spy );

		this.openDialog( editor, widget, function( d ) {
			dialog = d;
			dialog.setValueOf( 'info', 'url', 'bar' );
			dialog.getButton( 'ok' ).click();
		} );
	}
} );