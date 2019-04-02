/* bender-tags: dialog */
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

function createSuccessfulCommittingTest( isCreation ) {
	return function() {
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

				isReady: function() {
					return !isCreation;
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

						// Widget's creation must be finalised only if it's being created...
						if ( isCreation ) {
							assert.isTrue( finalizeSpy.calledOnce, 'widgetsRepo.finalizeCreation was called once' );
							assert.areSame( 1, finalizeSpy.args[ 0 ][ 0 ] );
						} else {
							assert.isFalse( finalizeSpy.called, 'widgetsRepo.finalizeCreation was not called' );
						}
					}, 50 );
				}
			};

		this.spies.push( finalizeSpy );

		this.openDialog( editor, widget, function( d ) {
			dialog = d;
			dialog.setValueOf( 'info', 'url', 'bar' );
			dialog.getButton( 'ok' ).click();
		} );
	};
}

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
		}, widget );

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
			assert.areSame( editor.lang.embedbase.unsupportedUrlGiven, spy.args[ 0 ][ 0 ] );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	'test successful committing (new widget)': createSuccessfulCommittingTest( true ),

	'test successful committing (editing widget)': createSuccessfulCommittingTest( false ),

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

				getErrorMessage: function( msg, url, suffix ) {
					return msg + '-' + suffix;
				},

				loadContent: function( url, opts ) {
					// loadContent() is always async.
					wait( function() {
						opts.errorCallback( 'fetchingFailed' );

						assert.isTrue( dialog.getButton( 'ok' ).isEnabled(), 'ok button is enabled' );
						assert.isTrue( dialog.parts.dialog.isVisible(), 'dialog is open' );

						assert.isTrue( spy.calledOnce );
						assert.areSame( 'fetchingFailed-Given', spy.args[ 0 ][ 0 ] );

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
	},

	'test embedding cancelled before it\'s done': function() {
		var editor = this.editors.classic,
			widget = {
				data: {
					url: 'foo'
				},

				isUrlValid: function() {
					return true;
				},

				loadContent: function() {
					return {
						cancel: function() {
							// So far so good. If we reached here, it means that cancel function was called properly.
							assert.isTrue( true );
						}
					};
				}
			};

		this.openDialog( editor, widget, function( dialog ) {
			dialog.setValueOf( 'info', 'url', 'bar' );

			dialog.getButton( 'ok' ).click();
			dialog.getButton( 'cancel' ).click();
		} );
	}
} );
